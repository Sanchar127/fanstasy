import React from 'react';

interface TeamInfoProps {
  teamName: string;
  onTeamNameChange: (name: string) => void;
}

const TeamInfo: React.FC<TeamInfoProps> = ({ teamName, onTeamNameChange }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          Team Information
        </h2>
        <p className="text-purple-200 text-lg">
          Start by giving your team an awesome name
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-white font-semibold text-lg mb-3">
            Team Name *
          </label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => onTeamNameChange(e.target.value)}
            placeholder="Enter your legendary team name..."
            className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg transition-all"
            required
          />
        </div>

        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-3">Requirements:</h3>
          <ul className="text-purple-200 space-y-2">
            <li>✓ 14 players in total</li>
            <li>✓ 1 Captain (2x points)</li>
            <li>✓ 1 Vice-Captain (1.5x points)</li>
            <li>✓ Unique player names</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeamInfo;