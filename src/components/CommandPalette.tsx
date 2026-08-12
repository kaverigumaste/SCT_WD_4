import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Plus, 
  ListTodo, 
  FolderPlus, 
  LayoutList, 
  Kanban, 
  CalendarDays, 
  BarChart3, 
  AlertTriangle, 
  Download, 
  RotateCcw,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { Task, Category, ViewMode, StatusFilter } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  categories: Category[];
  onOpenNewTask: () => void;
  onOpenAddCategory: () => void;
  onSelectViewMode: (view: ViewMode) => void;
  onSelectStatusFilter: (status: StatusFilter) => void;
  onSelectCategoryFilter: (catId: string) => void;
  onExport: () => void;
  onResetDemo: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  tasks,
  categories,
  onOpenNewTask,
  onOpenAddCategory,
  onSelectViewMode,
  onSelectStatusFilter,
  onSelectCategoryFilter,
  onExport,
  onResetDemo,
  theme,
  onToggleTheme
}) => {
  const [query, setQuery] = useState('');

  // Listen for Cmd+K or Ctrl+K globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTasks = query
    ? tasks.filter((t) => t.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  const filteredCategories = query
    ? categories.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="relative w-full max-w-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 overflow-hidden"
        >
          {/* Search Input Bar */}
          <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-800 py-3">
            <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search tasks..."
              autoFocus
              className="w-full bg-transparent text-sm text-slate-800 dark:text-white focus:outline-none placeholder-slate-400 dark:placeholder-slate-500 font-medium"
            />
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body List */}
          <div className="p-3 max-h-96 overflow-y-auto space-y-3 custom-scrollbar text-xs">
            {/* Quick Actions */}
            <div>
              <p className="px-3 py-1 font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">
                Quick Actions
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    onOpenNewTask();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Plus className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    <span>Create New Task</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">Action</span>
                </button>

                <button
                  onClick={() => {
                    onOpenAddCategory();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <FolderPlus className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                    <span>Add Custom List</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">Action</span>
                </button>

                {onToggleTheme && (
                  <button
                    onClick={() => {
                      onToggleTheme();
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      {theme === 'dark' ? (
                        <Sun className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                      ) : (
                        <Moon className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                      )}
                      <span>Switch to {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
                    </div>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">Theme</span>
                  </button>
                )}
              </div>
            </div>

            {/* Navigation / Views */}
            <div>
              <p className="px-3 py-1 font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">
                Switch Views
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    onSelectViewMode('list');
                    onClose();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors text-left"
                >
                  <LayoutList className="w-4 h-4 text-slate-400" />
                  <span>List View</span>
                </button>

                <button
                  onClick={() => {
                    onSelectViewMode('board');
                    onClose();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors text-left"
                >
                  <Kanban className="w-4 h-4 text-slate-400" />
                  <span>Kanban Board View</span>
                </button>

                <button
                  onClick={() => {
                    onSelectViewMode('calendar');
                    onClose();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors text-left"
                >
                  <CalendarDays className="w-4 h-4 text-slate-400" />
                  <span>Calendar View</span>
                </button>

                <button
                  onClick={() => {
                    onSelectViewMode('dashboard');
                    onClose();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors text-left"
                >
                  <BarChart3 className="w-4 h-4 text-slate-400" />
                  <span>Analytics Dashboard</span>
                </button>
              </div>
            </div>

            {/* Matching Tasks if searching */}
            {query && (
              <div>
                <p className="px-3 py-1 font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">
                  Matching Tasks ({filteredTasks.length})
                </p>
                {filteredTasks.length === 0 ? (
                  <p className="px-3 py-2 text-slate-400 dark:text-slate-500">No matching tasks found.</p>
                ) : (
                  <div className="space-y-1">
                    {filteredTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          onSelectStatusFilter('all');
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <span className="font-medium text-slate-800 dark:text-slate-200">{t.title}</span>
                        <span className="text-[10px] text-slate-400 uppercase">{t.priority}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
