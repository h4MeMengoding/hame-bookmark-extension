import React from 'react';
import { X, Plus } from 'lucide-react';

const FilterChips = ({ activeFilter, onFilterChange, categories = [], onAddCategory }) => {
  const defaultFilters = [
    { id: 'all', label: 'All', color: 'neo-cream' },
  ];

  const customFilters = categories.map(cat => ({
    id: cat.id,
    label: cat.name,
    color: cat.color,
  }));

  const allFilters = [...defaultFilters, ...customFilters];

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 flex-wrap">
        {allFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`
              px-4 py-2 rounded-lg font-bold text-sm border-3 border-black 
              transition-all
              ${activeFilter === filter.id 
                ? `bg-${filter.color} shadow-brutal` 
                : 'bg-white shadow-brutal-sm hover:shadow-brutal'
              }
            `}
          >
            {filter.label}
            {activeFilter === filter.id && filter.id !== 'all' && (
              <X className="inline-block w-4 h-4 ml-1" strokeWidth={3} />
            )}
          </button>
        ))}
        
        {/* Add Category Button */}
        <button
          onClick={onAddCategory}
          className="px-3 py-2 bg-neo-green text-black rounded-lg font-bold text-sm border-3 border-black shadow-brutal-sm hover:shadow-brutal transition-all flex items-center gap-1"
          title="Add Category"
        >
          <Plus className="w-4 h-4" strokeWidth={3} />
          Add
        </button>
      </div>
    </div>
  );
};

export default FilterChips;
