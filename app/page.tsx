import Image from "next/image";
// Import the leaderboard page as a component
import LeaderboardPage from "./leaderboard/page";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0c10]">
      {/* Title */}
      <header className="py-8 bg-[#0d1117] border-b border-gray-800">
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">
          Seekers of Tokane : Elites Hunt
        </h1>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6">
        <LeaderboardPage />
      </main>

      {/* Footer */}
      <footer className="py-4 bg-[#0d1117] border-t border-gray-800">
        <div className="max-w-[1400px] mx-auto px-4 flex justify-between items-center text-gray-400 text-sm">
          <div>
            <a 
              href="https://x.com/chocoo_web3" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors"
            >
              made by Chocoo
            </a>
          </div>
          <div>
            <a 
              href="https://app.daory.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors"
            >
              © 2025 DAOry
            </a>
          </div>
          <div>
            <a 
              href="https://aurory.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors"
            >
              powered by Aurory
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
