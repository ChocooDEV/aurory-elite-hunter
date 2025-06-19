import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.leaderboardElite.deleteMany();
  await prisma.leaderboardHunter.deleteMany();

  // Insert Elite data
  await prisma.leaderboardElite.createMany({
    data: [
      { 
        name: 'FAKE ELITE', 
        title: 'fakefakefake', 
        pointsEarned: 25, 
        pointsPerLoss: 1, 
        badge: '', 
        avatar: 'https://aurorians.cdn.aurory.io/aurorians-v2/current/images/mini/9248.png' 
      }
    ]
  });

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