import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ListTodo, 
  TrendingUp, 
  BarChart, 
  PieChart, 
  Layers,
  Sparkles,
  Flame
} from 'lucide-react';
import { Task, Category, TaskStats } from '../types';
import { isTaskOverdue, isTaskToday } from '../utils/dateUtils';

interface DashboardViewProps {
  tasks: Task[];
  categories: Category[];
  onSelectStatusFilter: (status: 'all' | 'active' | 'completed' | 'overdue' | 'today') => void;
  onSelectCategoryFilter: (catId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  categories,
  onSelectStatusFilter,
  onSelectCategoryFilter
}) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = tasks.filter((t) => !t.completed).length;
  const overdue = tasks.filter((t) => isTaskOverdue(t)).length;
  const dueToday = tasks.filter((t) => !t.completed && isTaskToday(t)).length;
  
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Priority counts
  const urgentCount = tasks.filter((t) => !t.completed && t.priority === 'urgent').length;
  const highCount = tasks.filter((t) => !t.completed && t.priority === 'high').length;
  const mediumCount = tasks.filter((t) => !t.completed && t.priority === 'medium').length;
  const lowCount = tasks.filter((t) => !t.completed && t.priority === 'low').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-blue-500/10 relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-md mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              TaskFlow Analytics
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Productivity Dashboard</h2>
            <p className="text-blue-100 text-sm mt-1 max-w-lg">
              {completionRate >= 80
                ? 'Outstanding work! You are crushing your goals today.'
                : overdue > 0
                ? `You have ${overdue} overdue task${overdue > 1 ? 's' : ''} that require your immediate focus.`
                : `You have ${active} active task${active !== 1 ? 's' : ''} on your schedule.`}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15">
            <div className="text-center">
              <p className="text-3xl font-black text-white">{completionRate}%</p>
              <p className="text-[11px] font-medium text-blue-100 uppercase tracking-wider">Completion</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-black text-amber-300">{dueToday}</p>
              <p className="text-[11px] font-medium text-blue-100 uppercase tracking-wider">Due Today</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <button
          onClick={() => onSelectStatusFilter('all')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Tasks</span>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <ListTodo className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">{active}</p>
          <p className="text-xs text-slate-500 mt-1">{total} total tasks created</p>
        </button>

        {/* Completed */}
        <button
          onClick={() => onSelectStatusFilter('completed')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">{completed}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">{completionRate}% total progress</p>
        </button>

        {/* Due Today */}
        <button
          onClick={() => onSelectStatusFilter('today')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Today</span>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">{dueToday}</p>
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">Requires focus today</p>
        </button>

        {/* Overdue Alert */}
        <button
          onClick={() => onSelectStatusFilter('overdue')}
          className={`p-5 rounded-2xl border shadow-sm hover:shadow-md transition-all text-left group ${
            overdue > 0
              ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overdue</span>
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className={`text-3xl font-bold mt-2 ${overdue > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-100'}`}>
            {overdue}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {overdue > 0 ? 'Action required!' : 'All clear! Zero overdue tasks.'}
          </p>
        </button>
      </div>

      {/* Grid: Categories Breakdown & Priority Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories Progress */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-500" />
              Tasks by Category / List
            </h3>
            <span className="text-xs text-slate-500 font-medium">{categories.length} lists</span>
          </div>

          <div className="space-y-4">
            {categories.map((cat) => {
              const catTasks = tasks.filter((t) => t.categoryId === cat.id);
              const catCompleted = catTasks.filter((t) => t.completed).length;
              const catTotal = catTasks.length;
              const pct = catTotal > 0 ? Math.round((catCompleted / catTotal) * 100) : 0;

              return (
                <div
                  key={cat.id}
                  onClick={() => onSelectCategoryFilter(cat.id)}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: cat.color || '#3b82f6' }}
                      />
                      <span className="text-slate-800 dark:text-slate-200">{cat.name}</span>
                    </div>
                    <span className="text-slate-500">
                      {catCompleted}/{catTotal} completed ({pct}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: cat.color || '#3b82f6'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              Active Priority Breakdown
            </h3>
            <span className="text-xs text-slate-500 font-medium">{active} pending tasks</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Urgent */}
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50">
              <span className="text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider">Urgent</span>
              <p className="text-2xl font-bold text-rose-800 dark:text-rose-300 mt-1">{urgentCount}</p>
              <p className="text-[11px] text-rose-600/80 dark:text-rose-400/80 mt-0.5">Critical priority</p>
            </div>

            {/* High */}
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">High</span>
              <p className="text-2xl font-bold text-amber-800 dark:text-amber-300 mt-1">{highCount}</p>
              <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-0.5">High importance</p>
            </div>

            {/* Medium */}
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50">
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Medium</span>
              <p className="text-2xl font-bold text-blue-800 dark:text-blue-300 mt-1">{mediumCount}</p>
              <p className="text-[11px] text-blue-600/80 dark:text-blue-400/80 mt-0.5">Standard workflow</p>
            </div>

            {/* Low */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Low</span>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-1">{lowCount}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Flexible schedule</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
