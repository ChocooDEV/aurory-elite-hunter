import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Battle {
  created_at: string;
  result: 'win' | 'loss';
  opponent: {
    player_id?: string;
    id?: string;
    player_name: string;
  };
  event: string;
}

interface Player {
  player_id: string;
  player_name: string;
  profile_picture: {
    url: string;
  };
}

interface ApiResponse {
  player: {
    player_id: string;
    player_name: string;
  };
  matches: {
    data: Battle[];
    current_page: number;
    total_pages: number;
    total_elements: number;
  };
}

const eliteSpecialPeriods: {
  [eliteName: string]: { start: Date; end: Date }[];
} = {
  kandaroshi: [
    { start: new Date('2025-07-12T15:00:00Z'), end: new Date('2025-07-12T17:00:00Z') }
  ],
  OdinVikings: [
    { start: new Date('2025-07-15T14:00:00Z'), end: new Date('2025-07-15T16:00:00Z') }
  ],
  Myr: [
    { start: new Date('2025-07-18T23:00:00Z'), end: new Date('2025-07-19T01:00:00Z') }
  ],
  Tim: [
    { start: new Date('2025-07-21T17:00:00Z'), end: new Date('2025-07-21T19:00:00Z') }
  ],
  gummer: [
    { start: new Date('2025-07-24T16:00:00Z'), end: new Date('2025-07-24T18:00:00Z') }
  ],
  DeGenZardGoC: [
    { start: new Date('2025-07-27T18:00:00Z'), end: new Date('2025-07-27T20:00:00Z') }
  ],
  FarmerJoe: [
    { start: new Date('2025-07-30T19:00:00Z'), end: new Date('2025-07-30T21:00:00Z') }
  ]
};

function isInSpecialPeriod(eliteName: string, matchDate: Date): boolean {
  const periods = eliteSpecialPeriods[eliteName];
  if (!periods) return false;
  return periods.some(period => matchDate >= period.start && matchDate <= period.end);
}

