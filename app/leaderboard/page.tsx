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
      <div className="w-full max-w-[1400px] mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading leaderboard data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[1400px] mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-400">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!leaderboardData) {
    return (
      <div className="w-full max-w-[1400px] mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">No data available</div>
        </div>
      </div>
    );
  }

  const sortedLeaderboard1 = sortData(leaderboardData.leaderboard1, sortConfig1);
  const sortedLeaderboard2 = sortData(leaderboardData.leaderboard2, sortConfig2);

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* First Leaderboard */}
        <div className="bg-[#0d1117] rounded-lg overflow-hidden border border-gray-800">
          <div className="bg-[#1a1f2b] px-6 py-4 border-b border-gray-800">
            <h2 className="text-xl text-center font-semibold text-gray-200">Elite</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-sm">
                <th 
                  className="py-4 px-4 text-center cursor-pointer hover:text-gray-300 transition-colors"
                  onClick={() => handleSort(1, 'rank')}
                >
                  <div className="flex items-center justify-center gap-2">
                    # {getSortIcon('rank', sortConfig1)}
                  </div>
                </th>
                <th 
                  className="py-4 px-4 text-center cursor-pointer hover:text-gray-300 transition-colors"
                  onClick={() => handleSort(1, 'name')}
                >
                  <div className="flex items-center justify-center gap-2">
                    TRADER {getSortIcon('name', sortConfig1)}
                  </div>
                </th>
                <th 
                  className="py-4 px-4 text-center cursor-pointer hover:text-gray-300 transition-colors"
                  onClick={() => handleSort(1, 'pointsEarned')}
                >
                  <div className="flex items-center justify-center gap-2">
                    POINTS EARNED {getSortIcon('pointsEarned', sortConfig1)}
                  </div>
                </th>
                <th className="py-4 px-4 text-center">BADGE</th>
              </tr>
            </thead>
            <tbody>
              {sortedLeaderboard1.map((entry) => (
                <tr key={entry.rank} className="border-b border-gray-800 hover:bg-[#1a1f2b] transition-colors">
                  <td className="py-4 px-4 text-center text-gray-300">{entry.rank}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img 
                          src={entry.avatar} 
                          alt={entry.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '';
                          }}
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-gray-200">{entry.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center text-pink-500">{entry.pointsEarned}</td>
                  <td className="py-4 px-4 text-center text-gray-300">{entry.badge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Second Leaderboard */}
        <div className="bg-[#0d1117] rounded-lg overflow-hidden border border-gray-800">
          <div className="bg-[#1a1f2b] px-6 py-4 border-b border-gray-800">
            <h2 className="text-xl text-center font-semibold text-gray-200">Hunter</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-sm">
                <th 
                  className="py-4 px-4 text-center cursor-pointer hover:text-gray-300 transition-colors"
                  onClick={() => handleSort(2, 'rank')}
                >
                  <div className="flex items-center justify-center gap-2">
                    # {getSortIcon('rank', sortConfig2)}
                  </div>
                </th>
                <th 
                  className="py-4 px-4 text-center cursor-pointer hover:text-gray-300 transition-colors"
                  onClick={() => handleSort(2, 'name')}
                >
                  <div className="flex items-center justify-center gap-2">
                    TRADER {getSortIcon('name', sortConfig2)}
                  </div>
                </th>
                <th 
                  className="py-4 px-4 text-center cursor-pointer hover:text-gray-300 transition-colors"
                  onClick={() => handleSort(2, 'pointsEarned')}
                >
                  <div className="flex items-center justify-center gap-2">
                    POINTS EARNED {getSortIcon('pointsEarned', sortConfig2)}
                  </div>
                </th>
                <th className="py-4 px-4 text-center">BADGE</th>
              </tr>
            </thead>
            <tbody>
              {sortedLeaderboard2.map((entry) => (
                <tr key={entry.rank} className="border-b border-gray-800 hover:bg-[#1a1f2b] transition-colors">
                  <td className="py-4 px-4 text-center text-gray-300">{entry.rank}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img 
                          src={entry.avatar} 
                          alt={entry.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '';
                          }}
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-gray-200">{entry.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center text-pink-500">{entry.pointsEarned}</td>
                  <td className="py-4 px-4 text-center text-gray-300">{entry.badge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 