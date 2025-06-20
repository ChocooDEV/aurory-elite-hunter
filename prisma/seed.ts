import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.computedMatch.deleteMany();
  await prisma.leaderboardElite.deleteMany();
  await prisma.leaderboardHunter.deleteMany();

  // Insert Elite data
  await prisma.leaderboardElite.createMany({
    data: [
      { 
        name: 'VIP862924621', 
        title: 'p-P5iW64kt0JfUKIR', 
        pointsEarned: 25, 
        pointsPerLoss: 1, 
        badge: '', 
        avatar: 'https://images.cdn.aurory.io/items/aurorian-default.png' 
      },
      { 
        name: 'MontalesGOC', 
        title: 'p-SGWM9YZ1T19lHBj', 
        pointsEarned: 25, 
        pointsPerLoss: 1, 
        badge: '', 
        avatar: 'https://aurorians.cdn.aurory.io/aurorians-v2/current/images/full/1874-sky-of-prosperity.png' 
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