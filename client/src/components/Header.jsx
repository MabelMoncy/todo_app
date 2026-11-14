import React from 'react';
import { CheckSquare, ExternalLink, User } from 'lucide-react';

export default function Header({ totalCount, completedCount }) {
  const pendingCount = totalCount - completedCount;
  const rawBaseUrl = import.meta.env.VITE_API_URL || '';
  const nameUrl = rawBaseUrl ? `${rawBaseUrl.replace(/\/+$/, '')}/name` : '/name';

  return (
    <header className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl shadow-lg shadow-indigo-500/20">
            <CheckSquare className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Task<span className="text-indigo-400">Flow</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Full-Stack MERN Todo Application
            </p>
          </div>
        </div>

        {/* Developer Info Badge with direct link to /name */}
        <div className="flex items-center gap-2">
          <a
            href={nameUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-850 hover:border-indigo-500/50 border border-slate-700/60 rounded-xl transition duration-200 text-xs sm:text-sm text-slate-300 shadow-sm"
            title="Open /name endpoint to verify developer identity"
          >
            <div className="w-6 h-6 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
              <User className="w-3.5 h-3.5" />
            </div>
            <span>
              Developer: <strong className="text-indigo-300 font-semibold">Mabel Anto Moncy</strong>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
          </a>
        </div>
      </div>

      {/* Quick Stats bar */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center">
          <span className="text-xs font-medium text-slate-400">Total</span>
          <p className="text-xl font-bold text-white mt-0.5">{totalCount}</p>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center">
          <span className="text-xs font-medium text-amber-400">Pending</span>
          <p className="text-xl font-bold text-amber-300 mt-0.5">{pendingCount}</p>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center">
          <span className="text-xs font-medium text-emerald-400">Completed</span>
          <p className="text-xl font-bold text-emerald-300 mt-0.5">{completedCount}</p>
        </div>
      </div>
    </header>
  );
}
