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
      <header className="relative py-16 sm:py-24 lg:py-32 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-pink-900/20 border-b border-gray-800/50">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm opacity-30"
          style={{
            backgroundImage: 'url("https://app.aurory.io/assets/bg-jEoTFtr0.jpg")'
          }}
        ></div>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        
        {/* Decorative header elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {/* Top left area */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-20 left-20 w-24 h-24 bg-gradient-to-br from-pink-500/15 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute top-40 left-10 w-16 h-16 bg-gradient-to-br from-blue-500/12 to-transparent rounded-full blur-xl"></div>
          
          {/* Top right area */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-10 right-32 w-20 h-20 bg-gradient-to-br from-purple-500/15 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute top-60 right-10 w-28 h-28 bg-gradient-to-br from-cyan-500/12 to-transparent rounded-full blur-xl"></div>
          
          {/* Center area */}
          <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/3 w-36 h-36 bg-gradient-to-br from-purple-500/12 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute top-2/3 left-1/2 w-24 h-24 bg-gradient-to-br from-pink-500/15 to-transparent rounded-full blur-xl"></div>
          
          {/* Bottom area */}
          <div className="absolute -bottom-10 left-1/3 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-28 h-28 bg-gradient-to-br from-purple-500/12 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-1/4 w-20 h-20 bg-gradient-to-br from-pink-500/15 to-transparent rounded-full blur-xl"></div>
          <div className="absolute bottom-40 right-10 w-16 h-16 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-2xl"></div>
          
          {/* Additional scattered elements */}
          <div className="absolute top-1/4 right-1/5 w-12 h-12 bg-gradient-to-br from-purple-500/8 to-transparent rounded-full blur-lg"></div>
          <div className="absolute top-3/4 left-1/5 w-18 h-18 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full blur-xl"></div>
          <div className="absolute top-1/6 left-2/3 w-14 h-14 bg-gradient-to-br from-blue-500/12 to-transparent rounded-full blur-lg"></div>
          <div className="absolute top-5/6 right-1/6 w-22 h-22 bg-gradient-to-br from-cyan-500/8 to-transparent rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="text-center">
 
            {/* Spacing */}
            <div className="mb-4 sm:mb-6 flex justify-center"></div>
             
             {/* Main Title */}
             <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-4 sm:mb-6 drop-shadow-lg px-2">
               Seekers of Tokane : Elites Hunt
             </h1>
             
             {/* Description */}
             <p className="text-gray-400 mt-6 sm:mt-8 max-w-3xl mx-auto text-lg sm:text-xl lg:text-2xl px-4">
               Defeat the Elites to earn points and climb the leaderboard!
             </p>
             
             {/* Decorative line */}
             <div className="mt-4 sm:mt-6 flex justify-center">
               <div className="w-128 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full"></div>
             </div>
             
             {/* Navigation */}
             <div className="mt-6 sm:mt-8 flex justify-center">
               <a 
                 href="/badges"
                 className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-pink-600/30 transition-all duration-200 font-medium"
               >
                 <span>🏆</span>
                 View Badges & Rules
               </a>
             </div>
           </div>
         </div>
       </header>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none"></div>
        
        <div className="absolute top-20 right-10 w-8 h-8 border border-purple-500/30 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-10 w-6 h-6 border border-pink-500/30 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        
        <div className="relative">
          <LeaderboardPage />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 sm:py-6 bg-gradient-to-r from-[#0d1117] to-[#1a1f2b] border-t border-gray-800/50 relative">
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
