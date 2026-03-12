import { create } from 'zustand';

interface AppState {
  currentView: 'dashboard' | 'tables' | 'orders' | 'menu' | 'staff' | 'reservations';
  setCurrentView: (view: AppState['currentView']) => void;
  selectedTable: string | null;
  setSelectedTable: (tableId: string | null) => void;
  selectedOrder: string | null;
  setSelectedOrder: (orderId: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  currentView: 'dashboard',
  setCurrentView: (view) => set({ currentView: view }),
  selectedTable: null,
  setSelectedTable: (tableId) => set({ selectedTable: tableId }),
  selectedOrder: null,
  setSelectedOrder: (orderId) => set({ selectedOrder: orderId }),
}));
