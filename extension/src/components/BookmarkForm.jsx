import React, { useState } from 'react';
import { Save, X, Link as LinkIcon, FileText, Tag, Sparkles } from 'lucide-react';

const BookmarkForm = ({ onSubmit, onCancel, categories = [] }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Auto-generate title from URL
  const handleGenerateTitle = async () => {
    if (!url.trim()) {
      alert('Please enter a URL first');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(url);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const pageTitle = doc.querySelector('title')?.textContent || '';
      
      if (pageTitle) {
        setTitle(pageTitle.trim());
      } else {
        // Fallback: generate from hostname
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.replace('www.', '');
        setTitle(hostname.charAt(0).toUpperCase() + hostname.slice(1));
      }
    } catch (error) {
      // Fallback: generate from hostname
      try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.replace('www.', '');
        setTitle(hostname.charAt(0).toUpperCase() + hostname.slice(1));
      } catch {
        alert('Please enter a valid URL');
      }
    } finally {
      setIsGenerating(false);
    }
  };

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
        {/* URL Input - SEKARANG DI ATAS */}
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

        {/* Title Input - SEKARANG DI BAWAH */}
        <div>
          <label className="block text-sm font-bold text-black mb-2">
            Title
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
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
            <button
              type="button"
              onClick={handleGenerateTitle}
              disabled={isGenerating || isSubmitting || !url.trim()}
              className="bg-neo-yellow text-black font-black px-4 py-3 rounded-lg border-3 border-black shadow-brutal hover:shadow-brutal-sm active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              title="Auto-generate title from URL"
            >
              <Sparkles className="w-5 h-5" strokeWidth={3} />
              {isGenerating ? '...' : 'Auto'}
            </button>
          </div>
        </div>

        {/* Category Selector */}
        <div>
          <label className="block text-sm font-bold text-black mb-2">
            Category {categories.length === 0 && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" strokeWidth={2.5} />
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-neo-yellow text-black font-semibold pl-12 pr-4 py-3 rounded-lg border-3 border-black focus:border-black transition-all appearance-none cursor-pointer"
              disabled={isSubmitting}
              required={categories.length === 0}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          {categories.length === 0 && (
            <p className="text-xs text-red-600 font-semibold mt-1">
              Please select a category for your first bookmark
            </p>
          )}
        </div>

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
