import React from 'react';
import { Check, Edit3, Trash2, Calendar } from 'lucide-react';

export default function TodoItem({ todo, onToggleComplete, onEdit, onDelete }) {
  const formattedDate = new Date(todo.createdAt || Date.now()).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`group relative flex items-start gap-3.5 p-4 rounded-xl border transition-all duration-200 ${
        todo.completed
          ? 'bg-slate-900/40 border-slate-800/80 opacity-75'
          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-sm'
      }`}
    >
      {/* Complete Toggle Checkbox */}
      <button
        onClick={() => onToggleComplete(todo)}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
          todo.completed
            ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/30'
            : 'border-slate-600 hover:border-indigo-400 bg-slate-850'
        }`}
      >
        {todo.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </button>

      {/* Todo Content */}
      <div className="flex-1 min-w-0">
        <h3
          className={`text-sm sm:text-base font-medium break-words transition-all ${
            todo.completed ? 'line-through text-slate-500' : 'text-slate-100'
          }`}
        >
          {todo.title}
        </h3>

        {todo.description && (
          <p
            className={`text-xs sm:text-sm mt-1 whitespace-pre-line break-words ${
              todo.completed ? 'text-slate-600 line-through' : 'text-slate-400'
            }`}
          >
            {todo.description}
          </p>
        )}

        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500">
          <Calendar className="w-3 h-3 text-slate-600" />
          <span>{formattedDate}</span>
          {todo.completed && (
            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Completed
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(todo)}
          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition"
          title="Edit todo"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(todo._id)}
          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
          title="Delete todo"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
