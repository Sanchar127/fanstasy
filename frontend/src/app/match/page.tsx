'use client';
import AdminLayout from '@/components/AdminLayout';
import { useState } from 'react';

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [formData, setFormData] = useState({
    league: '',
    team1: '',
    team2: '',
    venue: '',
    startTime: '',
    matchDate: '',
    status: 'scheduled'
  });

  const leagues = [
    'ICC Cricket World Cup',
    'Indian Premier League',
    'Big Bash League',
    'Caribbean Premier League',
    'T20 Blast',
    'Pakistan Super League'
  ];

  const teams = [
    'India',
    'Australia', 
    'England',
    'Pakistan',
    'New Zealand',
    'South Africa',
    'West Indies',
    'Sri Lanka',
    'Bangladesh',
    'Afghanistan'
  ];

  const statusOptions = [
    'scheduled',
    'live',
    'completed',
    'cancelled',
    'postponed'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingMatch) {
      // Update existing match
      setMatches(prev => prev.map(match => 
        match.id === editingMatch.id 
          ? { ...formData, id: match.id }
          : match
      ));
    } else {
      // Create new match
      const newMatch = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toLocaleDateString()
      };
      setMatches(prev => [...prev, newMatch]);
    }
    
    handleCloseModal();
  };

  const handleEdit = (match) => {
    setEditingMatch(match);
    setFormData(match);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this match?')) {
      setMatches(prev => prev.filter(match => match.id !== id));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMatch(null);
    setFormData({
      league: '',
      team1: '',
      team2: '',
      venue: '',
      startTime: '',
      matchDate: '',
      status: 'scheduled'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      live: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      postponed: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatMatchTime = (date, time) => {
    if (!date) return '-';
    const matchDateTime = new Date(`${date}T${time}`);
    return matchDateTime.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getMatchResult = (match) => {
    if (match.status === 'completed') {
      // In a real app, this would come from match data
      const team1Score = `${Math.floor(Math.random() * 200)}/${Math.floor(Math.random() * 10)}`;
      const team2Score = `${Math.floor(Math.random() * 200)}/${Math.floor(Math.random() * 10)}`;
      const winner = Math.random() > 0.5 ? match.team1 : match.team2;
      
      return (
        <div className="text-sm text-gray-600 mt-1">
          <div>{match.team1}: {team1Score}</div>
          <div>{match.team2}: {team2Score}</div>
          <div className="font-semibold text-green-600">{winner} won</div>
        </div>
      );
    }
    return null;
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Match Management</h1>
              <p className="text-gray-600">Schedule and manage cricket matches</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
            >
              <span>+</span>
              <span>Schedule Match</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
              <h3 className="text-gray-500 text-sm font-medium">Total Matches</h3>
              <p className="text-3xl font-bold text-gray-900">{matches.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <h3 className="text-gray-500 text-sm font-medium">Live Matches</h3>
              <p className="text-3xl font-bold text-gray-900">
                {matches.filter(m => m.status === 'live').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <h3 className="text-gray-500 text-sm font-medium">Scheduled</h3>
              <p className="text-3xl font-bold text-gray-900">
                {matches.filter(m => m.status === 'scheduled').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <h3 className="text-gray-500 text-sm font-medium">Leagues</h3>
              <p className="text-3xl font-bold text-gray-900">
                {new Set(matches.map(m => m.league)).size}
              </p>
            </div>
          </div>

          {/* Matches Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {matches.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-4">🏏</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No matches scheduled</h3>
                <p className="text-gray-500 mb-6">Schedule your first match to get started</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Schedule Match
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">League</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {matches.map((match) => (
                      <tr key={match.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div className="font-semibold text-gray-900 text-center flex-1">
                                  {match.team1}
                                </div>
                                <div className="text-gray-400 mx-4">vs</div>
                                <div className="font-semibold text-gray-900 text-center flex-1">
                                  {match.team2}
                                </div>
                              </div>
                              {getMatchResult(match)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                            {match.league}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {match.venue || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatMatchTime(match.matchDate, match.startTime)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(match.status)}`}>
                            {match.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEdit(match)}
                              className="text-indigo-600 hover:text-indigo-900 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(match.id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Create/Edit Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editingMatch ? 'Edit Match' : 'Schedule New Match'}
                    </h2>
                    <button
                      onClick={handleCloseModal}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        League *
                      </label>
                      <select
                        name="league"
                        value={formData.league}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      >
                        <option value="">Select a league</option>
                        {leagues.map(league => (
                          <option key={league} value={league}>{league}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Team 1 *
                        </label>
                        <select
                          name="team1"
                          value={formData.team1}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        >
                          <option value="">Select team</option>
                          {teams.map(team => (
                            <option key={team} value={team}>{team}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Team 2 *
                        </label>
                        <select
                          name="team2"
                          value={formData.team2}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        >
                          <option value="">Select team</option>
                          {teams.map(team => (
                            <option key={team} value={team}>{team}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Venue
                      </label>
                      <input
                        type="text"
                        name="venue"
                        value={formData.venue}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="e.g., Melbourne Cricket Ground"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Match Date *
                        </label>
                        <input
                          type="date"
                          name="matchDate"
                          value={formData.matchDate}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Time *
                        </label>
                        <input
                          type="time"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Match Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                      >
                        {editingMatch ? 'Update Match' : 'Schedule Match'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}