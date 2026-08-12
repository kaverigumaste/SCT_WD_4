import React from 'react';
import { 
  Search, 
  Plus, 
  Command, 
  Menu, 
  SlidersHorizontal, 
  ArrowUpDown, 
  X,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { FilterState, Priority, Category } from '../types';

interface HeaderProps {
  filter: FilterState;
  onUpdateFilter: (updates: Partial<FilterState>) => void;
  onOpenNewTask: () => void;
  onOpenCommandPalette: () => void;
  onOpenMobileMenu: () => void;
  categories: Category[];
  activeCategoryName: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  filter,
  onUpdateFilter,
  onOpenNewTask,
  onOpenCommandPalette,
  onOpenMobileMenu,
  categories,
  activeCategoryName,
  theme,
  onToggleTheme
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-8 py-3.5 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Left Side: Title & Mobile Drawer Trigger */}
        <div className="flex items-center justify-between md:justify-start gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {activeCategoryName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            {/* Quick Theme Switcher Button Mobile */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Quick Add Button Mobile */}
            <button
              onClick={onOpenNewTask}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
              title="Create Task"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Side Controls: Search, Sort, Filters, Theme Switcher, New Task */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64 min-w-[180px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={filter.searchQuery}
              onChange={(e) => onUpdateFilter({ searchQuery: e.target.value })}
              placeholder="Search tasks..."
              className="w-full pl-9 pr-8 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-900 transition-all"
            />
            {filter.searchQuery && (
              <button
                onClick={() => onUpdateFilter({ searchQuery: '' })}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Priority Filter Dropdown */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <select
              value={filter.priority}
              onChange={(e) => onUpdateFilter({ priority: e.target.value as Priority | 'all' })}
              className="bg-transparent text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer pr-1 py-0.5 text-xs font-semibold"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <select
              value={filter.sortBy}
              onChange={(e) =>
                onUpdateFilter({
                  sortBy: e.target.value as 'dueDate' | 'priority' | 'createdAt' | 'title'
                })
              }
              className="bg-transparent text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer pr-1 py-0.5 text-xs font-semibold"
            >
              <option value="dueDate">Sort: Due Date</option>
              <option value="priority">Sort: Priority</option>
              <option value="createdAt">Sort: Created</option>
              <option value="title">Sort: Title</option>
            </select>

            <button
              onClick={() =>
                onUpdateFilter({
                  sortOrder: filter.sortOrder === 'asc' ? 'desc' : 'asc'
                })
              }
              className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors"
              title="Toggle sort direction"
            >
              {filter.sortOrder.toUpperCase()}
            </button>
          </div>

          {/* Theme Toggle Button (Desktop) */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-amber-300 transition-all duration-200 shadow-xs flex items-center justify-center relative group"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 transition-transform duration-300 group-hover:-rotate-12" />
            )}
          </button>

          {/* Command Palette Hotkey Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Open Command Palette (Cmd+K)"
          >
            <Command className="w-3.5 h-3.5" />
            <span>Cmd+K</span>
          </button>

          {/* Primary "+ New Task" Button */}
          <button
            onClick={onOpenNewTask}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};
