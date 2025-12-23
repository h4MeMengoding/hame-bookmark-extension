import React, { useState } from 'react';
import { Save, X, Link as LinkIcon, FileText, Tag } from 'lucide-react';

const BookmarkForm = ({ onSubmit, onCancel, categories = [] }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !url.trim()) {
      return;
    }

    // Validasi URL
    try {
      new URL(url);
    } catch {
      alert('Please enter a valid URL');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(title.trim(), url.trim(), categoryId || null);
      setTitle('');
      setUrl('');
      setCategoryId('');
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border-4 border-black shadow-brutal fade-in">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-black text-black flex items-center gap-2">
          <Save className="w-6 h-6" strokeWidth={3} />
          Add New Bookmark
        </h3>
        <button
          onClick={onCancel}
          className="text-black hover:bg-neo-cream p-1 rounded-lg transition-colors"
        >
          <X className="w-6 h-6" strokeWidth={3} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-bold text-black mb-2">
            Title
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" strokeWidth={2.5} />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neo-green text-black font-semibold pl-12 pr-4 py-3 rounded-lg border-3 border-black focus:border-black transition-all"
              placeholder="My Awesome Website"
              required
              disabled={isSubmitting}
              maxLength={100}
            />
          </div>
        </div>

        {/* URL Input */}
        <div>
          <label className="block text-sm font-bold text-black mb-2">
            URL
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" strokeWidth={2.5} />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-neo-purple text-black font-semibold pl-12 pr-4 py-3 rounded-lg border-3 border-black focus:border-black transition-all"
              placeholder="https://example.com"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Category Selector */}
        {categories.length > 0 && (
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Category (Optional)
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" strokeWidth={2.5} />
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-neo-yellow text-black font-semibold pl-12 pr-4 py-3 rounded-lg border-3 border-black focus:border-black transition-all appearance-none cursor-pointer"
                disabled={isSubmitting}
              >
                <option value="">No Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
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
            {isSubmitting ? 'Saving...' : 'Save Bookmark'}
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

export default BookmarkForm;
