import React, { useState, useEffect } from 'react';
import { X, Upload, DollarSign, Clock, Tag, FileText, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { TABLES } from '../lib/tables';
import { MenuItem } from '../types';

interface MenuFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editItem?: MenuItem | null;
}

const MenuForm: React.FC<MenuFormProps> = ({ isOpen, onClose, onSuccess, editItem }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    image_url: '',
    available: true,
    preparation_time: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name,
        description: editItem.description,
        category: editItem.category,
        price: editItem.price.toString(),
        image_url: editItem.image_url,
        available: editItem.available,
        preparation_time: editItem.preparation_time.toString(),
      });
    } else {
      resetForm();
    }
  }, [editItem, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      price: '',
      image_url: '',
      available: true,
      preparation_time: '',
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.preparation_time || parseInt(formData.preparation_time) <= 0) {
      newErrors.preparation_time = 'Valid preparation time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const itemData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        price: parseFloat(formData.price),
        image_url: formData.image_url.trim(),
        available: formData.available,
        preparation_time: parseInt(formData.preparation_time),
        updated_at: new Date().toISOString(),
      };

      if (editItem) {
        const { error } = await supabase
          .from(TABLES.menuItems)
          .update(itemData)
          .eq('id', editItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from(TABLES.menuItems)
          .insert([itemData]);

        if (error) throw error;
      }

      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error saving menu item:', error);
      setErrors({ submit: 'Failed to save menu item. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#262626] rounded-3xl border border-[#2F2F2F] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#262626] border-b border-[#2F2F2F] p-6 flex items-center justify-between rounded-t-3xl">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {editItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h2>
            <p className="text-[#A3A3A3] text-sm mt-1">
              {editItem ? 'Update the details below' : 'Fill in the details to create a new menu item'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#171717] text-[#A3A3A3] hover:text-white hover:bg-[#2F2F2F] transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-white">
              <Tag className="w-4 h-4 text-[#1a5eec]" />
              Item Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Margherita Pizza"
              className={`w-full px-4 py-3 bg-[#171717] border ${
                errors.name ? 'border-[#ef4444]' : 'border-[#2F2F2F]'
              } rounded-2xl text-white placeholder-[#A3A3A3] focus:outline-none focus:border-[#1a5eec] transition-colors`}
            />
            {errors.name && <p className="text-[#ef4444] text-sm">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-white">
              <FileText className="w-4 h-4 text-[#1a5eec]" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the dish, ingredients, and what makes it special..."
              rows={4}
              className={`w-full px-4 py-3 bg-[#171717] border ${
                errors.description ? 'border-[#ef4444]' : 'border-[#2F2F2F]'
              } rounded-2xl text-white placeholder-[#A3A3A3] focus:outline-none focus:border-[#1a5eec] transition-colors resize-none`}
            />
            {errors.description && <p className="text-[#ef4444] text-sm">{errors.description}</p>}
          </div>

          {/* Category and Price Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-white">
                <Tag className="w-4 h-4 text-[#1a5eec]" />
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-[#171717] border ${
                  errors.category ? 'border-[#ef4444]' : 'border-[#2F2F2F]'
                } rounded-2xl text-white focus:outline-none focus:border-[#1a5eec] transition-colors`}
              >
                <option value="">Select category</option>
                <option value="appetizers">Appetizers</option>
                <option value="main">Main Course</option>
                <option value="desserts">Desserts</option>
                <option value="beverages">Beverages</option>
                <option value="salads">Salads</option>
                <option value="soups">Soups</option>
              </select>
              {errors.category && <p className="text-[#ef4444] text-sm">{errors.category}</p>}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-white">
                <DollarSign className="w-4 h-4 text-[#1a5eec]" />
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={`w-full px-4 py-3 bg-[#171717] border ${
                  errors.price ? 'border-[#ef4444]' : 'border-[#2F2F2F]'
                } rounded-2xl text-white placeholder-[#A3A3A3] focus:outline-none focus:border-[#1a5eec] transition-colors`}
              />
              {errors.price && <p className="text-[#ef4444] text-sm">{errors.price}</p>}
            </div>
          </div>

          {/* Preparation Time */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-white">
              <Clock className="w-4 h-4 text-[#1a5eec]" />
              Preparation Time (minutes)
            </label>
            <input
              type="number"
              name="preparation_time"
              value={formData.preparation_time}
              onChange={handleChange}
              placeholder="15"
              min="1"
              className={`w-full px-4 py-3 bg-[#171717] border ${
                errors.preparation_time ? 'border-[#ef4444]' : 'border-[#2F2F2F]'
              } rounded-2xl text-white placeholder-[#A3A3A3] focus:outline-none focus:border-[#1a5eec] transition-colors`}
            />
            {errors.preparation_time && <p className="text-[#ef4444] text-sm">{errors.preparation_time}</p>}
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-white">
              <ImageIcon className="w-4 h-4 text-[#1a5eec]" />
              Image URL (Pexels)
            </label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://images.pexels.com/photos/..."
              className="w-full px-4 py-3 bg-[#171717] border border-[#2F2F2F] rounded-2xl text-white placeholder-[#A3A3A3] focus:outline-none focus:border-[#1a5eec] transition-colors"
            />
            <p className="text-[#A3A3A3] text-xs">Use high-quality images from Pexels for best results</p>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center justify-between p-4 bg-[#171717] rounded-2xl border border-[#2F2F2F]">
            <div>
              <p className="text-white font-medium">Available for Order</p>
              <p className="text-[#A3A3A3] text-sm">Toggle item availability</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-[#2F2F2F] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#1a5eec] peer-checked:to-[#38bdf8]"></div>
            </label>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="p-4 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-2xl">
              <p className="text-[#ef4444] text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-[#171717] text-white rounded-2xl font-medium hover:bg-[#2F2F2F] transition-all duration-300 border border-[#2F2F2F]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#1a5eec] to-[#38bdf8] text-white rounded-2xl font-medium hover:shadow-lg hover:shadow-[#1a5eec]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>{editItem ? 'Update Item' : 'Add Item'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuForm;
