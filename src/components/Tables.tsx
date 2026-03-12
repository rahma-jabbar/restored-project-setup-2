import React, { useEffect, useState } from 'react';
import { Plus, Users, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { TABLES } from '../lib/tables';
import { Table } from '../types';

const Tables: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.tables)
        .select('*')
        .order('table_number');

      if (error) throw error;
      setTables(data || []);
    } catch (error) {
      console.error('Error loading tables:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'from-[#10b981] to-[#34d399]';
      case 'occupied':
        return 'from-[#ef4444] to-[#f87171]';
      case 'reserved':
        return 'from-[#f59e0b] to-[#fbbf24]';
      case 'cleaning':
        return 'from-[#6b7280] to-[#9ca3af]';
      default:
        return 'from-[#1a5eec] to-[#38bdf8]';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1a5eec] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Table Management</h1>
          <p className="text-[#A3A3A3]">Monitor and manage restaurant tables</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-[#1a5eec] to-[#38bdf8] text-white rounded-2xl font-medium hover:shadow-lg hover:shadow-[#1a5eec]/30 transition-all duration-300 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Table
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Available', count: tables.filter(t => t.status === 'available').length, color: 'text-[#10b981]' },
          { label: 'Occupied', count: tables.filter(t => t.status === 'occupied').length, color: 'text-[#ef4444]' },
          { label: 'Reserved', count: tables.filter(t => t.status === 'reserved').length, color: 'text-[#f59e0b]' },
          { label: 'Cleaning', count: tables.filter(t => t.status === 'cleaning').length, color: 'text-[#6b7280]' },
        ].map((stat, index) => (
          <div key={index} className="bg-[#262626] rounded-2xl p-4 border border-[#2F2F2F]">
            <p className="text-[#A3A3A3]text-sm mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map((table) => (
          <div
            key={table.id}
            className="bg-[#262626] rounded-2xl p-6 border border-[#2F2F2F] hover:border-[#1a5eec]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#1a5eec]/20 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getStatusColor(table.status)} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-2xl font-bold text-white">{table.table_number}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                table.status === 'available' ? 'bg-[#10b981]/20 text-[#10b981]' :
                table.status === 'occupied' ? 'bg-[#ef4444]/20 text-[#ef4444]' :
                table.status === 'reserved' ? 'bg-[#f59e0b]/20 text-[#f59e0b]' :
                'bg-[#6b7280]/20 text-[#6b7280]'
              }`}>
                {getStatusLabel(table.status)}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#A3A3A3]">
                <Users className="w-4 h-4" />
                <span className="text-sm">Capacity: {table.capacity} guests</span>
              </div>
              {table.status === 'occupied' && (
                <div className="flex items-center gap-2 text-[#A3A3A3]">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">45 minutes</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tables;
