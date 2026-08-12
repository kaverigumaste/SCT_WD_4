import React from 'react';
import { 
  Inbox, 
  Sun, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  ListTodo, 
  FolderPlus, 
  Briefcase, 
  User, 
  ShoppingCart, 
  HeartPulse, 
  Folder,
  LayoutList,
  Kanban,
  CalendarDays,
  BarChart3,
  Download,
  RotateCcw,
  X,
  Sparkles
} from 'lucide-react';
import { Task, Category, StatusFilter, ViewMode } from '../types';
import { isTaskOverdue, isTaskToday, isTaskUpcoming } from '../utils/dateUtils';

interface SidebarProps {
  tasks: Task[];
  categories: Category[];
  activeStatus: StatusFilter;
  activeCategory: string;
  viewMode: ViewMode;
  onSelectStatus: (status: StatusFilter) => void;
  onSelectCategory: (catId: string) => void;
  onSelectViewMode: (view: ViewMode) => void;
  onOpenAddCategory: () => void;
  onExport: () => void;
  onResetDemo: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  Inbox: <Inbox className="w-4 h-4" />,
  Briefcase: <Briefcase className="w-4 h-4" />,
  User: <User className="w-4 h-4" />,
  ShoppingCart: <ShoppingCart className="w-4 h-4" />,
  HeartPulse: <HeartPulse className="w-4 h-4" />,
  Folder: <Folder className="w-4 h-4" />
};

export const Sidebar: React.FC<SidebarProps> = ({
  tasks,
  categories,
  activeStatus,
  activeCategory,
  viewMode,
  onSelectStatus,
  onSelectCategory,
  onSelectViewMode,
  onOpenAddCategory,
  onExport,
  onResetDemo,
  isOpenMobile,
  onCloseMobile
}) => {
  // Counts
  const totalTasks = tasks.length;
  const activeTasksCount = tasks.filter((t) => !t.completed).length;
  const overdueCount = tasks.filter((t) => isTaskOverdue(t)).length;
  const todayCount = tasks.filter((t) => !t.completed && isTaskToday(t)).length;
  const upcomingCount = tasks.filter((t) => !t.completed && isTaskUpcoming(t)).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const getCategoryTaskCount = (catId: string) => {
    return tasks.filter((t) => t.categoryId === catId && !t.completed).length;
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 w-64 border-r border-slate-200 dark:border-slate-800 p-4 select-none transition-colors">
      {/* Brand Logo & Title */}
      <div className="flex items-center justify-between pb-4 mb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-black text-lg">
            ✓
          </div>
          <div>
            <h1 className="font-bold text-base text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
              TaskFlow
              <span className="text-[10px] uppercase tracking-wider bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold px-1.5 py-0.5 rounded-md border border-blue-500/20 dark:border-blue-500/30">
                PRO
              </span>
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Smart Task Manager</p>
          </div>
        </div>

        {/* Mobile close button */}
        {isOpenMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
        {/* View Mode Switcher Tabs */}
        <div>
          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-2">
            View Layout
          </p>
          <div className="space-y-1">
            <button
              onClick={() => onSelectViewMode('list')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <LayoutList className="w-4 h-4" />
              <span>List View</span>
            </button>

            <button
              onClick={() => onSelectViewMode('board')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'board'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Kanban Board</span>
            </button>

            <button
              onClick={() => onSelectViewMode('calendar')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'calendar'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Calendar</span>
            </button>

            <button
              onClick={() => onSelectViewMode('dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics Dashboard</span>
            </button>
          </div>
        </div>

        {/* Quick Filters / Smart Views */}
        <div>
          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-2">
            Smart Filters
          </p>
          <div className="space-y-0.5">
            {/* All Tasks */}
            <button
              onClick={() => {
                onSelectStatus('all');
                onSelectCategory('all');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeStatus === 'all' && activeCategory === 'all'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ListTodo className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>All Tasks</span>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {activeTasksCount}
              </span>
            </button>

            {/* Today */}
            <button
              onClick={() => {
                onSelectStatus('today');
                onSelectCategory('all');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeStatus === 'today'
                  ? 'bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sun className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>Today</span>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {todayCount}
              </span>
            </button>

            {/* Upcoming */}
            <button
              onClick={() => {
                onSelectStatus('upcoming');
                onSelectCategory('all');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeStatus === 'upcoming'
                  ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <span>Upcoming</span>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                {upcomingCount}
              </span>
            </button>

            {/* Overdue */}
            <button
              onClick={() => {
                onSelectStatus('overdue');
                onSelectCategory('all');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeStatus === 'overdue'
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold border border-rose-200 dark:border-rose-900/50'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Overdue</span>
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                overdueCount > 0 ? 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 dark:border-rose-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}>
                {overdueCount}
              </span>
            </button>

            {/* Completed */}
            <button
              onClick={() => {
                onSelectStatus('completed');
                onSelectCategory('all');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeStatus === 'completed'
                  ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span>Completed</span>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {completedCount}
              </span>
            </button>
          </div>
        </div>

        {/* Categories / Lists Section */}
        <div>
          <div className="flex items-center justify-between mb-2 px-2">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              My Lists
            </p>
            <button
              onClick={onOpenAddCategory}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Add Custom List"
            >
              <FolderPlus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-0.5">
            {categories.map((cat) => {
              const count = getCategoryTaskCount(cat.id);
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    onSelectStatus('all');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color || '#3b82f6' }}
                    />
                    <span className="truncate">{cat.name}</span>
                  </div>
                  {count > 0 && (
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-800/80">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Controls: Export & Reset */}
      <div className="pt-4 mt-auto border-t border-slate-200 dark:border-slate-800 space-y-1.5">
        <button
          onClick={onExport}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
          <span>Export Backup (JSON)</span>
        </button>

        <button
          onClick={onResetDemo}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          <span>Reset Sample Tasks</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 shrink-0">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 h-full">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
