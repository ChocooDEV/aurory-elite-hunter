'use client';

interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  requirement: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const badges: Badge[] = [
  {
    id: 'elite-killer',
    name: 'Elite Killer',
    description: 'Defeated at least three different Elites',
    imageUrl: '/badges/elite-killer.png',
    requirement: 'Win against 3+ different Elites',
    rarity: 'common'
  },
  {
    id: 'elite-slayer',
    name: 'Elite Slayer',
    description: 'Defeated 5+ times an Elite',
    imageUrl: '/badges/elite-slayer.png',
    requirement: 'Win 5+ times against an Elite',
    rarity: 'rare'
  },
  {
    id: 'elite-master',
    name: 'Elite Master',
    description: 'Defeated 30+ times an Elite',
    imageUrl: '/badges/elite-master.png',
    requirement: 'Win 30+ times against an Elite',
    rarity: 'epic'
  },
  {
    id: 'elite-legend',
    name: 'Elite Legend',
    description: 'Defeated at least 15 different Elites',
    imageUrl: '/badges/elite-legend.png',
    requirement: 'Win against at least 15 different Elites during the event',
    rarity: 'legendary'
  }
];

const getRarityColor = (rarity: Badge['rarity']) => {
  switch (rarity) {
    case 'common': return 'text-gray-300';
    case 'rare': return 'text-blue-400';
    case 'epic': return 'text-purple-400';
    case 'legendary': return 'text-yellow-400';
    default: return 'text-gray-300';
  }
};

const getRarityBgColor = (rarity: Badge['rarity']) => {
  switch (rarity) {
    case 'common': return 'bg-gray-700/20 border-gray-600/30';
    case 'rare': return 'bg-blue-700/20 border-blue-600/30';
    case 'epic': return 'bg-purple-700/20 border-purple-600/30';
    case 'legendary': return 'bg-yellow-700/20 border-yellow-600/30';
    default: return 'bg-gray-700/20 border-gray-600/30';
  }
};

export default function BadgesPage() {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-4">
          Event Badges & Rules
        </h1>
        <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
          Discover the badges you can earn and understand how the Elite Hunt event works
        </p>
      </div>

      {/* Back to Leaderboard Button */}
      <div className="mb-12 text-center">
        <a 
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/30 hover:to-cyan-600/30 transition-all duration-200 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Leaderboard
        </a>
      </div>

      {/* Event Rules Section */}
      <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 rounded-xl border border-purple-500/20 p-6 sm:p-8 mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
          Event Rules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-200 mb-3">How to Participate</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-purple-400 mt-1">•</span>
                <span>Challenge Elite players in battles to earn points</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 mt-1">•</span>
                <span>Win battles to climb the leaderboard rankings</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 mt-1">•</span>
                <span>Earn badges by achieving specific milestones</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 mt-1">•</span>
                <span>Compete in both Elite and Hunter categories depending on your ranking pre-event</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-200 mb-3">Scoring System</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">•</span>
                <span>Win against Elite (for Hunter): +1 points</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">•</span>
                <span>Win against Hunter (for Elite): +1 points</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">•</span>
                <span>Elite loss against Hunter: -3 points</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">•</span>
                <span>Some Elites have bonus on them, when you win against them you will get more points</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="space-y-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 text-center">
          Available Badges
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge) => (
            <div 
              key={badge.id}
              className={`${getRarityBgColor(badge.rarity)} rounded-xl border p-6 hover:scale-105 transition-transform duration-200 cursor-pointer`}
            >
              {/* Badge Image */}
              <div className="flex justify-center items-center mb-4 h-20 sm:h-24">
                <img
                  src={badge.imageUrl}
                  alt={badge.name}
                  className="max-h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              
              {/* Badge Info */}
              <div className="text-center space-y-2">
                <h3 className={`font-bold text-lg ${getRarityColor(badge.rarity)}`}>
                  {badge.name}
                </h3>
                <p className="text-gray-300 text-sm">
                  {badge.description}
                </p>
                <div className="pt-2">
                  <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded">
                    {badge.requirement}
                  </span>
                </div>
                <div className="pt-1">
                  <span className={`text-xs font-medium capitalize ${getRarityColor(badge.rarity)}`}>
                    {badge.rarity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Section */}
      <div className="mt-12 bg-gradient-to-br from-blue-900/20 to-cyan-800/10 rounded-xl border border-blue-500/20 p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-6 text-center">
          Event Rewards
        </h2>
        <p className="text-center text-gray-400 mb-8">
          The following rewards are available for both the Elite and Hunter leaderboards.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Ranks */}
          <div className="lg:col-span-2 bg-gray-900/30 rounded-lg p-6 border border-gray-700/50">
            <h3 className="font-semibold text-xl text-purple-400 mb-4">Top Ranks (1-10)</h3>
            <div className="space-y-6">
              {/* Places 1-3 */}
              <div>
                <h4 className="font-semibold text-lg text-gray-200 mb-2">Places 1-3</h4>
                <p className="text-sm text-gray-400 mb-3">Includes a large Aury prize pool, Nefties, and a 2x Aury bonus for Aurorian holders</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between items-center"><span>🥇 1st Place:</span> <span>300 AURY + 2 Epic Nefties</span></li>
                  <li className="flex justify-between items-center"><span>🥈 2nd Place:</span> <span>200 AURY + 1 Epic & 1 3-Star Nefty</span></li>
                  <li className="flex justify-between items-center"><span>🥉 3rd Place:</span> <span>150 AURY + 1 Epic Nefty</span></li>
                </ul>
              </div>
              {/* Places 4-10 */}
              <div>
                <h4 className="font-semibold text-lg text-gray-200 mb-2">Places 4-10</h4>
                <p className="text-sm text-gray-400 mb-3">Includes a smaller Aury prize pool, Nefties, and a 2x Aury bonus for Aurorian holders</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between items-center"><span>4th - 5th:</span> <span>100 AURY + 3 3-Star Nefties</span></li>
                  <li className="flex justify-between items-center"><span>6th - 8th:</span> <span>50 AURY + 1 3-Star & 1 2-Star Nefty</span></li>
                  <li className="flex justify-between items-center"><span>9th - 10th:</span> <span>30 AURY + 1 3-Star Nefty</span></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Other Rewards */}
          <div className="bg-gray-900/30 rounded-lg p-6 border border-gray-700/50">
            <h3 className="font-semibold text-xl text-cyan-400 mb-4">Bonuses & Raffles</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg text-gray-200 mb-2">Community Prizes</h4>
                <p className="text-sm text-gray-400">A small Aury pool is reserved for the most creative social media posts (e.g., kill montages, memes)</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg text-gray-200 mb-2">Holder Raffle</h4>
                <p className="text-sm text-gray-400">All participating Aurorian holders will be entered into a raffle to win a free Aurorian</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg text-gray-200 mb-2">Holder Bonus</h4>
                <p className="text-sm text-gray-400">Top 10 players in each leaderboard who hold an Aurorian will receive a 2x Aury multiplier on their prize</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 