'use client';
import AdminLayout from '@/components/AdminLayout';
import { useState } from 'react';

export default function Player() {
  const [players, setPlayers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sport: 'cricket',
    team: '',
    role: '',
    jerseyNumber: '',
    nationality: '',
    age: '',
    matchesPlayed: '',
    totalRuns: '',
    totalWickets: '',
    status: 'active'
  });

  const sports = [
    { value: 'cricket', label: 'Cricket' },
    { value: 'football', label: 'Football' },
    { value: 'basketball', label: 'Basketball' }
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

  const cricketRoles = ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'];
  const footballRoles = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
  const basketballRoles = ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'];

  const statusOptions = ['active', 'injured', 'retired'];

  const getRolesBySport = (sport) => {
    switch (sport) {
      case 'cricket': return cricketRoles;
      case 'football': return footballRoles;
      case 'basketball': return basketballRoles;
      default: return [];
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'sport') {
      // Reset role when sport changes
      setFormData(prev => ({
        ...prev,
        [name]: value,
        role: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingPlayer) {
      // Update existing player
      setPlayers(prev => prev.map(player => 
        player.id === editingPlayer.id 
          ? { ...formData, id: player.id }
          : player
      ));
    } else {
      // Create new player
      const newPlayer = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toLocaleDateString()
      };
      setPlayers(prev => [...prev, newPlayer]);
    }
    
    handleCloseModal();
  };

  const handleEdit = (player) => {
    setEditingPlayer(player);
    setFormData(player);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this player?')) {
      setPlayers(prev => prev.filter(player => player.id !== id));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlayer(null);
    setFormData({
      name: '',
      sport: 'cricket',
      team: '',
      role: '',
      jerseyNumber: '',
      nationality: '',
      age: '',
      matchesPlayed: '',
      totalRuns: '',
      totalWickets: '',
      status: 'active'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      injured: 'bg-yellow-100 text-yellow-800',
      retired: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getSportColor = (sport) => {
    const colors = {
      cricket: 'bg-orange-100 text-orange-800',
      football: 'bg-blue-100 text-blue-800',
      basketball: 'bg-red-100 text-red-800'
    };
    return colors[sport] || 'bg-gray-100 text-gray-800';
  };

  const renderPlayerStats = (player) => {
    if (player.sport === 'cricket') {
      return (
        <div className="flex space-x-4 text-sm text-gray-600">
          <span>Matches: {player.matchesPlayed || '0'}</span>
          <span>Runs: {player.totalRuns || '0'}</span>
          <span>Wickets: {player.totalWickets || '0'}</span>
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Player Management</h1>
              <p className="text-gray-600">Manage players across different sports</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
            >
              <span>+</span>
              <span>Add New Player</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
              <h3 className="text-gray-500 text-sm font-medium">Total Players</h3>
              <p className="text-3xl font-bold text-gray-900">{players.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <h3 className="text-gray-500 text-sm font-medium">Active Players</h3>
              <p className="text-3xl font-bold text-gray-900">
                {players.filter(p => p.status === 'active').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
              <h3 className="text-gray-500 text-sm font-medium">Cricket Players</h3>
              <p className="text-3xl font-bold text-gray-900">
                {players.filter(p => p.sport === 'cricket').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <h3 className="text-gray-500 text-sm font-medium">Teams</h3>
              <p className="text-3xl font-bold text-gray-900">
                {new Set(players.map(p => p.team)).size}
              </p>
            </div>
          </div>

          {/* Players Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {players.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-4">🏏</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No players yet</h3>
                <p className="text-gray-500 mb-6">Add your first player to get started</p>
                <button
                  onClick={() => setIsModalOpen(true)}
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
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sport</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jersey #</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {players.map((player) => (
                      <tr key={player.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{player.name}</div>
                          <div className="text-sm text-gray-500">{player.nationality}</div>
                          {renderPlayerStats(player)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSportColor(player.sport)}`}>
                            {player.sport}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{player.team}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                            {player.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {player.jerseyNumber ? `#${player.jerseyNumber}` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{player.age}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(player.status)}`}>
                            {player.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEdit(player)}
                              className="text-indigo-600 hover:text-indigo-900 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(player.id)}
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
                      {editingPlayer ? 'Edit Player' : 'Add New Player'}
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
                        Player Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="e.g., Virat Kohli"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sport *
                        </label>
                        <select
                          name="sport"
                          value={formData.sport}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        >
                          {sports.map(sport => (
                            <option key={sport.value} value={sport.value}>
                              {sport.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Team *
                        </label>
                        <select
                          name="team"
                          value={formData.team}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        >
                          <option value="">Select a team</option>
                          {teams.map(team => (
                            <option key={team} value={team}>{team}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role *
                        </label>
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        >
                          <option value="">Select a role</option>
                          {getRolesBySport(formData.sport).map(role => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Jersey Number
                        </label>
                        <input
                          type="number"
                          name="jerseyNumber"
                          value={formData.jerseyNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          placeholder="e.g., 18"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nationality
                        </label>
                        <input
                          type="text"
                          name="nationality"
                          value={formData.nationality}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          placeholder="e.g., Indian"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Age
                        </label>
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          placeholder="e.g., 28"
                        />
                      </div>
                    </div>

                    {/* Cricket Specific Stats */}
                    {formData.sport === 'cricket' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Matches Played
                          </label>
                          <input
                            type="number"
                            name="matchesPlayed"
                            value={formData.matchesPlayed}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="e.g., 100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Total Runs
                          </label>
                          <input
                            type="number"
                            name="totalRuns"
                            value={formData.totalRuns}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="e.g., 5000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Total Wickets
                          </label>
                          <input
                            type="number"
                            name="totalWickets"
                            value={formData.totalWickets}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="e.g., 50"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
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
                        {editingPlayer ? 'Update Player' : 'Add Player'}
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