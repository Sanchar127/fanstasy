import React from 'react';

interface Match {
  teamA: string;
  teamB: string;
}

interface ContestCardProps {
  match: Match;
  league: string;
  date: string;
  contestCount: number;
}

const ContestCard: React.FC<ContestCardProps> = ({ match, league, date, contestCount }) => (
  <div className="bg-gray-800 p-5 rounded-xl shadow-2xl transition-all duration-300 hover:bg-gray-700/50 flex flex-col border border-red-800/50">
    <div className="flex justify-between items-center mb-3">
      <span className="text-xs font-semibold uppercase text-yellow-400 bg-red-800 px-2 py-1 rounded-full">{league}</span>
      <span className="text-sm text-gray-400">{date}</span>
    </div>
    <div className="text-center mb-4">
      <p className="text-2xl font-extrabold text-white">{match.teamA} <span className="text-gray-500">vs</span> {match.teamB}</p>
    </div>
    <div className="flex justify-between items-center text-sm text-gray-300 mt-auto pt-3 border-t border-gray-700">
      <span className="font-medium">{contestCount}+ Contests Live</span>
      <a
        href="#"
        className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
      >
        Join Now
      </a>
    </div>
  </div>
);

export default ContestCard;
