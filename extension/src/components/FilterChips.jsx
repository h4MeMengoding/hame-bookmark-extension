import React from 'react';
import { X, Plus, Check } from 'lucide-react';

const FilterChips = ({ activeFilters, onFilterChange, categories, onAddCategory, sortBy, onSortChange }) => {
  const defaultFilters = [
    { id: 'all', label: 'All', color: 'neo-cream' },
  ];

  const customFilters = categories.map(cat => ({
    id: cat.id,
    label: cat.name,
    color: cat.color,
  }));

  const allFilters = [...defaultFilters, ...customFilters];

  const handleFilterClick = (filterId) => {
    // If 'All' is clicked, clear other filters
    if (filterId === 'all') {
      onFilterChange(['all']);
      return;
    }

    // Remove 'all' if it exists
    let newFilters = activeFilters.filter(f => f !== 'all');

    // Toggle the clicked filter
    if (newFilters.includes(filterId)) {
      newFilters = newFilters.filter(f => f !== filterId);
      // If no filters left, default to 'all'
      if (newFilters.length === 0) {
        newFilters = ['all'];
      }
    } else {
      newFilters = [...newFilters, filterId];
    }

    onFilterChange(newFilters);
  };

  const isActive = (filterId) => {
    return activeFilters.includes(filterId);
  };

  return (
    <div className="mb-6 space-y-3">
      {/* Sort Options */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-black">Sort:</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-1.5 rounded-lg border-3 border-black font-bold text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="date">Latest First</option>
          <option value="alphabetical">A-Z</option>
          <option value="url">By URL</option>
        </select>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {allFilters.map((filter) => {
          const active = isActive(filter.id);
          return (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter.id)}
              className={`
                px-4 py-2 rounded-lg font-bold text-sm border-3 border-black 
                transition-all relative
                ${active
                  ? `bg-${filter.color} shadow-brutal` 
                  : 'bg-white shadow-brutal-sm hover:shadow-brutal'
                }
              `}
            >
              {active && filter.id !== 'all' && (
                <Check className="inline-block w-4 h-4 mr-1" strokeWidth={3} />
              )}
              {filter.label}
            </button>
          );
        })}
        
        {/* Add Category Button */}
        <button
          onClick={onAddCategory}
          className="px-3 py-2 bg-neo-green text-black rounded-lg font-bold text-sm border-3 border-black shadow-brutal-sm hover:shadow-brutal transition-all flex items-center gap-1"
          title="Add Category"
        >
          <Plus className="w-4 h-4" strokeWidth={3} />
          Category
        </button>
      </div>
    </div>
  );
};

export default FilterChips;
