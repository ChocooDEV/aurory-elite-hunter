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

export async function GET() {
  try {
    // Verify the request is from Vercel Cron
   /* const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
*/
    console.log('Starting leaderboard update...');

    // Get all Elite players
    const elitePlayers = await prisma.leaderboardElite.findMany();
    
    for (const elite of elitePlayers) {
      console.log(`Processing matches for Elite: ${elite.name}`);
      
      try {
        // Get the latest processed match timestamp for this Elite
        const latestProcessedMatch = await prisma.computedMatch.findFirst({
          where: { eliteName: elite.name },
          orderBy: { createdAt: 'desc' },
          select: { createdAt: true }
        });
        
        // Only fetch matches newer than the last processed match
        const sinceDate = latestProcessedMatch?.createdAt || new Date('2025-06-01T00:00:00Z');
        console.log(`Fetching matches for ${elite.name} since ${sinceDate.toISOString()}`);
        
        // Fetch all pages of matches for this Elite player
        let currentPage = 0;
        let totalPages = 1;
        let allBattles: Battle[] = [];
        let hasNewMatches = false;
        
        do {
          console.log(`Fetching page ${currentPage + 1} for ${elite.name}...`);
          
          const matchesResponse = await fetch(
            `https://aggregator-api.live.aurory.io/v1/player-matches?player_id_or_name=${encodeURIComponent(elite.name)}&order_by=created_at&direction=desc&event=JUNE_2025&page=${currentPage}`
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
          
          // Filter out old matches and stop if we hit processed matches
          const newBattles = battles.filter(battle => {
            const battleDate = new Date(battle.created_at);
            return battleDate > sinceDate;
          });
          
          if (newBattles.length === 0) {
            console.log(`No new matches found for ${elite.name} on page ${currentPage + 1}, stopping pagination`);
            break;
          }
          
          allBattles = allBattles.concat(newBattles);
          hasNewMatches = true;
          currentPage++;
          
          // Add a small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } while (currentPage < totalPages);
        
        if (!hasNewMatches) {
          console.log(`No new matches for ${elite.name}, skipping processing`);
          continue;
        }
        
        console.log(`Found ${allBattles.length} new battles for ${elite.name}`);
        
        // Process each battle
        for (const battle of allBattles) {
          // Skip CPU battles
          if (battle.opponent.player_name === 'CPU' || battle.opponent.id === 'CPU') {
            continue;
          }
          
          // Check if we already computed this battle
          const matchId = `${elite.name}-${battle.opponent.player_id || battle.opponent.id}-${battle.created_at}`;
          
          // Create a unique match identifier that works regardless of perspective
          // Sort player names alphabetically to ensure consistent matchId regardless of who we're processing
          const playerNames = [elite.name, battle.opponent.player_name].sort();
          const uniqueMatchId = `${playerNames[0]}-vs-${playerNames[1]}-${battle.created_at}`;
          
          const existingMatch = await prisma.computedMatch.findFirst({
            where: {
              OR: [
                { matchId },
                { matchId: uniqueMatchId }
              ]
            }
          });
          
          if (existingMatch) {
            console.log(`[${elite.name}] Skipping already processed match: ${matchId} (found existing match: ${existingMatch.matchId})`);
            continue; 
          }
          
          const opponentName = battle.opponent.player_name;
          const opponentId = battle.opponent.player_id || battle.opponent.id;
          
          // Check if the opponent is an Elite player
          const opponentIsElite = await prisma.leaderboardElite.findFirst({
            where: { name: opponentName }
          });
          
          let matchResult: string;
          let winnerName: string;
          let loserName: string;
          
          // Check if Elite won or lost
          if (battle.result === 'win') {
            // Elite won
            matchResult = 'elite_win';
            winnerName = elite.name;
            loserName = opponentName;
            
            if (opponentIsElite) {
              // Elite vs Elite: winner gets the loser's pointsPerLoss
              const pointsToWin = Number(opponentIsElite.pointsPerLoss);
              console.log(`[${elite.name}] Elite vs Elite WIN: +${pointsToWin} points (against ${opponentName})`);
              await prisma.leaderboardElite.update({
                where: { id: elite.id },
                data: {
                  pointsEarned: {
                    increment: pointsToWin
                  }
                }
              });
            } else {
              // Elite vs Hunter: winner gets +1 point
              console.log(`[${elite.name}] Elite vs Hunter WIN: +1 point (against ${opponentName})`);
              await prisma.leaderboardElite.update({
                where: { id: elite.id },
                data: {
                  pointsEarned: {
                    increment: 1
                  }
                }
              });
            }
          } else {
            // Elite lost (battle.result === 'loss'), elite loses 3 points
            matchResult = 'elite_loss';
            winnerName = opponentName;
            loserName = elite.name;
            
            console.log(`[${elite.name}] LOSS: -3 points (against ${opponentName})`);
            await prisma.leaderboardElite.update({
              where: { id: elite.id },
              data: {
                pointsEarned: {
                  decrement: 3
                }
              }
            });
            
            if (opponentIsElite) {
              // Elite vs Elite: winning Elite gets the losing Elite's pointsPerLoss
              const pointsToWin = Number(elite.pointsPerLoss);
              console.log(`[${opponentName}] Elite vs Elite WIN: +${pointsToWin} points (against ${elite.name})`);
              await prisma.leaderboardElite.update({
                where: { id: opponentIsElite.id },
                data: {
                  pointsEarned: {
                    increment: pointsToWin
                  }
                }
              });
            } else {
              // Opponent is a Hunter - give them points
              const pointsToAdd = Number(elite.pointsPerLoss);
              
              // Check if hunter already exists in LeaderboardHunter
              const hunter = await prisma.leaderboardHunter.findFirst({
                where: { name: opponentName }
              });
              
              if (hunter) {
                await prisma.leaderboardHunter.update({
                  where: { id: hunter.id },
                  data: {
                    pointsEarned: {
                      increment: pointsToAdd
                    }
                  }
                });
              } else {
                try {
                  // Fetch hunter details from API using player_id
                  const playerResponse = await fetch(
                    `https://aggregator-api.live.aurory.io/v2/players/${encodeURIComponent(opponentId || '')}`
                  );
                  
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
                  console.error(`Failed to fetch player data for ${opponentName} (${opponentId}):`, error);
                  await prisma.leaderboardHunter.create({
                    data: {
                      name: opponentName,
                      title: opponentId,
                      pointsEarned: pointsToAdd,
                      badge: '',
                      avatar: 'https://images.cdn.aurory.io/items/aurorian-default.png'
                    }
                  });
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
          
          // Create the match record (only once per battle)
          await prisma.computedMatch.create({
            data: {
              matchId: uniqueMatchId,
              eliteName: elite.name,
              opponentName: opponentName,
              result: matchResult,
              winnerName: winnerName,
              loserName: loserName
            }
          });
        }
        
        // Log final points for this Elite
        const finalElite = await prisma.leaderboardElite.findUnique({
          where: { id: elite.id },
          select: { pointsEarned: true }
        });
        console.log(`[${elite.name}] Final points: ${finalElite?.pointsEarned}`);
      } catch (error) {
        console.error(`Error processing Elite ${elite.name}:`, error);
        continue;
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