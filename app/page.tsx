import Image from "next/image";
// Import the leaderboard page as a component
import LeaderboardPage from "./leaderboard/page";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0a0c10] via-[#0d1117] to-[#1a1f2b]">
      {/* Header with gradient background */}
      <header className="relative py-12 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-pink-900/20 border-b border-gray-800/50">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-[1400px] mx-auto px-6">
          <div className="text-center">
            
            {/* Main Title */}
            <h1 className="text-4xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-2">
              Seekers of Tokane : Elites Hunt
            </h1>
            
            {/* Description */}
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Defeat the Elites to earn points and climb the leaderboard!
            </p>
          </div>
        </div>
      </header>

      {/* Main content with enhanced styling */}
      <main className="flex-1 p-6 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none"></div>
        
        <div className="relative">
          <LeaderboardPage />
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="py-6 bg-gradient-to-r from-[#0d1117] to-[#1a1f2b] border-t border-gray-800/50">
        <div className="max-w-[1400px] mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-gray-400 text-sm gap-4">
          <div className="flex items-center gap-2">
            <a 
              href="https://x.com/chocoo_web3" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors font-medium"
            >
              made by Chocoo
            </a>
          </div>
          <div className="flex items-center gap-2">
            <a 
              href="https://app.daory.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors font-medium"
            >
              © 2025 DAOry
            </a>
          </div>
          <div className="flex items-center gap-2">
            <a 
              href="https://aurory.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-pink-400 transition-colors font-medium"
            >
              powered by Aurory
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
