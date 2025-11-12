'use client';

import React, { useState } from 'react';
import TeamInfo from './TeamInfo';
import PlayerInput from './PlayerInput';
import LeadershipSelection from './LeadershipSelection';
import { TeamData } from '@/types/team';

interface TeamFormProps {
  onSubmit: (teamData: TeamData) => void;
}

const TeamForm: React.FC<TeamFormProps> = ({ onSubmit }) => {
  const [teamName, setTeamName] = useState('');
  const [players, setPlayers] = useState<string[]>(Array(14).fill(''));
  const [captain, setCaptain] = useState('');
  const [viceCaptain, setViceCaptain] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields are filled
    if (!teamName.trim()) {
      alert('Please enter a team name');
      return;
    }

    if (players.some(player => !player.trim())) {
      alert('Please fill all 14 player names');
      return;
    }

    if (!captain || !viceCaptain) {
      alert('Please select both captain and vice-captain');
      return;
    }

    if (captain === viceCaptain) {
      alert('Captain and Vice-Captain cannot be the same player');
      return;
    }

    const teamData: TeamData = {
      userId: Math.floor(Math.random() * 10000), // In real app, get from auth
      teamName: teamName.trim(),
      players: players.map(p => p.trim()),
      captain: captain.trim(),
      viceCaptain: viceCaptain.trim(),
      pointsList: {},
      totalPoints: 0,
    };

    onSubmit(teamData);
  };

  const nextStep = () => {
    if (currentStep === 1 && !teamName.trim()) {
      alert('Please enter a team name');
      return;
    }
    if (currentStep === 2 && players.some(player => !player.trim())) {
      alert('Please fill all player names before proceeding');
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-white/5 px-8 py-4 border-b border-white/10">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${
                  step === currentStep
                    ? 'bg-purple-500 border-purple-500 text-white'
                    : step < currentStep
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-white/10 border-white/30 text-white/50'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-green-500' : 'bg-white/20'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between max-w-2xl mx-auto mt-2 text-sm text-white/70">
          <span>Team Info</span>
          <span>Players</span>
          <span>Leadership</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        {currentStep === 1 && (
          <TeamInfo teamName={teamName} onTeamNameChange={setTeamName} />
        )}

        {currentStep === 2 && (
          <PlayerInput
            players={players}
            onPlayersChange={setPlayers}
            captain={captain}
            viceCaptain={viceCaptain}
            onCaptainChange={setCaptain}
            onViceCaptainChange={setViceCaptain}
          />
        )}

        {currentStep === 3 && (
          <LeadershipSelection
            players={players}
            captain={captain}
            viceCaptain={viceCaptain}
            onCaptainChange={setCaptain}
            onViceCaptainChange={setViceCaptain}
          />
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-white/20">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-8 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-white/20"
          >
            Previous
          </button>

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-bold hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
            >
              Create Team
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TeamForm;