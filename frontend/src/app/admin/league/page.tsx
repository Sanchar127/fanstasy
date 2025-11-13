'use client';
import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import LeagueModal from '@/components/modal/LeagueModal';

export default function LeaguePage() {
  const [leagues, setLeagues] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeague, setEditingLeague] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/leagues');
      setLeagues(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLeagues = leagues.filter(league =>
    league.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/leagues/${id}`);
      setLeagues(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete league');
    }
  };

  const handleEdit = (league: any) => {
    setEditingLeague(league);
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Leagues</h1>
          <button
            onClick={() => { setEditingLeague(null); setIsModalOpen(true); }}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
          >
            + Create League
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search leagues..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-lg mb-4"
        />

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">League</th>
                <th className="px-6 py-3 text-left">Created By</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeagues.map(league => (
                <tr key={league.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{league.name}</td>
                  <td className="px-6 py-4">{league.created_by ?? '—'}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => handleEdit(league)}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(league.id, league.name)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <LeagueModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          leagueToEdit={editingLeague}
          refreshLeagues={fetchLeagues}
        />
      </div>
    </AdminLayout>
  );
}
