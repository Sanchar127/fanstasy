'use client';
import AdminLayout from '@/components/AdminLayout';
import MatchModal from '@/components/modal/MatchModal';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// --- Auth Helper ---
const getToken = () => localStorage.getItem('authToken');

const apiRequest = async (method: string, url: string, data?: any) => {
  try {
    const token = getToken();
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await axios({
      method,
      url: `${API_BASE_URL}${url}`,
      data,
      headers,
    });
    return response.data;
  } catch (error: any) {
    console.error('API Error:', error.response || error);
    throw error.response?.data || error;
  }
};

interface Match {
  id: number;
  fantasy_league_id: number;
  team_a_id: number;
  team_b_id: number;
  match_date: string;
  venue?: string;
  league?: { name: string };
  teamA?: { name: string };
  teamB?: { name: string };
}

export default function MatchPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [error, setError] = useState('');

  // Fetch matches
  const fetchMatches = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('get', '/matches');
      setMatches(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleEdit = (match: Match) => {
    setEditingMatch(match);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this match?')) return;
    try {
      await apiRequest('delete', `/matches/${id}`);
      setMatches(prev => prev.filter(m => m.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete match');
    }
  };

  const handleSave = async (formData: any) => {
    try {
      const method = editingMatch ? 'put' : 'post';
      const url = editingMatch ? `/matches/${editingMatch.id}` : '/matches';
      const savedMatch = await apiRequest(method, url, formData);

      if (editingMatch) {
        setMatches(prev => prev.map(m => (m.id === savedMatch.id ? savedMatch : m)));
      } else {
        setMatches(prev => [...prev, savedMatch]);
      }
      closeModal();
    } catch (err: any) {
      alert(err.message || 'Failed to save match');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMatch(null);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Match Management</h1>
              <p className="text-gray-600">Schedule and manage cricket matches</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              + Schedule Match
            </button>
          </div>

          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {loading ? (
              <div className="text-center py-16 text-gray-600">Loading matches...</div>
            ) : matches.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No matches found</h3>
                <p className="text-gray-500 mb-6">Click below to schedule one</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Schedule Match
                </button>
              </div>
            ) : (
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">League</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teams</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Venue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {matches.map(match => (
                    <tr key={match.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{match.league?.name || match.fantasy_league_id}</td>
                      <td className="px-6 py-4">{match.teamA?.name || match.team_a_id} vs {match.teamB?.name || match.team_b_id}</td>
                      <td className="px-6 py-4">{match.match_date}</td>
                      <td className="px-6 py-4">{match.venue || '-'}</td>
                      <td className="px-6 py-4 space-x-3">
                        <button onClick={() => handleEdit(match)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                        <button onClick={() => handleDelete(match.id)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {isModalOpen && <MatchModal editingMatch={editingMatch} onClose={closeModal} onSave={handleSave} />}
        </div>
      </div>
    </AdminLayout>
  );
}
