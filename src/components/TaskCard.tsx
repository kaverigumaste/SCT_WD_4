import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  Clock, 
  Calendar, 
  Tag, 
  Pin, 
  MoreVertical, 
  CheckSquare, 
  Square, 
  Trash2, 
  Edit3, 
  Copy, 
  ChevronDown, 
  ChevronUp,
  AlertTriangle
} from 'lucide-react';
import { Task, Category, Priority } from '../types';
import { isTaskOverdue, isTaskToday, formatFriendlyDate, getRelativeOverdueText } from '../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  categories: Category[];
  onToggleComplete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDuplicate: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string }> = {
  urgent: { label: 'Urgent', color: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900/60' },
  high: { label: 'High', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900/60' },
  medium: { label: 'Medium', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-900/60' },
  low: { label: 'Low', color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700' }
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  categories,
  onToggleComplete,
  onTogglePin,
  onDelete,
  onEdit,
  onDuplicate,
  onToggleSubtask
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);

  const category = categories.find((c) => c.id === task.categoryId) || categories[0];
  const overdue = isTaskOverdue(task);
  const dueToday = isTaskToday(task);
  
  const completedSubtasksCount = task.subtasks.filter((st) => st.completed).length;
  const hasSubtasks = task.subtasks.length > 0;

  const priorityStyle = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`group relative rounded-2xl border transition-all duration-200 ${
        task.completed
          ? 'bg-slate-50/80 border-slate-200/80 dark:bg-slate-900/40 dark:border-slate-800/60 opacity-75'
          : overdue
          ? 'bg-rose-50/30 border-rose-200/80 shadow-sm shadow-rose-100/50 dark:bg-rose-950/10 dark:border-rose-900/40'
          : task.pinned
          ? 'bg-white border-blue-200 shadow-md shadow-blue-500/5 dark:bg-slate-900 dark:border-blue-900/40'
          : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md dark:bg-slate-900 dark:border-slate-800/90 dark:hover:border-slate-700'
      }`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Completion Checkbox */}
          <button
            onClick={() => onToggleComplete(task.id)}
            className={`mt-0.5 relative flex items-center justify-center w-6 h-6 rounded-lg border-2 transition-all shrink-0 ${
              task.completed
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                : overdue
                ? 'border-rose-300 hover:border-rose-500 bg-white dark:bg-slate-900'
                : 'border-slate-300 hover:border-blue-500 bg-white dark:bg-slate-900 dark:border-slate-700'
            }`}
            title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {task.completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Check className="w-4 h-4 stroke-[3]" />
              </motion.div>
            )}
          </button>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Category Badge */}
                {category && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                    <span 
                      className="w-2 h-2 rounded-full shrink-0" 
                      style={{ backgroundColor: category.color || '#3b82f6' }}
                    />
                    {category.name}
                  </span>
                )}

                {/* Priority Badge */}
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${priorityStyle.bg} ${priorityStyle.color}`}>
                  {priorityStyle.label}
                </span>

                {/* Pinned Indicator */}
                {task.pinned && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/60">
                    <Pin className="w-3 h-3 fill-amber-500 stroke-amber-600" />
                    Pinned
                  </span>
                )}
              </div>

              {/* Action Menu Trigger & Pin Button */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onTogglePin(task.id)}
                  className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                    task.pinned ? 'text-amber-500' : 'opacity-0 group-hover:opacity-100'
                  }`}
                  title={task.pinned ? 'Unpin task' : 'Pin task to top'}
                >
                  <Pin className="w-4 h-4" />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {showMenu && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setShowMenu(false)} 
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -5 }}
                          className="absolute right-0 top-8 z-20 w-44 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1 text-sm text-slate-700 dark:text-slate-200"
                        >
                          <button
                            onClick={() => {
                              onEdit(task);
                              setShowMenu(false);
                            }}
                            className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2"
                          >
                            <Edit3 className="w-4 h-4 text-blue-500" />
                            Edit Task
                          </button>
                          <button
                            onClick={() => {
                              onDuplicate(task);
                              setShowMenu(false);
                            }}
                            className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2"
                          >
                            <Copy className="w-4 h-4 text-purple-500" />
                            Duplicate
                          </button>
                          <div className="my-1 border-t border-slate-200 dark:border-slate-700" />
                          <button
                            onClick={() => {
                              onDelete(task.id);
                              setShowMenu(false);
                            }}
                            className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-600 dark:hover:bg-rose-950/40 dark:text-rose-400 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Task Title */}
            <h3 className={`text-base font-semibold leading-snug transition-colors ${
              task.completed 
                ? 'line-through text-slate-400 dark:text-slate-500' 
                : 'text-slate-800 dark:text-slate-100'
            }`}>
              {task.title}
            </h3>

            {/* Description */}
            {task.description && (
              <p className={`text-xs sm:text-sm mt-1 line-clamp-2 ${
                task.completed ? 'text-slate-400 dark:text-slate-600' : 'text-slate-600 dark:text-slate-300'
              }`}>
                {task.description}
              </p>
            )}

            {/* Bottom Details Row: Dates, Tags, Subtasks Toggle */}
            <div className="flex items-center justify-between gap-3 flex-wrap mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                {/* Due Date Badge */}
                {task.dueDate && (
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium border ${
                    task.completed
                      ? 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                      : overdue
                      ? 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900/60 font-semibold'
                      : dueToday
                      ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900/50'
                      : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700'
                  }`}>
                    {overdue ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    ) : (
                      <Calendar className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {overdue
                        ? getRelativeOverdueText(task.dueDate, task.dueTime)
                        : formatFriendlyDate(task.dueDate, task.dueTime)}
                    </span>
                  </span>
                )}

                {/* Subtasks Count Badge */}
                {hasSubtasks && (
                  <button
                    onClick={() => setShowSubtasks(!showSubtasks)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 font-medium"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-blue-500" />
                    <span>
                      {completedSubtasksCount}/{task.subtasks.length} subtasks
                    </span>
                    {showSubtasks ? (
                      <ChevronUp className="w-3 h-3 ml-0.5" />
                    ) : (
                      <ChevronDown className="w-3 h-3 ml-0.5" />
                    )}
                  </button>
                )}

                {/* Tags */}
                {task.tags && task.tags.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap">
                    {task.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Expandable Subtask List */}
            <AnimatePresence>
              {showSubtasks && hasSubtasks && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-1.5 overflow-hidden"
                >
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Checklist:
                  </p>
                  {task.subtasks.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => onToggleSubtask(task.id, st.id)}
                      className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <button className="text-slate-400 hover:text-emerald-500 shrink-0">
                        {st.completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                      <span className={st.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                        {st.title}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
