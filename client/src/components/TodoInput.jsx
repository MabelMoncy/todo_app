import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';

export default function TodoInput({ onAddTodo }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      await onAddTodo({
        title: title.trim(),
        description: description.trim(),
      });
      setTitle('');
      setDescription('');
      setShowDescription(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl backdrop-blur-sm"
    >
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?..."
            className="flex-1 bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 transition"
            maxLength={200}
            required
          />
          <button
            type="submit"
            disabled={!title.trim() || isSubmitting}
            className="flex items-center justify-center gap-1.5 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm sm:text-base rounded-xl transition shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>

        {/* Optional Description Toggle */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowDescription(!showDescription)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
          >
            {showDescription ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Hide description</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Add optional details / note</span>
              </>
            )}
          </button>
        </div>

        {showDescription && (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details, notes, or links (optional)..."
            rows={2}
            className="w-full bg-slate-800/60 border border-slate-700/70 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 transition"
          />
        )}
      </div>
    </form>
  );
}
