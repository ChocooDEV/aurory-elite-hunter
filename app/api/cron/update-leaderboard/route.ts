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
  data: any;
}

interface Player {
  name: string;
  avatar?: string;
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

export async function GET(request: Request) {
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
        // Fetch matches for this Elite player with JUNE_2025 event filter
        const matchesResponse = await fetch(
          `https://aggregator-api.live.aurory.io/v1/player-matches?player_id_or_name=${encodeURIComponent(elite.name)}&order_by=created_at&direction=asc&event=JUNE_2025`
        );
        
        if (!matchesResponse.ok) {
          console.error(`Failed to fetch matches for ${elite.name}:`, matchesResponse.status);
          continue;
        }
        
        const responseData: ApiResponse = await matchesResponse.json();
        const battles: Battle[] = responseData.matches.data;
        
        console.log(`Found ${battles.length} battles for ${elite.name}`);
        
        // Process each battle
        for (const battle of battles) {
          // Skip CPU battles
          if (battle.opponent.player_name === 'CPU' || battle.opponent.id === 'CPU') {
            console.log(`Skipping CPU battle for ${elite.name}`);
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
            // Elite won, nothing happens to points
            await prisma.computedMatch.create({
              data: {
                matchId,
                eliteName: elite.name,
                hunterName: battle.opponent.player_name
              }
            });
            continue;
          }
          
          // Elite lost (battle.result === 'loss'), hunter gets points
          const hunterName = battle.opponent.player_name;
          const hunterId = battle.opponent.player_id || battle.opponent.id;
          const pointsToAdd = Number(elite.pointsPerLoss);
          
          // Check if hunter already exists in LeaderboardHunter
          let hunter = await prisma.leaderboardHunter.findFirst({
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
                hunterAvatar = playerData.avatar || hunterAvatar;
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