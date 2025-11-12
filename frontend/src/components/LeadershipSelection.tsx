import React from 'react';
import { PlayerInputProps } from '@/types/team';

const LeadershipSelection: React.FC<PlayerInputProps> = ({
  players,
  captain,
  viceCaptain,
  onCaptainChange,
  onViceCaptainChange,
}) => {
  const validPlayers = players.filter(player => player.trim());

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          Select Your Leaders
        </h2>
        <p className="text-purple-200 text-lg">
          Choose your Captain and Vice-Captain carefully
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Captain Selection */}
        <div className="bg-white/5 border-2 border-yellow-500/30 rounded-2xl p-6">
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">🏅</span>
            </div>
            <h3 className="text-yellow-400 font-bold text-xl">Captain</h3>
            <p className="text-yellow-200 text-sm">Earns 2x points</p>
          </div>
          
          <select
            value={captain}
            onChange={(e) => onCaptainChange(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            required
          >
            <option value="">Select Captain</option>
            {validPlayers.map((player, index) => (
              <option key={index} value={player} disabled={player === viceCaptain}>
                {player} {player === viceCaptain ? '(Already VC)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Vice-Captain Selection */}
        <div className="bg-white/5 border-2 border-blue-500/30 rounded-2xl p-6">
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">⭐</span>
            </div>
            <h3 className="text-blue-400 font-bold text-xl">Vice-Captain</h3>
            <p className="text-blue-200 text-sm">Earns 1.5x points</p>
          </div>
          
          <select
            value={viceCaptain}
            onChange={(e) => onViceCaptainChange(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Vice-Captain</option>
            {validPlayers.map((player, index) => (
              <option key={index} value={player} disabled={player === captain}>
                {player} {player === captain ? '(Already Captain)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Leaders Display */}
      {(captain || viceCaptain) && (
        <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/20">
          <h3 className="text-white font-bold text-lg mb-4 text-center">
            Your Leadership Team
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {captain && (
              <div className="text-center p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
                <div className="text-yellow-400 font-bold">🏅 Captain</div>
                <div className="text-white text-lg font-semibold">{captain}</div>
                <div className="text-yellow-300 text-sm">2x Points Multiplier</div>
              </div>
            )}
            {viceCaptain && (
              <div className="text-center p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
                <div className="text-blue-400 font-bold">⭐ Vice-Captain</div>
                <div className="text-white text-lg font-semibold">{viceCaptain}</div>
                <div className="text-blue-300 text-sm">1.5x Points Multiplier</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadershipSelection;