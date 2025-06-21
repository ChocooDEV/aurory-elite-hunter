import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';

interface LeaderboardEntry {
  rank: number;
  name: string;
  title: string;
  pointsEarned: number;
  badge: string;
  avatar: string;
}

interface DatabaseEntry {
  id: number;
  name: string;
  title: string;
  pointsEarned: Decimal;
  badge: string;
  avatar: string;
  createdAt: Date;
}

export async function GET() {
  try {
    // Fetch Elite leaderboard data using Prisma
    const eliteData = await prisma.leaderboardElite.findMany({
      orderBy: {
        pointsEarned: 'desc'
      },
      take: 20
    });

    // Fetch Hunter leaderboard data using Prisma
    const hunterData = await prisma.leaderboardHunter.findMany({
      orderBy: {
        pointsEarned: 'desc'
      },
      take: 100
    });

    // Transform the data to match your frontend interface
    const transformData = (data: DatabaseEntry[], startRank: number = 1): LeaderboardEntry[] => {
      return data.map((entry, index) => ({
        rank: startRank + index,
        name: entry.name,
        title: entry.title,
        pointsEarned: Number(entry.pointsEarned),
        badge: entry.badge,
        avatar: entry.avatar
      }));
    };

    const leaderboardData = {
      leaderboard1: transformData(eliteData),
      leaderboard2: transformData(hunterData)
    };

    return NextResponse.json(leaderboardData);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 