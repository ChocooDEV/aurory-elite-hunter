import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function GET() {
  try {
    const elitePlayers = await prisma.leaderboardElite.findMany();
    return NextResponse.json(elitePlayers);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch elite players' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { name, pointsPerLoss, badge, password } = await req.json();

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Find the elite by name to get the unique id
  const elite = await prisma.leaderboardElite.findFirst({ where: { name } });
  if (!elite) {
    return NextResponse.json({ error: 'Elite not found' }, { status: 404 });
  }

  const updated = await prisma.leaderboardElite.update({
    where: { id: elite.id },
    data: {
      pointsPerLoss: Number(pointsPerLoss),
      badge,
    },
  });

  return NextResponse.json({ success: true, updated });
} 
