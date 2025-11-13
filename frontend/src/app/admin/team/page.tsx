'use client';
import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = 'http://127.0.0.1:8000/api/teams';
const LEAGUES_API_URL = 'http://127.0.0.1:8000/api/leagues';

export default function Team() {
  const [teams, setTeams] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    fantasy_league_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchTeams();
    fetchLeagues();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await axios.get(API_BASE_URL);
      setTeams(res.data);
    } catch (err) {
      console.error(err);
      showNotification('Failed to fetch teams', 'error');
    }
  };

  const fetchLeagues = async () => {
    try {
      const res = await axios.get(LEAGUES_API_URL);
      setLeagues(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const showNotification = (message, type = 'success') => {
    if (type === 'success') {
      setSuccess(message);
      setTimeout(() => setSuccess(''), 4000);
    } else {
      setError(message);
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const openCreateModal = () => {
    setEditingTeam(null);
    setFormData({ name: '', fantasy_league_id: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      fantasy_league_id: team.fantasy_league_id,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.name || !formData.fantasy_league_id) {
      setError('Team name and league are required.');
      setLoading(false);
      return;
    }

    try {
      if (editingTeam) {
        // 🟢 Update existing team
        const res = await axios.put(`${API_BASE_URL}/${editingTeam.id}`, formData);
        setTeams((prev) =>
          prev.map((team) => (team.id === editingTeam.id ? res.data.team : team))
        );
        showNotification('Team updated successfully! ✏️');
      } else {
        // 🆕 Create new team
        const res = await axios.post(API_BASE_URL, formData);
        setTeams((prev) => [...prev, res.data.team]);
        showNotification('Team created successfully! 🎉');
      }

      setIsModalOpen(false);
      setFormData({ name: '', fantasy_league_id: '' });
      setEditingTeam(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setTeams((prev) => prev.filter((team) => team.id !== id));
      showNotification('Team deleted successfully!');
    } catch (err) {
      console.error(err);
      showNotification('Failed to delete team', 'error');
    }
  };

  const getLeagueName = (leagueId) => {
    const league = leagues.find((l) => l.id === leagueId);
    return league ? league.name : 'Unknown League';
  };

  const stats = [
    {
      title: 'Total Teams',
      value: teams.length,
      icon: '⚽',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Active Teams',
      value: teams.length,
      icon: '✅',
      color: 'from-blue-500 to-cyan-500',
    },
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Notifications */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="mb-6 p-4 bg-green-500 text-white rounded-2xl shadow-lg flex items-center space-x-3"
              >
                <span>✓</span>
                <span className="font-medium">{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Team Management</h1>
              <p className="text-gray-600">Manage your football teams</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openCreateModal}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              <span>+</span>
              <span>Add Team</span>
            </motion.button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center`}
                  >
                    <span className="text-2xl text-white">{stat.icon}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Teams Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {teams.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">⚽</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No teams yet</h3>
                <p className="text-gray-500 mb-6">Add your first football team</p>
                <button
                  onClick={openCreateModal}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Add Team
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Team</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">League</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {teams.map((team) => (
                      <tr key={team.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900">{team.name}</td>
                        <td className="px-6 py-4 text-gray-600">{getLeagueName(team.fantasy_league_id)}</td>
                        <td className="px-6 py-4 space-x-4">
                          <button
                            onClick={() => openEditModal(team)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(team.id, team.name)}
                            className="text-red-600 hover:text-red-800 transition-colors"
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

          {/* Create/Edit Modal */}
          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-transparent flex items-center justify-center p-4 z-50"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editingTeam ? 'Edit Team' : 'Add New Team'}
                    </h2>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Team Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        placeholder="Enter team name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">League *</label>
                      <select
                        name="fantasy_league_id"
                        value={formData.fantasy_league_id}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      >
                        <option value="">Select League</option>
                        {leagues.map((league) => (
                          <option key={league.id} value={league.id}>
                            {league.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
                      >
                        {loading
                          ? editingTeam
                            ? 'Updating...'
                            : 'Creating...'
                          : editingTeam
                          ? 'Update Team'
                          : 'Add Team'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AdminLayout>
  );
}
