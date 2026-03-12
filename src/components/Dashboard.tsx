import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, ShoppingBag, DollarSign, Clock, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { TABLES } from '../lib/tables';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    totalRevenue: 0,
    occupiedTables: 0,
    totalTables: 0,
    activeStaff: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [ordersRes, tablesRes, staffRes] = await Promise.all([
        supabase.from(TABLES.orders).select('*'),
        supabase.from(TABLES.tables).select('*'),
        supabase.from(TABLES.staff).select('*').eq('status', 'active'),
      ]);

      const orders = ordersRes.data || [];
      const tables = tablesRes.data || [];
      const staff = staffRes.data || [];

      const activeOrders = orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status));
      const totalRevenue = orders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
      const occupiedTables = tables.filter(t => t.status === 'occupied').length;

      setStats({
        totalOrders: orders.length,
        activeOrders: activeOrders.length,
        totalRevenue,
        occupiedTables,
        totalTables: tables.length,
        activeStaff: staff.length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const statCards = [
    {
      title: 'Active Orders',
      value: stats.activeOrders,
      icon: ShoppingBag,
      color: 'from-[#1a5eec] to-[#38bdf8]',
      change: '+8%',
    },
    {
      title: "Today's Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-[#10b981] to-[#34d399]',
      change: '+12%',
    },
    {
      title: 'Table Occupancy',
      value: `${stats.occupiedTables}/${stats.totalTables}`,
      icon: Users,
      color: 'from-[#f472b6] to-[#fb7185]',
      change: '75%',
    },
    {
      title: 'Active Staff',
      value: stats.activeStaff,
      icon: Clock,
      color: 'from-[#f59e0b] to-[#fbbf24]',
      change: '100%',
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a5eec] via-[#38bdf8] to-[#f472b6] p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1920')] opacity-10 bg-cover bg-center"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome Back, Chef! 👨‍🍳</h1>
          <p className="text-white/90 text-lg">Your restaurant is running smoothly today</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-[#262626] rounded-2xl p-6 border border-[#2F2F2F] hover:border-[#1a5eec]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#1a5eec]/20 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-[#10b981] text-sm font-medium">{stat.change}</span>
              </div>
              <p className="text-[#A3A3A3] text-sm mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-[#262626] rounded-2xl p-6 border border-[#2F2F2F]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Orders</h2>
            <button className="text-[#1a5eec] text-sm font-medium hover:text-[#38bdf8] transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[#171717] border border-[#2F2F2F] hover:border-[#1a5eec]/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1a5eec] to-[#38bdf8] flex items-center justify-center">
                  <span className="text-white font-bold">#{i}</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Table {i + 2}</p>
                  <p className="text-[#A3A3A3] text-sm">2 items • $45.00</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#f59e0b]/20 text-[#f59e0b] text-xs font-medium">
                  Preparing
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#262626] rounded-2xl p-6 border border-[#2F2F2F]">
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'New Order', icon: ShoppingBag, color: 'from-[#1a5eec] to-[#38bdf8]' },
              { label: 'Add Reservation', icon: Clock, color: 'from-[#f472b6] to-[#fb7185]' },
              { label: 'Update Menu', icon: Star, color: 'from-[#10b981] to-[#34d399]' },
              { label: 'View Reports', icon: TrendingUp, color: 'from-[#f59e0b] to-[#fbbf24]' },
            ].map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  className="p-6 rounded-2xl bg-[#171717] border border-[#2F2F2F] hover:border-[#1a5eec]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#1a5eec]/20 group"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-white font-medium text-sm">{action.label}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
