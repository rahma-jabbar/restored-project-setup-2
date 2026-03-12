import React, { useEffect, useState } from 'react';
import { Plus, Calendar, Clock, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { TABLES } from '../lib/tables';
import { Reservation } from '../types';

const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.reservations)
        .select('*')
        .order('reservation_date')
        .order('reservation_time');

      if (error) throw error;
      setReservations(data || []);
    } catch (error) {
      console.error('Error loading reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-[#10b981]/20 text-[#10b981]';
      case 'seated':
        return 'bg-[#1a5eec]/20 text-[#1a5eec]';
      case 'completed':
        return 'bg-[#6b7280]/20 text-[#6b7280]';
      case 'cancelled':
        return 'bg-[#ef4444]/20 text-[#ef4444]';
      case 'no_show':
        return 'bg-[#f59e0b]/20 text-[#f59e0b]';
      default:
        return 'bg-[#A3A3A3]/20 text-[#A3A3A3]';
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
          <h1 className="text-3xl font-bold text-white mb-2">Reservations</h1>
          <p className="text-[#A3A3A3]">Manage table reservations</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-[#1a5eec] to-[#38bdf8] text-white rounded-2xl font-medium hover:shadow-lg hover:shadow-[#1a5eec]/30 transition-all duration-300 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Reservation
        </button>
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="bg-[#262626] rounded-2xl p-6 border border-[#2F2F2F] hover:border-[#1a5eec]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#1a5eec]/20"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1a5eec] to-[#38bdf8] flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{reservation.customer_name}</h3>
                  <div className="flex flex-wrap gap-4 text-[#A3A3A3] text-sm mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(reservation.reservation_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{reservation.reservation_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{reservation.party_size} guests</span>
                    </div>
                  </div>
                  <p className="text-[#A3A3A3] text-sm">{reservation.customer_phone}</p>
                  {reservation.notes && (
                    <div className="mt-3 bg-[#171717] rounded-xl p-3 border border-[#2F2F2F]">
                      <p className="text-[#A3A3A3] text-sm">{reservation.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${getStatusColor(reservation.status)}`}>
                {reservation.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reservations;
