import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { TABLES } from '../lib/tables';
import { MenuItem } from '../types';
import MenuForm from './MenuForm';

const Menu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.menuItems)
        .select('*')
        .order('category');

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      console.error('Error loading menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
      return;
    }

    try {
      const { error } = await supabase
        .from(TABLES.menuItems)
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadMenuItems();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleFormSuccess = () => {
    loadMenuItems();
  };

  const categories = ['all', ...Array.from(new Set(menuItems.map(item => item.category)))];
  
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#1a5eec] border-t-transparent mx-auto"></div>
          <p className="text-[#A3A3A3]">Loading menu items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Menu Management</h1>
          <p className="text-[#A3A3A3]">Manage your restaurant menu items</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-[#1a5eec] to-[#38bdf8] text-white rounded-2xl font-medium hover:shadow-lg hover:shadow-[#1a5eec]/30 transition-all duration-300 flex items-center gap-2 justify-center"
        >
          <Plus className="w-5 h-5" />
          Add Item
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A3A3A3]" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#262626] border border-[#2F2F2F] rounded-2xl text-white placeholder-[#A3A3A3] focus:outline-none focus:border-[#1a5eec] transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-3 bg-[#262626] border border-[#2F2F2F] rounded-2xl">
          <Filter className="w-5 h-5 text-[#A3A3A3]" />
          <span className="text-[#A3A3A3] text-sm">Filter by category</span>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-2xl font-medium transition-all duration-300 whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-[#1a5eec] to-[#38bdf8] text-white shadow-lg shadow-[#1a5eec]/30'
                : 'bg-[#262626] text-[#A3A3A3] hover:text-white border border-[#2F2F2F] hover:border-[#1a5eec]/50'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#262626] rounded-2xl p-4 border border-[#2F2F2F]">
          <p className="text-[#A3A3A3] text-sm mb-1">Total Items</p>
          <p className="text-2xl font-bold text-white">{menuItems.length}</p>
        </div>
        <div className="bg-[#262626] rounded-2xl p-4 border border-[#2F2F2F]">
          <p className="text-[#A3A3A3] text-sm mb-1">Available</p>
          <p className="text-2xl font-bold text-[#10b981]">
            {menuItems.filter(item => item.available).length}
          </p>
        </div>
        <div className="bg-[#262626] rounded-2xl p-4 border border-[#2F2F2F]">
          <p className="text-[#A3A3A3] text-sm mb-1">Categories</p>
          <p className="text-2xl font-bold text-[#38bdf8]">{categories.length - 1}</p>
        </div>
        <div className="bg-[#262626] rounded-2xl p-4 border border-[#2F2F2F]">
          <p className="text-[#A3A3A3] text-sm mb-1">Avg. Price</p>
          <p className="text-2xl font-bold text-[#f472b6]">
            ${menuItems.length > 0 ? (menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-bold text-white mb-2">No items found</h3>
          <p className="text-[#A3A3A3] mb-6">
            {searchQuery ? 'Try adjusting your search' : 'Start by adding your first menu item'}
          </p>
          {!searchQuery && (
            <button 
              onClick={() => setIsFormOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#1a5eec] to-[#38bdf8] text-white rounded-2xl font-medium hover:shadow-lg hover:shadow-[#1a5eec]/30 transition-all duration-300 inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add First Item
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#262626] rounded-2xl overflow-hidden border border-[#2F2F2F] hover:border-[#1a5eec]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#1a5eec]/20 group"
            >
              <div className="relative h-48 bg-gradient-to-br from-[#1a5eec]/20 to-[#38bdf8]/20 overflow-hidden">
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl">🍽️</span>
                  </div>
                )}
                {!item.available && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-white font-bold px-4 py-2 bg-[#ef4444] rounded-full">Unavailable</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-white flex-1">{item.name}</h3>
                  <span className="text-xl font-bold text-[#1a5eec] ml-2">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-[#A3A3A3] text-sm mb-4 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-[#1a5eec]/20 text-[#1a5eec] text-xs font-medium">
                    {item.category}
                  </span>
                  <span className="text-[#A3A3A3] text-xs flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {item.preparation_time} min
                  </span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(item)}
                    className="flex-1 p-2 rounded-xl bg-[#171717] text-[#1a5eec] hover:bg-[#1a5eec]/20 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className={`flex-1 p-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium ${
                      deleteConfirm === item.id
                        ? 'bg-[#ef4444] text-white'
                        : 'bg-[#171717] text-[#ef4444] hover:bg-[#ef4444]/20'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    {deleteConfirm === item.id ? 'Confirm?' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Menu Form Modal */}
      <MenuForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        editItem={editingItem}
      />
    </div>
  );
};

export default Menu;
