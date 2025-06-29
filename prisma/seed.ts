import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PlayerData {
  player: {
    player_id: string;
    player_name: string;
    profile_picture: {
      url: string | null;
    };
  };
}

interface ApiResponse {
  players: PlayerData[];
}

async function main() {
  // Clear existing data
  await prisma.computedMatch.deleteMany();
  await prisma.hunterWin.deleteMany();
  await prisma.leaderboardElite.deleteMany();
  await prisma.leaderboardHunter.deleteMany();

  // Fetch Elite data from API
  console.log('Fetching Elite players from API...');
  const response = await fetch('https://aggregator-api.live.aurory.io/v1/leaderboards?mode=pvp&event=JUNE_2025');
  if (!response.ok) {
    throw new Error(`Failed to fetch leaderboard data: ${response.statusText}`);
  }
  const apiData: ApiResponse = await response.json();
  console.log(`Found ${apiData.players.length} Elite players.`);

  // Limit to top 20 players
  const top20Players = apiData.players.slice(0, 29);
  console.log(`Limiting to top ${top20Players.length} Elite players.`);

  const elitePlayers = top20Players.map(p => ({
    name: p.player.player_name,
    title: p.player.player_id,
    avatar: p.player.profile_picture.url || 'https://images.cdn.aurory.io/items/aurorian-default.png',
    pointsEarned: 0,
    pointsPerLoss: 1,
    badge: '',
  }));

  // Insert Elite data
  await prisma.leaderboardElite.createMany({
    data: elitePlayers,
  });
  console.log('Inserted Elite players into the database.');

  // Insert special guest player
  await prisma.leaderboardElite.create({
    data: {
      name: 'tim',
      title: 'p-YugPNYWMFYKiETC',
      pointsEarned: 0,
      pointsPerLoss: 1,
      badge: '',
      avatar: 'https://aurorians.cdn.aurory.io/aurorians-v2/current/images/mini/5455.png'
    }
  });
  await prisma.leaderboardElite.create({
    data: {
      name: 'FarmerJoe',
      title: 'p-J74bOoXvMD0ghBl',
      pointsEarned: 0,
      pointsPerLoss: 1,
      badge: '',
      avatar: 'https://aurorians.cdn.aurory.io/aurorians-v2/current/images/mini/9985.png'
    }
  });
  await prisma.leaderboardElite.create({
    data: {
      name: 'kandaroshi',
      title: 'p-R8tIvjZhzRtEaUm',
      pointsEarned: 0,
      pointsPerLoss: 1,
      badge: '',
      avatar: 'https://aurorians.cdn.aurory.io/aurorians-v2/current/images/full/3027-halloween-village.png'
    }
  });
  await prisma.leaderboardElite.create({
    data: {
      name: 'DeGenZardGoC',
      title: 'p-J8cW6cxS4sX0KaM',
      pointsEarned: 0,
      pointsPerLoss: 1,
      badge: '',
      avatar: 'https://aurorians.cdn.aurory.io/aurorians-v2/current/images/full/8368.png'
    }
  });  
  await prisma.leaderboardElite.create({
    data: {
      name: 'gummer',
      title: 'p-qx45PyEUImPIRGk',
      pointsEarned: 0,
      pointsPerLoss: 1,
      badge: '',
      avatar: 'https://aurorians.cdn.aurory.io/aurorians-v2/current/images/mini/9248.png'
    }
  });
  await prisma.leaderboardElite.create({
    data: {
      name: 'Myr',
      title: 'p-MJ6hRRaieUuCiut',
      pointsEarned: 0,
      pointsPerLoss: 1,
      badge: '',
      avatar: 'https://aurorians.cdn.aurory.io/aurorians-v2/current/images/mini/9248.png'
    }
  });


  console.log('Inserted special guest Elite players into the database.');

  // Insert Hunter data
  await prisma.leaderboardHunter.createMany({
    data: [
      { 
        name: 'FAKE HUNTER', 
        title: 'fakefakefake', 
        pointsEarned: 1, 
        badge: '', 
        avatar: 'https://aurorians.cdn.aurory.io/aurorians-v2/current/images/mini/9248.png' 
      }
    ]
  });
  console.log('Inserted fake Hunter data.');


  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 