export async function GET() {
  try {
    console.log('Starting leaderboard update...');

    // Get all Elite players
    const elitePlayers = await prisma.leaderboardElite.findMany();
    
    // Track processing stats for debugging
    const processingStats: { [eliteName: string]: { processed: number, skipped: number, points: number } } = {};
    
    for (const elite of elitePlayers) {
      processingStats[elite.name] = { processed: 0, skipped: 0, points: 0 };
      console.log(`Processing matches for Elite: ${elite.name}`);
      
      try {
        // Get the latest processed match timestamp for this Elite
        const latestMatch = await prisma.computedMatch.findFirst({
          where: { eliteName: elite.name },
          orderBy: { createdAt: 'desc' },
          select: { createdAt: true }
        });
        const sinceDate = latestMatch?.createdAt ? new Date(latestMatch.createdAt) : new Date('2025-07-01T00:00:00Z');

        // Fetch all pages of matches for this Elite player
        let currentPage = 0;
        let totalPages = 1;
        let allBattles: Battle[] = [];
        
        do {
          console.log(`Fetching page ${currentPage + 1} for ${elite.name}...`);
          
          const matchesResponse = await fetch(
            `https://aggregator-api.live.aurory.io/v1/player-matches?player_id_or_name=${encodeURIComponent(elite.name)}&order_by=created_at&direction=desc&event=JULY_2025&page=${currentPage}`
          );
          
          if (!matchesResponse.ok) {
            console.error(`Failed to fetch matches for ${elite.name} on page ${currentPage}:`, matchesResponse.status);
            break;
          }
          
          const responseData: ApiResponse = await matchesResponse.json();
          const battles: Battle[] = responseData.matches.data;
          
          // Update total pages on first request
          if (currentPage === 0) {
            totalPages = responseData.matches.total_pages;
            console.log(`Total pages for ${elite.name}: ${totalPages} (${responseData.matches.total_elements} total matches)`);
          }
          
          allBattles = allBattles.concat(battles);
          currentPage++;
          
          // Add a small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } while (currentPage < totalPages);
        
        // Now filter and process only new matches
        const newBattles = allBattles.filter(battle => new Date(battle.created_at) > sinceDate);
        console.log(`Found ${newBattles.length} new battles for ${elite.name}`);
        
        // Process each new battle
        for (const battle of newBattles) {
          // Skip CPU battles
          if (battle.opponent.player_name === 'CPU' || battle.opponent.id === 'CPU') {
            continue;
          }
          
          // Create unique match identifier
          const playerNames = [elite.name, battle.opponent.player_name].sort();
          const uniqueMatchId = `${playerNames[0]}-vs-${playerNames[1]}-${battle.created_at}`;
          
          // Check if this match is already in computed_matches (DB check, not just in-memory)
          const alreadyProcessed = await prisma.computedMatch.findUnique({ where: { matchId: uniqueMatchId } });
          if (alreadyProcessed) {
            processingStats[elite.name].skipped++;
            continue;
          }
          processingStats[elite.name].processed++;
          
          // Mark this match as processed in DB
          await prisma.computedMatch.create({
            data: {
              matchId: uniqueMatchId,
              eliteName: elite.name,
              opponentName: battle.opponent.player_name,
              result: battle.result,
              winnerName: battle.result === 'win' ? elite.name : battle.opponent.player_name,
              loserName: battle.result === 'win' ? battle.opponent.player_name : elite.name
            }
          });

          const opponentName = battle.opponent.player_name;
          const opponentId = battle.opponent.player_id || battle.opponent.id;
          const opponentIsElite = await prisma.leaderboardElite.findFirst({ where: { name: opponentName } });

          // --- Special period logic ---
          const matchDate = new Date(battle.created_at);
          const useSpecialPointsPerLoss = isInSpecialPeriod(elite.name, matchDate);
          const pointsPerLossForThisMatch = useSpecialPointsPerLoss ? 5 : Number(elite.pointsPerLoss);
          // --- End special period logic ---

          if (opponentIsElite) {
            // Elite vs Elite
            if (battle.result === 'win') {
              // elite wins, opponent loses
              const opponentSpecial = isInSpecialPeriod(opponentIsElite.name, matchDate);
              const opponentPointsPerLoss = opponentSpecial ? 5 : Number(opponentIsElite.pointsPerLoss);
              await prisma.leaderboardElite.update({ where: { id: elite.id }, data: { pointsEarned: { increment: opponentPointsPerLoss } } });
              await prisma.leaderboardElite.update({ where: { id: opponentIsElite.id }, data: { pointsEarned: { decrement: 3 } } });
            } else {
              // elite loses, opponent wins
              const eliteSpecial = isInSpecialPeriod(elite.name, matchDate);
              const elitePointsPerLoss = eliteSpecial ? 5 : Number(elite.pointsPerLoss);
              await prisma.leaderboardElite.update({ where: { id: elite.id }, data: { pointsEarned: { decrement: 3 } } });
              await prisma.leaderboardElite.update({ where: { id: opponentIsElite.id }, data: { pointsEarned: { increment: elitePointsPerLoss } } });
            }
          } else {
            // Elite vs Hunter
            if (battle.result === 'win') {
              await prisma.leaderboardElite.update({ where: { id: elite.id }, data: { pointsEarned: { increment: 1 } } });
            } else {
              await prisma.leaderboardElite.update({ where: { id: elite.id }, data: { pointsEarned: { decrement: 3 } } });
              // Hunter points logic (as before)
              const pointsToAdd = pointsPerLossForThisMatch;
              const hunter = await prisma.leaderboardHunter.findFirst({ where: { name: opponentName } });
              if (hunter) {
                await prisma.leaderboardHunter.update({ where: { id: hunter.id }, data: { pointsEarned: { increment: pointsToAdd } } });
              } else {
                try {
                  const playerResponse = await fetch(`https://aggregator-api.live.aurory.io/v2/players/${encodeURIComponent(opponentId || '')}`);
                  let hunterAvatar = 'https://images.cdn.aurory.io/items/aurorian-default.png';
                  if (playerResponse.ok) {
                    const playerData: Player = await playerResponse.json();
                    hunterAvatar = playerData.profile_picture.url || hunterAvatar;
                  }
                  await prisma.leaderboardHunter.create({
                    data: {
                      name: opponentName,
                      title: opponentId,
                      pointsEarned: pointsToAdd,
                      badge: '',
                      avatar: hunterAvatar
                    }
                  });
                } catch (error) {
                  await prisma.leaderboardHunter.create({
                    data: {
                      name: opponentName,
                      title: opponentId,
                      pointsEarned: pointsToAdd,
                      badge: '',
                      avatar: 'https://images.cdn.aurory.io/items/aurorian-default.png'
                    }
                  });
                  console.error(`Error creating hunter: ${error}`);
                }
              }
              
              // === BADGE LOGIC START ===
              const hunterForBadges = await prisma.leaderboardHunter.findFirst({
                where: { name: opponentName }
              });
              
              if (hunterForBadges) {
                // 1. Record the win
                await prisma.hunterWin.create({
                  data: {
                    hunterName: opponentName,
                    defeatedEliteName: elite.name
                  }
                });
                
                // 2. Get all wins for the hunter
                const allWins = await prisma.hunterWin.findMany({
                  where: { hunterName: opponentName }
                });
                
                // 3. Calculate stats
                const totalWins = allWins.length;
                const uniqueElitesDefeated = new Set(allWins.map((w: { defeatedEliteName: string }) => w.defeatedEliteName)).size;
                
                // 4. Define badges in order
                const badgeDefinitions = [
                  { url: 'https://i.imgur.com/we0BROn.png', condition: uniqueElitesDefeated >= 3 },
                  { url: 'https://i.imgur.com/eKd2RWn.png', condition: totalWins >= 5 },
                  { url: 'https://i.imgur.com/C97oxg3.png', condition: totalWins >= 30 },
                  { url: 'https://i.imgur.com/2G25sjj.png', condition: uniqueElitesDefeated >= 15 },
                ];
                
                // 5. Construct the new badge string
                const newBadges = badgeDefinitions
                  .filter(badge => badge.condition)
                  .map(badge => badge.url);
                
                const newBadgeString = newBadges.join(',');
                
                // 6. Update hunter if badges have changed
                if (newBadgeString !== hunterForBadges.badge) {
                  await prisma.leaderboardHunter.update({
                    where: { id: hunterForBadges.id },
                    data: { badge: newBadgeString }
                  });
                }
              }
              // === BADGE LOGIC END ===
            }
          }
        }
      } catch (error) {
        console.error(`Error processing matches for ${elite.name}:`, error);
      }
    }

    console.log('Leaderboard update completed successfully');
    return NextResponse.json({ 
      success: true, 
      updated: new Date().toISOString(),
      message: 'Leaderboard updated successfully'
    });
    
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ 
      error: 'Failed to update leaderboard',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 