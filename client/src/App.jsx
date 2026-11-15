import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import TodoInput from './components/TodoInput';
import TodoItem from './components/TodoItem';
import EditModal from './components/EditModal';
import { getTodos, createTodo, updateTodo, deleteTodo } from './services/api';
import { Search, ListFilter, AlertCircle, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getTodos();
      if (res && res.success) {
        setTodos(res.data);
      } else {
        setTodos([]);
      }
    } catch (err) {
      console.error('Failed to fetch todos:', err);
      setError(err.response?.data?.message || 'Could not connect to backend. Please check MongoDB configuration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async ({ title, description }) => {
    try {
      const res = await createTodo({ title, description });
      if (res && res.success) {
        setTodos((prev) => [res.data, ...prev]);
        showToast('Task added successfully!');
      }
    } catch (err) {
      console.error('Failed to create todo:', err);
      showToast(err.response?.data?.message || 'Failed to add task', 'error');
    }
  };

  const handleToggleComplete = async (todo) => {
    try {
      const updatedStatus = !todo.completed;
      // Optimistic update
      setTodos((prev) =>
        prev.map((t) => (t._id === todo._id ? { ...t, completed: updatedStatus } : t))
      );

      const res = await updateTodo(todo._id, { completed: updatedStatus });
      if (!res || !res.success) {
        // Rollback on failure
        fetchTodos();
      }
    } catch (err) {
      console.error('Failed to toggle completion:', err);
      fetchTodos();
      showToast('Could not update task status', 'error');
    }
  };

  const handleSaveEdit = async (id, updatedData) => {
    try {
      const res = await updateTodo(id, updatedData);
      if (res && res.success) {
        setTodos((prev) => prev.map((t) => (t._id === id ? res.data : t)));
        showToast('Task updated successfully!');
      } else {
        throw new Error(res?.message || 'Failed to update task');
      }
    } catch (err) {
      console.error('Failed to update todo:', err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to update task';
      showToast(errMsg, 'error');
      throw err;
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const res = await deleteTodo(id);
      if (res && res.success) {
        setTodos((prev) => prev.filter((t) => t._id !== id));
        showToast('Task deleted successfully');
      }
    } catch (err) {
      console.error('Failed to delete todo:', err);
      showToast('Failed to delete task', 'error');
    }
  };

  // Filter & Search logic
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesFilter =
        filter === 'all'
          ? true
          : filter === 'active'
          ? !todo.completed
          : todo.completed;

      const matchesSearch =
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesFilter && matchesSearch;
    });
  }, [todos, filter, searchQuery]);

  const completedCount = useMemo(
    () => todos.filter((t) => t.completed).length,
    [todos]
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-sm transition-all duration-300 animate-bounce ${
            toast.type === 'error'
              ? 'bg-rose-950/90 border-rose-800 text-rose-200'
              : 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Header totalCount={todos.length} completedCount={completedCount} />

        {/* Input Form */}
        <TodoInput onAddTodo={handleAddTodo} />

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
            {['all', 'active', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition ${
                  filter === f
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Backend Connection Notice</p>
              <p className="text-xs text-rose-300/80 mt-1">{error}</p>
              <button
                onClick={fetchTodos}
                className="mt-2 text-xs underline text-rose-300 hover:text-white"
              >
                Retry connection
              </button>
            </div>
          </div>
        )}

        {/* Todo List */}
        <div className="space-y-2.5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="text-sm">Loading your tasks...</p>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-300">
                {searchQuery
                  ? 'No matching tasks found'
                  : filter === 'completed'
                  ? 'No completed tasks yet'
                  : filter === 'active'
                  ? 'No active tasks to do!'
                  : 'No tasks yet'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                {searchQuery
                  ? 'Try searching with different keywords.'
                  : 'Add your first task above to get organized and stay productive.'}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggleComplete={handleToggleComplete}
                onEdit={setEditingTodo}
                onDelete={handleDeleteTodo}
              />
            ))
          )}
        </div>

        {/* Edit Modal */}
        <EditModal
          todo={editingTodo}
          isOpen={Boolean(editingTodo)}
          onClose={() => setEditingTodo(null)}
          onSave={handleSaveEdit}
        />

        {/* Footer */}
        <footer className="mt-14 pt-6 border-t border-slate-850 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Final MERN Stack Assignment</span>
          <div className="flex items-center gap-4">
            <a
              href="/name"
              className="text-indigo-400 hover:text-indigo-300 transition underline underline-offset-4"
            >
              Verify /name Endpoint
            </a>
            <span>•</span>
            <span>Developer: Mabel Anto Moncy</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

