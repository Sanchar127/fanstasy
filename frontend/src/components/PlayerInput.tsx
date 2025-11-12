import React from 'react';
import { PlayerInputProps } from '@/types/team';

const PlayerInput: React.FC<PlayerInputProps> = ({
  players,
  onPlayersChange,
  captain,
  viceCaptain,
  onCaptainChange,
  onViceCaptainChange,
}) => {
  const handlePlayerChange = (index: number, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    onPlayersChange(newPlayers);
  };

  const filledPlayers = players.filter(player => player.trim()).length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          Add Your Players
        </h2>
        <p className="text-purple-200 text-lg mb-2">
          Enter all 14 player names ({filledPlayers}/14 filled)
        </p>
        <div className="w-full bg-white/10 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(filledPlayers / 14) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-2">
        {players.map((player, index) => (
          <div
            key={index}
            className="bg-white/5 border border-white/20 rounded-xl p-4 hover:bg-white/10 transition-all"
          >
            <label className="block text-white/80 text-sm mb-2 font-medium">
              Player {index + 1}
            </label>
            <input
              type="text"
              value={player}
              onChange={(e) => handlePlayerChange(index, e.target.value)}
              placeholder={`Enter player ${index + 1} name...`}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
            <div className="flex space-x-2 mt-2">
              <button
                type="button"
                onClick={() => onCaptainChange(player)}
                className={`flex-1 text-xs py-1 px-2 rounded ${
                  captain === player
                    ? 'bg-yellow-500 text-yellow-900 font-bold'
                    : 'bg-white/10 text-white hover:bg-white/20'
                } transition-all`}
              >
                C
              </button>
              <button
                type="button"
                onClick={() => onViceCaptainChange(player)}
                className={`flex-1 text-xs py-1 px-2 rounded ${
                  viceCaptain === player
                    ? 'bg-blue-500 text-blue-900 font-bold'
                    : 'bg-white/10 text-white hover:bg-white/20'
                } transition-all`}
              >
                VC
              </button>
            </div>
          </div>
        ))}
      </div>

      {(captain || viceCaptain) && (
        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/20">
          <h3 className="text-white font-semibold mb-2">Selected Leaders:</h3>
          <div className="flex gap-4 text-sm">
            {captain && (
              <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full border border-yellow-500/30">
                🏅 Captain: {captain}
              </span>
            )}
            {viceCaptain && (
              <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30">
                ⭐ Vice-Captain: {viceCaptain}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerInput;