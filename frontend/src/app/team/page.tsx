'use client';
import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Users, 
  Trophy,
  Sword,
  Shield,
  Zap,
  Heart,
  Skull,
  Crown,
  Coins,
  Target,
  Calendar,
  Mail,
  Phone,
  Download,
  Upload,
  Copy,
  Star
} from 'lucide-react';

interface FantasyPlayer {
  id: string;
  name: string;
  position: 'Forward' | 'Midfielder' | 'Defender' | 'Goalkeeper';
  club: string;
  price: number;
  points: number;
  form: number;
  status: 'active' | 'injured' | 'suspended';
  nextOpponent: string;
}

interface FantasyTeam {
  id: string;
  name: string;
  owner: string;
  totalPoints: number;
  budget: number;
  formation: string;
  league: string;
  created: string;
  players: FantasyPlayer[];
}

export default function FantasyTeamManager() {
  const [teams, setTeams] = useState<FantasyTeam[]>([
    {
      id: '1',
      name: 'Dragon Slayers FC',
      owner: 'Alex Johnson',
      totalPoints: 1245,
      budget: 2.5,
      formation: '4-3-3',
      league: 'Premier Fantasy League',
      created: '2024-01-15',
      players: [
        {
          id: 'p1',
          name: 'Harry Kane',
          position: 'Forward',
          club: 'TOT',
          price: 12.5,
          points: 184,
          form: 7.2,
          status: 'active',
          nextOpponent: 'MCI'
        },
        {
          id: 'p2',
          name: 'Kevin De Bruyne',
          position: 'Midfielder',
          club: 'MCI',
          price: 11.0,
          points: 156,
          form: 8.1,
          status: 'active',
          nextOpponent: 'TOT'
        }
      ]
    },
    {
      id: '2',
      name: 'Phoenix Rising',
      owner: 'Sarah Miller',
      totalPoints: 1189,
      budget: 1.8,
      formation: '4-4-2',
      league: 'Champions Fantasy',
      created: '2024-02-10',
      players: [
        {
          id: 'p3',
          name: 'Mohamed Salah',
          position: 'Forward',
          club: 'LIV',
          price: 13.0,
          points: 198,
          form: 7.8,
          status: 'active',
          nextOpponent: 'ARS'
        }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<FantasyTeam | null>(null);
  const [activeTab, setActiveTab] = useState('teams');
  const [newTeam, setNewTeam] = useState({
    name: '',
    formation: '4-3-3',
    league: '',
    budget: 100
  });

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.league.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPositionIcon = (position: string) => {
    switch (position) {
      case 'Forward': return <Sword className="h-4 w-4" />;
      case 'Midfielder': return <Zap className="h-4 w-4" />;
      case 'Defender': return <Shield className="h-4 w-4" />;
      case 'Goalkeeper': return <Target className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'injured': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateTeam = () => {
    if (newTeam.name.trim()) {
      const team: FantasyTeam = {
        id: Date.now().toString(),
        name: newTeam.name,
        owner: 'You',
        totalPoints: 0,
        budget: newTeam.budget,
        formation: newTeam.formation,
        league: newTeam.league || 'My Fantasy League',
        created: new Date().toISOString().split('T')[0],
        players: []
      };
      setTeams([...teams, team]);
      setNewTeam({ name: '', formation: '4-3-3', league: '', budget: 100 });
      setShowCreateModal(false);
    }
  };

  const handleDeleteTeam = (teamId: string) => {
    setTeams(teams.filter(team => team.id !== teamId));
  };

  const duplicateTeam = (team: FantasyTeam) => {
    const duplicatedTeam = {
      ...team,
      id: Date.now().toString(),
      name: `${team.name} (Copy)`,
      owner: 'You'
    };
    setTeams([...teams, duplicatedTeam]);
  };

  const exportTeam = (team: FantasyTeam) => {
    const dataStr = JSON.stringify(team, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    // In a real app, you would create a download link
    console.log('Exporting team:', team.name, dataStr);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            Fantasy Team Manager
          </h1>
        </div>
        <p className="text-purple-200 text-lg">Build, manage, and dominate with your fantasy teams</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm">Total Teams</p>
              <p className="text-2xl font-bold text-white">{teams.length}</p>
            </div>
            <Users className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm">Total Points</p>
              <p className="text-2xl font-bold text-white">
                {teams.reduce((sum, team) => sum + team.totalPoints, 0)}
              </p>
            </div>
            <Star className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-300 text-sm">Avg. Budget</p>
              <p className="text-2xl font-bold text-white">
                £{((teams.reduce((sum, team) => sum + team.budget, 0)) / teams.length).toFixed(1)}M
              </p>
            </div>
            <Coins className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-300 text-sm">Active Leagues</p>
              <p className="text-2xl font-bold text-white">
                {new Set(teams.map(team => team.league)).size}
              </p>
            </div>
            <Crown className="h-8 w-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
        {/* Actions Bar */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('teams')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'teams'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700/70'
              }`}
            >
              My Teams
            </button>
            <button
              onClick={() => setActiveTab('players')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'players'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700/70'
              }`}
            >
              Player Market
            </button>
          </div>
          
          <div className="flex gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search teams, players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full lg:w-80 pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400"
              />
            </div>
            
            <button className="flex items-center gap-2 px-6 py-3 bg-slate-700/50 border border-slate-600 rounded-xl hover:bg-slate-700/70 transition-colors text-slate-300">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25"
            >
              <Plus className="h-5 w-5" />
              Create Team
            </button>
          </div>
        </div>

        {/* Teams Grid */}
        {activeTab === 'teams' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <div key={team.id} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10">
                {/* Team Header */}
                <div className="p-6 border-b border-slate-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{team.name}</h3>
                      <p className="text-slate-400 text-sm">by {team.owner}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm font-medium border border-yellow-500/30">
                        {team.totalPoints} pts
                      </span>
                      <div className="relative">
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                          <MoreVertical className="h-4 w-4 text-slate-400" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-slate-400 text-sm">Formation</p>
                      <p className="text-white font-semibold">{team.formation}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Budget</p>
                      <p className="text-green-400 font-semibold">£{team.budget}M</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Players</p>
                      <p className="text-white font-semibold">{team.players.length}/15</p>
                    </div>
                  </div>
                </div>

                {/* League Info */}
                <div className="px-6 py-3 bg-slate-750 border-y border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">{team.league}</span>
                    <span className="text-slate-500 text-sm">{team.created}</span>
                  </div>
                </div>

                {/* Players List */}
                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    {team.players.slice(0, 4).map((player) => (
                      <div key={player.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-xl border border-slate-600">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            player.position === 'Forward' ? 'bg-red-500/20' :
                            player.position === 'Midfielder' ? 'bg-blue-500/20' :
                            player.position === 'Defender' ? 'bg-green-500/20' :
                            'bg-yellow-500/20'
                          }`}>
                            {getPositionIcon(player.position)}
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{player.name}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <span>{player.club}</span>
                              <span>•</span>
                              <span>£{player.price}M</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500" />
                                {player.form}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(player.status)}`}>
                          {player.status}
                        </div>
                      </div>
                    ))}
                  </div>

                  {team.players.length > 4 && (
                    <div className="text-center text-slate-500 text-sm py-2">
                      +{team.players.length - 4} more players
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-slate-700">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-500/20 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-colors border border-blue-500/30">
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                    <button 
                      onClick={() => duplicateTeam(team)}
                      className="p-2 text-slate-400 hover:text-purple-300 hover:bg-purple-500/20 rounded-xl transition-colors border border-transparent hover:border-purple-500/30"
                      title="Duplicate Team"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => exportTeam(team)}
                      className="p-2 text-slate-400 hover:text-green-300 hover:bg-green-500/20 rounded-xl transition-colors border border-transparent hover:border-green-500/30"
                      title="Export Team"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteTeam(team.id)}
                      className="p-2 text-slate-400 hover:text-red-300 hover:bg-red-500/20 rounded-xl transition-colors border border-transparent hover:border-red-500/30"
                      title="Delete Team"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Player Market Tab */}
        {activeTab === 'players' && (
          <div className="text-center py-12">
            <Sword className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Player Market</h3>
            <p className="text-slate-500">Browse and transfer players to build your dream team</p>
          </div>
        )}

        {/* Empty State */}
        {activeTab === 'teams' && filteredTeams.length === 0 && (
          <div className="text-center py-16">
            <Trophy className="h-20 w-20 text-slate-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-slate-300 mb-2">No fantasy teams found</h3>
            <p className="text-slate-500 mb-6">Create your first team to start your fantasy journey!</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-500/25"
            >
              <Plus className="h-5 w-5" />
              Create Your First Team
            </button>
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Create Fantasy Team</h3>
            <p className="text-slate-400 mb-6">Build your dream fantasy squad</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400"
                  placeholder="Enter epic team name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Formation
                </label>
                <select
                  value={newTeam.formation}
                  onChange={(e) => setNewTeam({...newTeam, formation: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                >
                  <option value="4-3-3">4-3-3 (Attacking)</option>
                  <option value="4-4-2">4-4-2 (Balanced)</option>
                  <option value="3-5-2">3-5-2 (Midfield Control)</option>
                  <option value="5-3-2">5-3-2 (Defensive)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  League
                </label>
                <input
                  type="text"
                  value={newTeam.league}
                  onChange={(e) => setNewTeam({...newTeam, league: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400"
                  placeholder="Enter league name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Starting Budget (£M)
                </label>
                <input
                  type="number"
                  value={newTeam.budget}
                  onChange={(e) => setNewTeam({...newTeam, budget: Number(e.target.value)})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  min="0"
                  max="200"
                />
              </div>
            </div>
            
            <div className="flex gap-3 justify-end mt-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 text-slate-400 hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTeam}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                Create Team
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}