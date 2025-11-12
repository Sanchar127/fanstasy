import React from 'react';
import ContestCard from './ContestCard';
import { ChevronRight } from 'lucide-react';

interface Match {
  teamA: string;
  teamB: string;
  league: string;
  date: string;
}

const UpcomingContestsSection: React.FC = () => {
  const upcomingMatches: Match[] = [
    { teamA: 'Nepal', teamB: 'UAE', league: 'Asia Cup Qualifiers', date: 'Dec 15, 2025' },
    { teamA: 'Kathmandu', teamB: 'Biratnagar', league: 'Nepal T20 League', date: 'Dec 16, 2025' },
    { teamA: 'Pokhara FC', teamB: 'Chitwan FC', league: 'Nepal Super League', date: 'Dec 18, 2025' },
    { teamA: 'India', teamB: 'Australia', league: 'International ODI', date: 'Dec 20, 2025' },
  ];

  return (
    <section id="contests" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">
          <span className="text-yellow-400">Upcoming</span> Contests & Matches
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {upcomingMatches.map((match, index) => (
            <ContestCard
              key={index}
              match={{ teamA: match.teamA, teamB: match.teamB }}
              league={match.league}
              date={match.date}
              contestCount={Math.floor(Math.random() * 50) + 10}
            />
          ))}
        </div>
        <div className="text-center mt-10">
          <a
            href="#"
            className="inline-flex items-center text-red-500 font-bold hover:text-red-400 transition-colors group"
          >
            View All Matches
            <ChevronRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default UpcomingContestsSection;
