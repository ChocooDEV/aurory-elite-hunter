'use client';

import { useState, useEffect } from 'react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  pointsEarned: number;
  badge: string;
  avatar: string;
}

interface LeaderboardData {
  leaderboard1: LeaderboardEntry[];
  leaderboard2: LeaderboardEntry[];
}

type SortField = 'rank' | 'name' | 'pointsEarned';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig1, setSortConfig1] = useState<SortConfig>({ field: 'rank', direction: 'asc' });
  const [sortConfig2, setSortConfig2] = useState<SortConfig>({ field: 'rank', direction: 'asc' });

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/leaderboard');
        
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }
        
        const data = await response.json();
        setLeaderboardData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  const handleSort = (leaderboardId: 1 | 2, field: SortField) => {
    if (leaderboardId === 1) {
      setSortConfig1(prev => ({
        field,
        direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
      }));
    } else {
      setSortConfig2(prev => ({
        field,
        direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
      }));
    }
  };

  const sortData = (data: LeaderboardEntry[], sortConfig: SortConfig) => {
    return [...data].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortConfig.field) {
        case 'rank':
          aValue = a.rank;
          bValue = b.rank;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'pointsEarned':
          aValue = a.pointsEarned;
          bValue = b.pointsEarned;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const getSortIcon = (field: SortField, sortConfig: SortConfig) => {
    if (sortConfig.field !== field) {
      return '↕️';
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400 flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            Loading leaderboard data...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-400 bg-red-900/20 px-4 py-3 rounded-lg border border-red-800">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  if (!leaderboardData) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400 bg-gray-800/20 px-4 py-3 rounded-lg border border-gray-700">
            No data available
          </div>
        </div>
      </div>
    );
  }

  const sortedLeaderboard1 = sortData(leaderboardData.leaderboard1, sortConfig1);
  const sortedLeaderboard2 = sortData(leaderboardData.leaderboard2, sortConfig2);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Elite Leaderboard */}
        <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 rounded-xl overflow-hidden border border-purple-500/20 shadow-xl backdrop-blur-sm">
          <div className="bg-gradient-to-r from-purple-600/20 to-purple-800/20 px-4 sm:px-6 py-4 border-b border-purple-500/30">
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-xs sm:text-sm">👑</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Elite
              </h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[600px] sm:min-w-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/20 text-gray-300 text-xs sm:text-sm">
                    <th 
                      className="py-3 sm:py-4 px-2 sm:px-4 text-center cursor-pointer hover:text-purple-300 transition-colors"
                      onClick={() => handleSort(1, 'rank')}
                    >
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <span className="hidden sm:inline">#</span>
                        <span className="sm:hidden">Rank</span>
                        {getSortIcon('rank', sortConfig1)}
                      </div>
                    </th>
                    <th 
                      className="py-3 sm:py-4 px-2 sm:px-4 text-center cursor-pointer hover:text-purple-300 transition-colors"
                      onClick={() => handleSort(1, 'name')}
                    >
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <span className="hidden sm:inline">TRADER</span>
                        <span className="sm:hidden">Player</span>
                        {getSortIcon('name', sortConfig1)}
                      </div>
                    </th>
                    <th 
                      className="py-3 sm:py-4 px-2 sm:px-4 text-center cursor-pointer hover:text-purple-300 transition-colors"
                      onClick={() => handleSort(1, 'pointsEarned')}
                    >
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <span className="hidden sm:inline">POINTS</span>
                        <span className="sm:hidden">Pts</span>
                        {getSortIcon('pointsEarned', sortConfig1)}
                      </div>
                    </th>
                    <th className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                      <span className="hidden sm:inline">BADGE</span>
                      <span className="sm:hidden">Badge</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLeaderboard1.map((entry, index) => (
                    <tr key={entry.rank} className={`border-b border-purple-500/10 hover:bg-purple-500/10 transition-all duration-200 ${index === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-yellow-600/10' : ''}`}>
                      <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                        <div className={`inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-bold ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' :
                          index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
                          index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white' :
                          'bg-gray-700 text-gray-300'
                        }`}>
                          {entry.rank}
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4">
                        <div className="flex items-center justify-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-purple-500/30 shadow-lg flex-shrink-0">
                            <img 
                              src={entry.avatar} 
                              alt={entry.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.cdn.aurory.io/items/aurorian-default.png';
                              }}
                            />
                          </div>
                          <div className="text-center min-w-0 flex-1">
                            <div className="text-gray-200 font-medium text-sm sm:text-base truncate">
                              {entry.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold text-sm sm:text-base">
                          {entry.pointsEarned}
                        </span>
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4 text-center text-gray-300 text-sm">
                        {entry.badge}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Hunter Leaderboard */}
        <div className="bg-gradient-to-br from-blue-900/20 to-cyan-800/10 rounded-xl overflow-hidden border border-blue-500/20 shadow-xl backdrop-blur-sm">
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-800/20 px-4 sm:px-6 py-4 border-b border-blue-500/30">
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-xs sm:text-sm">🏹</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Hunter
              </h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[600px] sm:min-w-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-blue-500/20 text-gray-300 text-xs sm:text-sm">
                    <th 
                      className="py-3 sm:py-4 px-2 sm:px-4 text-center cursor-pointer hover:text-blue-300 transition-colors"
                      onClick={() => handleSort(2, 'rank')}
                    >
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <span className="hidden sm:inline">#</span>
                        <span className="sm:hidden">Rank</span>
                        {getSortIcon('rank', sortConfig2)}
                      </div>
                    </th>
                    <th 
                      className="py-3 sm:py-4 px-2 sm:px-4 text-center cursor-pointer hover:text-blue-300 transition-colors"
                      onClick={() => handleSort(2, 'name')}
                    >
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <span className="hidden sm:inline">TRADER</span>
                        <span className="sm:hidden">Player</span>
                        {getSortIcon('name', sortConfig2)}
                      </div>
                    </th>
                    <th 
                      className="py-3 sm:py-4 px-2 sm:px-4 text-center cursor-pointer hover:text-blue-300 transition-colors"
                      onClick={() => handleSort(2, 'pointsEarned')}
                    >
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <span className="hidden sm:inline">POINTS</span>
                        <span className="sm:hidden">Pts</span>
                        {getSortIcon('pointsEarned', sortConfig2)}
                      </div>
                    </th>
                    <th className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                      <span className="hidden sm:inline">BADGE</span>
                      <span className="sm:hidden">Badge</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLeaderboard2.map((entry, index) => (
                    <tr key={entry.rank} className={`border-b border-blue-500/10 hover:bg-blue-500/10 transition-all duration-200 ${index === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-yellow-600/10' : ''}`}>
                      <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                        <div className={`inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-bold ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' :
                          index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
                          index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white' :
                          'bg-gray-700 text-gray-300'
                        }`}>
                          {entry.rank}
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4">
                        <div className="flex items-center justify-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-blue-500/30 shadow-lg flex-shrink-0">
                            <img 
                              src={entry.avatar} 
                              alt={entry.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.cdn.aurory.io/items/aurorian-default.png';
                              }}
                            />
                          </div>
                          <div className="text-center min-w-0 flex-1">
                            <div className="text-gray-200 font-medium text-sm sm:text-base truncate">
                              {entry.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 font-bold text-sm sm:text-base">
                          {entry.pointsEarned}
                        </span>
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4 text-center text-gray-300 text-sm">
                        {entry.badge}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 