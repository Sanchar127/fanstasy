'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

interface MatchModalProps {
  editingMatch: any | null;
  onClose: () => void;
  onSave: (data: any) => void;
}

interface League {
  id: number;
  name: string;
}

interface Team {
  id: number;
  name: string;
}

export default function MatchModal({ editingMatch, onClose, onSave }: MatchModalProps) {
  const [formData, setFormData] = useState({
    fantasy_league_id: '',
    team_a_id: '',
    team_b_id: '',
    match_date: '',
    venue: '',
  });

  const [leagues, setLeagues] = useState<League[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper to get token
  const getToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No auth token found. Please login again.');
    return token;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();

        const [leagueRes, teamRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/leagues`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/teams`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setLeagues(leagueRes.data);
        setTeams(teamRes.data);

        if (editingMatch) {
          setFormData({
            fantasy_league_id: editingMatch.fantasy_league_id,
            team_a_id: editingMatch.team_a_id,
            team_b_id: editingMatch.team_b_id,
            match_date: editingMatch.match_date,
            venue: editingMatch.venue || '',
          });
        }
      } catch (err: any) {
        console.error('Error fetching leagues/teams:', err.response || err);
        alert(err.response?.data?.message || err.message || 'Failed to fetch leagues or teams');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [editingMatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = getToken();

      await onSave({
        ...formData,
        token, // optional if onSave needs token
      });
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Failed to save match');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
        <div className="text-white text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold">{editingMatch ? 'Edit Match' : 'Schedule Match'}</h2>

        {/* League */}
        <div>
          <label className="block text-sm font-medium text-gray-700">League</label>
          <select
            name="fantasy_league_id"
            value={formData.fantasy_league_id}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded p-2"
          >
            <option value="">Select League</option>
            {leagues.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>

        {/* Team A */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Team A</label>
          <select
            name="team_a_id"
            value={formData.team_a_id}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded p-2"
          >
            <option value="">Select Team A</option>
            {teams.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        {/* Team B */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Team B</label>
          <select
            name="team_b_id"
            value={formData.team_b_id}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded p-2"
          >
            <option value="">Select Team B</option>
            {teams.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        {/* Match Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Match Date</label>
          <input
            type="date"
            name="match_date"
            value={formData.match_date}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded p-2"
          />
        </div>

        {/* Venue */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Venue</label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            className="mt-1 block w-full border rounded p-2"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
