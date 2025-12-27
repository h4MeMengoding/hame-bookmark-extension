import React, { useState, useEffect } from 'react';
import { Save, X, Tag, Plus } from 'lucide-react';

const CategoryForm = ({ onSubmit, onCancel, category }) => {
  const [name, setName] = useState(category?.name || '');
  const [color, setColor] = useState(category?.color || 'neo-blue');
  const [customHex, setCustomHex] = useState(typeof category?.color === 'string' && category.color.startsWith('#') ? category.color : '#ff0000');
  const [showPicker, setShowPicker] = useState(false);
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
      // Call onSubmit(name, color, id?) - if `category` provided, form is in edit mode
      await onSubmit(name.trim(), color, category?.id);
      setName('');
      setColor('neo-blue');
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Keep form in sync if `category` prop changes (open edit form)
  useEffect(() => {
    setName(category?.name || '');
    setColor(category?.color || 'neo-blue');
    if (typeof category?.color === 'string' && category.color.startsWith('#')) {
      setCustomHex(category.color);
    }
  }, [category]);

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
            className="w-full bg-neo-green text-black font-semibold px-4 py-3 rounded-lg border-3 border-black focus:border-black transition-all placeholder-gray-500"
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
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3 pr-2">
              {colors.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={`
                    ${c.bg} h-10 w-10 md:h-12 md:w-12 rounded-lg border-3 border-black flex-shrink-0
                    ${color === c.id ? 'shadow-brutal scale-105' : 'shadow-brutal-sm'}
                    transition-all hover:scale-105
                  `}
                  title={c.name}
                />
              ))}
              {/* custom hex swatch (visible after pick) */}
              {customHex && (
                <button
                  type="button"
                  onClick={() => setColor(customHex)}
                  className={`h-10 w-10 md:h-12 md:w-12 rounded-lg border-3 border-black flex-shrink-0
                    ${color === customHex ? 'shadow-brutal scale-105' : 'shadow-brutal-sm'}
                    transition-all hover:scale-105`
                  }
                  title="Custom color"
                  style={{ backgroundColor: customHex }}
                />
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPicker(true)}
                  className="h-12 w-12 rounded-lg border-3 border-black bg-white flex items-center justify-center shadow-brutal-sm hover:scale-105 transition-all"
                  title="Add custom color"
                >
                  <Plus className="w-5 h-5" strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Custom color picker popup */}
        {showPicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-30" onClick={() => setShowPicker(false)} />
            <div className="relative bg-white rounded-lg p-4 border-2 border-black shadow-brutal w-80">
              <h4 className="font-black mb-2">Pick custom color</h4>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-14 w-14 rounded-lg border-2 border-black" style={{ backgroundColor: customHex }} />
                <input
                  type="color"
                  value={customHex}
                  onChange={(e) => setCustomHex(e.target.value)}
                  className="h-10 w-12 p-0 m-0 rounded-md border-2 border-black"
                />
                <input
                  type="text"
                  value={customHex}
                  onChange={(e) => {
                    const v = e.target.value;
                    const normalized = v.startsWith('#') ? v : `#${v.replace(/^#/, '')}`;
                    setCustomHex(normalized);
                  }}
                  className="flex-1 text-center bg-white text-black font-semibold px-2 py-1 rounded-md border-2 border-black focus:border-black transition-all"
                />
                {/* removed quick-black button */}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPicker(false)}
                  className="px-3 py-2 bg-white text-black font-black rounded-lg border-2 border-black"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => { setColor(customHex); setShowPicker(false); }}
                  className="px-3 py-2 bg-neo-blue text-black font-black rounded-lg border-2 border-black"
                >
                  Use color
                </button>
              </div>
            </div>
          </div>
        )}

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
