'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/players';
const TEAM_API_URL = 'http://127.0.0.1:8000/api/teams';
const PLAYER_ROLES = ['WK', 'BAT', 'ALL', 'BOWL'];

export default function PlayerPage() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [formData, setFormData] = useState({ team_id: '', name: '', role: 'BAT' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchPlayers();
    fetchTeams();
  }, []);

  const fetchPlayers = async () => {
    try {
      const res = await axios.get(API_BASE_URL);
      setPlayers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await axios.get(TEAM_API_URL);
      setTeams(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openAddModal = () => {
    setFormData({ team_id: '', name: '', role: 'BAT' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (player) => {
    setSelectedPlayer(player);
    setFormData({
      team_id: player.team_id || '',
      name: player.name,
      role: player.role,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditing && selectedPlayer) {
        // Update player
        const res = await axios.put(`${API_BASE_URL}/${selectedPlayer.id}`, formData);
        setPlayers((prev) =>
          prev.map((p) => (p.id === selectedPlayer.id ? res.data.player : p))
        );
      } else {
        // Add new player
        const res = await axios.post(API_BASE_URL, {
          team_id: formData.team_id,
          players: [{ name: formData.name, role: formData.role }],
        });
        setPlayers((prev) => [...prev, ...res.data.players]);
      }

      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this player?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setPlayers((prev) => prev.filter((player) => player.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete player');
    }
  };

  const resetForm = () => {
    setFormData({ team_id: '', name: '', role: 'BAT' });
    setSelectedPlayer(null);
    setIsEditing(false);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Player Management</h1>
              <p className="text-gray-600">Manage all players across teams</p>
            </div>
            <button
              onClick={openAddModal}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg"
            >
              + Add Player
            </button>
          </div>

          {/* Player Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {players.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-4">🏏</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No players yet</h3>
                <p className="text-gray-500 mb-6">Add your first player to get started</p>
                <button
                  onClick={openAddModal}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Add Player
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                        Team
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {players.map((player) => (
                      <tr key={player.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900">{player.name}</td>
                        <td className="px-6 py-4 text-gray-600">{player.role}</td>
                        <td className="px-6 py-4 text-gray-600">{player.team?.name}</td>
                        <td className="px-6 py-4 text-sm flex space-x-3">
                          <button
                            onClick={() => openEditModal(player)}
                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(player.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isEditing ? 'Edit Player' : 'Add Player'}
                  </h2>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Team *
                    </label>
                    <select
                      name="team_id"
                      value={formData.team_id}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, team_id: e.target.value }))
                      }
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Team</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Player Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      required
                      placeholder="Enter player name"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, role: e.target.value }))
                      }
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      {PLAYER_ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>

                  {error && <p className="text-red-600 text-sm">{error}</p>}

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        resetForm();
                      }}
                      className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
                    >
                      {loading ? 'Saving...' : isEditing ? 'Update' : 'Add'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
