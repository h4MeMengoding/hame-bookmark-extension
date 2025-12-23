import React, { useState } from 'react';
import { Save, X, Tag } from 'lucide-react';

const CategoryForm = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('neo-blue');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colors = [
    { id: 'neo-blue', name: 'Blue', bg: 'bg-neo-blue' },
    { id: 'neo-pink', name: 'Pink', bg: 'bg-neo-pink' },
    { id: 'neo-green', name: 'Green', bg: 'bg-neo-green' },
    { id: 'neo-yellow', name: 'Yellow', bg: 'bg-neo-yellow' },
    { id: 'neo-purple', name: 'Purple', bg: 'bg-neo-purple' },
    { id: 'neo-orange', name: 'Orange', bg: 'bg-neo-orange' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(name.trim(), color);
      setName('');
      setColor('neo-blue');
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border-4 border-black shadow-brutal fade-in mb-4">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-black text-black flex items-center gap-2">
          <Tag className="w-6 h-6" strokeWidth={3} />
          Add New Category
        </h3>
        <button
          onClick={onCancel}
          className="text-black hover:bg-neo-cream p-1 rounded-lg transition-colors"
        >
          <X className="w-6 h-6" strokeWidth={3} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-bold text-black mb-2">
            Category Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-neo-green text-black font-semibold px-4 py-3 rounded-lg border-3 border-black focus:border-black transition-all"
            placeholder="Work, Personal, etc."
            required
            disabled={isSubmitting}
            maxLength={30}
          />
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-sm font-bold text-black mb-2">
            Color
          </label>
          <div className="grid grid-cols-6 gap-2">
            {colors.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setColor(c.id)}
                className={`
                  ${c.bg} h-12 rounded-lg border-3 border-black
                  ${color === c.id ? 'shadow-brutal scale-105' : 'shadow-brutal-sm'}
                  transition-all hover:scale-105
                `}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-neo-blue text-black font-black py-3 rounded-lg border-3 border-black shadow-brutal hover:shadow-brutal-sm active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" strokeWidth={3} />
            {isSubmitting ? 'Saving...' : 'Save Category'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-white text-black font-black rounded-lg border-3 border-black shadow-brutal hover:shadow-brutal-sm active:shadow-none transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
