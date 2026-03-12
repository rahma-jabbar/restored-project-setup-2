import React from 'react';
import { useStore } from './store/useStore';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Tables from './components/Tables';
import Orders from './components/Orders';
import Menu from './components/Menu';
import Staff from './components/Staff';
import Reservations from './components/Reservations';

function App() {
  const { currentView } = useStore();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'tables':
        return <Tables />;
      case 'orders':
        return <Orders />;
      case 'menu':
        return <Menu />;
      case 'staff':
        return <Staff />;
      case 'reservations':
        return <Reservations />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#171717] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
}

export default App;
