import Image from "next/image";
// Import the leaderboard page as a component
import LeaderboardPage from "./leaderboard/page";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0a0c10] via-[#0d1117] to-[#1a1f2b] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-pink-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute top-60 left-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute top-80 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-30"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-32 right-10 w-16 h-16 border border-purple-500/20 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 border border-pink-500/20 rotate-12"></div>
        <div className="absolute top-1/2 left-10 w-8 h-8 border border-blue-500/20 rotate-45 animate-pulse"></div>
        
        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
      </div>

      {/* Header with gradient background */}
      <header className="relative py-8 sm:py-12 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-pink-900/20 border-b border-gray-800/50">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        
        {/* Decorative header elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 left-1/3 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="text-center">

            {/* Spacing */}
            <div className="mb-4 sm:mb-6 flex justify-center"></div>
            
            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-2 drop-shadow-lg px-2">
              Seekers of Tokane : Elites Hunt
            </h1>
            
            {/* Description */}
            <p className="text-gray-400 mt-3 sm:mt-4 max-w-2xl mx-auto text-base sm:text-lg px-4">
              Defeat the Elites to earn points and climb the leaderboard!
            </p>
            
            {/* Decorative line */}
            <div className="mt-4 sm:mt-6 flex justify-center">
              <div className="w-128 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content with enhanced styling */}
      <main className="flex-1 p-4 sm:p-6 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none"></div>
        
        {/* Floating elements in main content */}
        <div className="absolute top-20 right-10 w-8 h-8 border border-purple-500/30 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-10 w-6 h-6 border border-pink-500/30 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        
        <div className="relative">
          <LeaderboardPage />
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="py-4 sm:py-6 bg-gradient-to-r from-[#0d1117] to-[#1a1f2b] border-t border-gray-800/50 relative">
        {/* Footer background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5"></div>
        
        <div className="relative max-w-[1400px] mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-gray-400 text-xs sm:text-sm gap-3 sm:gap-4">
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
