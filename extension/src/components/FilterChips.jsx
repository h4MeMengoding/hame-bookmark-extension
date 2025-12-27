import React from 'react';
import { X, Plus, Check } from 'lucide-react';

const FilterChips = ({ activeFilters, onFilterChange, categories, onAddCategory, onEditCategory, sortBy, onSortChange }) => {
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
    // Enforce single-select: selecting a category activates only that one.
    // If clicked the currently active category, revert to 'all'.
    const currentlyActive = activeFilters.includes(filterId);
    if (currentlyActive) {
      onFilterChange(['all']);
    } else {
      onFilterChange([filterId]);
    }
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
          const colorValue = filter.color;
          const isHex = typeof colorValue === 'string' && colorValue.startsWith('#');
          const bgClass = !isHex ? `bg-${colorValue}` : '';
          return (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter.id)}
              onContextMenu={(e) => {
                // Open edit form on right-click for custom categories (not 'all')
                if (filter.id !== 'all' && typeof onEditCategory === 'function') {
                  e.preventDefault();
                  const cat = categories.find(c => c.id === filter.id);
                  if (cat) onEditCategory(cat);
                }
              }}
              className={`
                px-4 py-2 rounded-lg font-bold text-sm border-3 border-black 
                transition-all relative
                ${bgClass} ${active ? 'shadow-brutal' : 'shadow-brutal-sm hover:shadow-brutal'}
              `}
              style={isHex ? { backgroundColor: colorValue } : undefined}
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
