import React, { useEffect, useState } from 'react';
import { Plus, Clock, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { TABLES } from '../lib/tables';
import { Order } from '../types';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'preparing' | 'ready' | 'completed'>('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.orders)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-[#f59e0b]/20 text-[#f59e0b]';
      case 'preparing':
        return 'bg-[#1a5eec]/20 text-[#1a5eec]';
      case 'ready':
        return 'bg-[#10b981]/20 text-[#10b981]';
      case 'completed':
        return 'bg-[#6b7280]/20 text-[#6b7280]';
      case 'cancelled':
        return 'bg-[#ef4444]/20 text-[#ef4444]';
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
          <h1 className="text-3xl font-bold text-white mb-2">Order Management</h1>
          <p className="text-[#A3A3A3]">Track and manage all orders</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-[#1a5eec] to-[#38bdf8] text-white rounded-2xl font-medium hover:shadow-lg hover:shadow-[#1a5eec]/30 transition-all duration-300 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Order
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {['all', 'pending', 'preparing', 'ready', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-6 py-2 rounded-2xl font-medium transition-all duration-300 whitespace-nowrap ${
              filter === status
                ? 'bg-gradient-to-r from-[#1a5eec] to-[#38bdf8] text-white shadow-lg shadow-[#1a5eec]/30'
                : 'bg-[#262626] text-[#A3A3A3] hover:text-white border border-[#2F2F2F]'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-[#262626] rounded-2xl p-6 border border-[#2F2F2F] hover:border-[#1a5eec]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#1a5eec]/20"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1a5eec] to-[#38bdf8] flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold">#{order.id.slice(0, 4)}</span>
                </div>
                <div>
                  <p className="text-white font-medium">{order.customer_name || 'Walk-in Customer'}</p>
                  <p className="text-[#A3A3A3] text-sm">
                    {new Date(order.created_at).toLocaleTimeString()} • Table {order.table_id?.slice(0, 4)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <p className="text-2xl font-bold text-white">${order.total_amount.toFixed(2)}</p>
              </div>
            </div>
            {order.notes && (
              <div className="bg-[#171717] rounded-xl p-3 border border-[#2F2F2F]">
                <p className="text-[#A3A3A3] text-sm">{order.notes}</p>
              </div>
            )}
            <div className="flex gap-2 mt-4">
              <button className="flex-1 px-4 py-2 bg-[#10b981]/20 text-[#10b981] rounded-xl font-medium hover:bg-[#10b981]/30 transition-colors flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Mark Ready
              </button>
              <button className="flex-1 px-4 py-2 bg-[#ef4444]/20 text-[#ef4444] rounded-xl font-medium hover:bg-[#ef4444]/30 transition-colors flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
