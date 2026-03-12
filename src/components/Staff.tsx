import React, { useEffect, useState } from 'react';
import { Plus, Mail, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { TABLES } from '../lib/tables';
import { Staff as StaffType } from '../types';

const Staff: React.FC = () => {
  const [staff, setStaff] = useState<StaffType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.staff)
        .select('*')
        .order('name');

      if (error) throw error;
      setStaff(data || []);
    } catch (error) {
      console.error('Error loading staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'manager':
        return 'from-[#f472b6] to-[#fb7185]';
      case 'chef':
        return 'from-[#1a5eec] to-[#38bdf8]';
      case 'waiter':
        return 'from-[#10b981] to-[#34d399]';
      case 'bartender':
        return 'from-[#f59e0b] to-[#fbbf24]';
      default:
        return 'from-[#6b7280] to-[#9ca3af]';
    }
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
          <h1 className="text-3xl font-bold text-white mb-2">Staff Management</h1>
          <p className="text-[#A3A3A3]">Manage your restaurant team</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-[#1a5eec] to-[#38bdf8] text-white rounded-2xl font-medium hover:shadow-lg hover:shadow-[#1a5eec]/30 transition-all duration-300 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Staff
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member) => (
          <div
            key={member.id}
            className="bg-[#262626] rounded-2xl p-6 border border-[#2F2F2F] hover:border-[#1a5eec]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#1a5eec]/20"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getRoleColor(member.role)} flex items-center justify-center shadow-lg`}>
                <span className="text-2xl font-bold text-white">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  member.status === 'active' ? 'bg-[#10b981]/20 text-[#10b981]' :
                  member.status === 'on_break' ? 'bg-[#f59e0b]/20 text-[#f59e0b]' :
                  'bg-[#6b7280]/20 text-[#6b7280]'
                }`}>
                  {member.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-[#A3A3A3] text-sm">
                <Mail className="w-4 h-4" />
                <span>{member.email}</span>
              </div>
              {member.phone && (
                <div className="flex items-center gap-2 text-[#A3A3A3] text-sm">
                  <Phone className="w-4 h-4" />
                  <span>{member.phone}</span>
                </div>
              )}
            </div>
            <div className="pt-4 border-t border-[#2F2F2F]">
              <p className="text-[#A3A3A3] text-sm">
                Shift: {member.shift_start} - {member.shift_end}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Staff;
