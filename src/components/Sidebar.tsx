import React from 'react';
import { LayoutDashboard, Utensils, ShoppingBag, Users, Calendar, ChefHat } from 'lucide-react';
import { useStore } from '../store/useStore';

const Sidebar: React.FC = () => {
  const { currentView, setCurrentView } = useStore();

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'tables', icon: Utensils, label: 'Tables' },
    { id: 'orders', icon: ShoppingBag, label: 'Orders' },
    { id: 'menu', icon: ChefHat, label: 'Menu' },
    { id: 'staff', icon: Users, label: 'Staff' },
    { id: 'reservations', icon: Calendar, label: 'Reservations' },
  ] as const;

  return (
    <aside className="w-72 bg-gradient-to-b from-[#262626] to-[#171717] border-r border-[#2F2F2F] flex flex-col">
      <div className="p-8 border-b border-[#2F2F2F]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1a5eec] to-[#38bdf8] flex items-center justify-center shadow-lg shadow-[#1a5eec]/20">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">RestaurantOS</h1>
            <p className="text-sm text-[#A3A3A3]">Management Suite</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                isActive
                  ? 'bg-gradient-to-r from-[#1a5eec] to-[#38bdf8] text-white shadow-lg shadow-[#1a5eec]/30'
                  : 'text-[#A3A3A3] hover:bg-[#2F2F2F] hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#2F2F2F]">
        <div className="bg-gradient-to-br from-[#1a5eec]/10 to-[#38bdf8]/10 rounded-2xl p-4 border border-[#1a5eec]/20">
          <p className="text-sm text-[#A3A3A3] mb-2">Today's Revenue</p>
          <p className="text-2xl font-bold text-white">$4,892</p>
          <p className="text-xs text-[#10b981] mt-1">↑ 12% from yesterday</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
