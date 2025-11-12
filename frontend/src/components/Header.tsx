import React from 'react';
import { Trophy, ChevronDown, User, LogIn } from 'lucide-react';
import Link from 'next/link';

const Header: React.FC = () => {
  const navItems = [
    { name: 'Live Scores', href: '#' },
    { name: 'Fantasy Leagues', href: '#' },
    { name: 'News & Analysis', href: '#' },
    { name: 'Leaderboard', href: '#' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-lg shadow-2xl border-b border-red-500/30">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="flex items-center group cursor-pointer">
          <div className="relative">
            <Trophy className="w-10 h-10 text-yellow-400 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:drop-shadow-glow" />
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-black bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent tracking-tight">
              Live Score Nepal.com
            </h1>
            <span className="text-white/80 text-sm font-semibold tracking-widest block -mt-1">
              FANTASY
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-1">
          {navItems.map((item, index) => (
            <div key={item.name} className="relative group">
              <a
                href={item.href}
                className="relative px-4 py-2 text-gray-300 hover:text-white transition-all duration-300 font-medium text-sm uppercase tracking-wider group-hover:bg-white/10 rounded-lg"
              >
                {item.name}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-red-500 to-yellow-400 transition-all duration-300 group-hover:w-4/5 group-hover:left-1/10"></span>
              </a>
            </div>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* Create Team Button */}
          <Link href="/create-team">
            <button className="relative group bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center space-x-2">
                <Trophy className="w-4 h-4" />
                <span>Create Team</span>
              </span>
              <div className="absolute inset-0 border-2 border-white/20 rounded-xl group-hover:border-white/40 transition-all duration-300"></div>
            </button>
          </Link>

          {/* Sign Up Button */}
          <Link href={`/auth`}>
          <button className="relative group bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 cursor-pointer overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Sign Up</span>
            </span>
            <div className="absolute inset-0 border-2 border-white/20 rounded-xl group-hover:border-white/40 transition-all duration-300"></div>
          </button>
          </Link>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <button className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 cursor-pointer">
              <div className="flex flex-col space-y-1">
                <div className="w-6 h-0.5 bg-current"></div>
                <div className="w-6 h-0.5 bg-current"></div>
                <div className="w-6 h-0.5 bg-current"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;