'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import TeamForm from '@/components/TeamForm';
import { TeamData } from '@/types/team';

const CreateTeamPage: React.FC = () => {
  const router = useRouter();

  const handleSubmit = async (teamData: TeamData) => {
    try {
      console.log('Team Data:', teamData);
      
      // Here you would typically make an API call to save the team
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamData),
      });

      if (response.ok) {
        alert('Team created successfully!');
        router.push('/');
      } else {
        throw new Error('Failed to create team');
      }
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Error creating team. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Create Your Dream Team
          </h1>
          <p className="text-purple-200 text-lg">
            Build your squad of 14 players and select your leaders
          </p>
        </div>
        <TeamForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default CreateTeamPage;