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
          
          const existingMatch = await prisma.computedMatch.findUnique({
            where: { matchId }
          });
          
          if (existingMatch) {
            continue; 
          }
          
          // Check if Elite won or lost
          if (battle.result === 'win') {
            // Elite won, add 1 point
            await prisma.leaderboardElite.update({
              where: { id: elite.id },
              data: {
                pointsEarned: {
                  increment: 1
                }
              }
            });
            
            await prisma.computedMatch.create({
              data: {
                matchId,
                eliteName: elite.name,
                hunterName: battle.opponent.player_name
              }
            });
            continue;
          }
          
          // Elite lost (battle.result === 'loss'), elite loses 3 points, hunter gets points
          await prisma.leaderboardElite.update({
            where: { id: elite.id },
            data: {
              pointsEarned: {
                decrement: 3
              }
            }
          });
          
          const hunterName = battle.opponent.player_name;
          const hunterId = battle.opponent.player_id || battle.opponent.id;
          const pointsToAdd = Number(elite.pointsPerLoss);
          
          // Check if hunter already exists in LeaderboardHunter
          const hunter = await prisma.leaderboardHunter.findFirst({
            where: { name: hunterName }
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
                `https://aggregator-api.live.aurory.io/v2/players/${encodeURIComponent(hunterId || '')}`
              );
              
              let hunterAvatar = 'https://images.cdn.aurory.io/items/aurorian-default.png';
              
              if (playerResponse.ok) {
                const playerData: Player = await playerResponse.json();
                hunterAvatar = playerData.profile_picture.url || hunterAvatar;
              }
              
              await prisma.leaderboardHunter.create({
                data: {
                  name: hunterName,
                  title: hunterId,
                  pointsEarned: pointsToAdd,
                  badge: '',
                  avatar: hunterAvatar
                }
              });
            } catch (error) {
              console.error(`Failed to fetch player data for ${hunterName} (${hunterId}):`, error);
              await prisma.leaderboardHunter.create({
                data: {
                  name: hunterName,
                  title: hunterId,
                  pointsEarned: pointsToAdd,
                  badge: '',
                  avatar: 'https://images.cdn.aurory.io/items/aurorian-default.png'
                }
              });
            }
          }
          
          // === BADGE LOGIC START ===
          const hunterForBadges = await prisma.leaderboardHunter.findFirst({
            where: { name: hunterName }
          });
          
          if (hunterForBadges) {
            // 1. Record the win
            await prisma.hunterWin.create({
              data: {
                hunterName: hunterName,
                defeatedEliteName: elite.name
              }
            });
            
            // 2. Get all wins for the hunter
            const allWins = await prisma.hunterWin.findMany({
              where: { hunterName: hunterName }
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

          // Mark battle as computed
          await prisma.computedMatch.create({
            data: {
              matchId,
              eliteName: elite.name,
              hunterName: hunterName
            }
          });
        }
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