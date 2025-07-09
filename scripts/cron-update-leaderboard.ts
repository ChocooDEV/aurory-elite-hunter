#!/usr/bin/env tsx

// scripts/cron-update-leaderboard.ts
// Triggers the /api/cron/update-leaderboard route every 3 hours and 5 min before each special period start/end

const API_URL = 'http://localhost:3000/api/cron/update-leaderboard';
const INTERVAL_MS = 3 * 60 * 60 * 1000; // 3 hours

// Copy of the special periods config from backend
const eliteSpecialPeriods: {
  [eliteName: string]: { start: Date; end: Date }[];
} = {
  OdinVikings: [
    { start: new Date('2025-07-12T14:00:00Z'), end: new Date('2025-07-12T16:00:00Z') }
  ],
  JohnnyAurory: [
    { start: new Date('2025-07-15T20:00:00Z'), end: new Date('2025-07-15T22:00:00Z') }
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

// Generate all 14 special run times (5 min before each start and end)
const specialTimes: Date[] = [];
for (const periods of Object.values(eliteSpecialPeriods)) {
  for (const period of periods) {
    specialTimes.push(new Date(period.start.getTime() - 5 * 60 * 1000));
    specialTimes.push(new Date(period.end.getTime() - 5 * 60 * 1000));
  }
}
specialTimes.sort((a, b) => a.getTime() - b.getTime());

async function triggerUpdate(reason = '') {
  try {
    console.log(`[${new Date().toISOString()}] Triggering leaderboard update...${reason ? ' (' + reason + ')' : ''}`);
    const res = await fetch(API_URL);
    const data = await res.json();
    console.log(`[${new Date().toISOString()}] Update result:`, data);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error triggering update:`, err);
  }
}

// Regular 3-hour interval
setInterval(() => triggerUpdate('3h interval'), INTERVAL_MS);

// Immediate run on start
triggerUpdate('startup');

// Schedule special runs
function scheduleNextSpecialRun() {
  const now = new Date();
  const futureSpecials = specialTimes.filter(t => t > now);
  if (futureSpecials.length === 0) return; // All done
  const next = futureSpecials[0];
  const msUntilNext = next.getTime() - now.getTime();
  console.log(`[${now.toISOString()}] Next special run scheduled for ${next.toISOString()} (in ${(msUntilNext/60000).toFixed(1)} min)`);
  setTimeout(() => {
    triggerUpdate('special period');
    scheduleNextSpecialRun();
  }, msUntilNext);
}
scheduleNextSpecialRun(); 