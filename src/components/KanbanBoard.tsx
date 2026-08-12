import React from 'react';
import { motion } from 'motion/react';
import { TaskCard } from './TaskCard';
import { Task, Category } from '../types';
import { isTaskOverdue } from '../utils/dateUtils';
import { ListTodo, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  categories: Category[];
  onToggleComplete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDuplicate: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  categories,
  onToggleComplete,
  onTogglePin,
  onDelete,
  onEdit,
  onDuplicate,
  onToggleSubtask
}) => {
  // Columns
  const overdueTasks = tasks.filter((t) => !t.completed && isTaskOverdue(t));
  const activeTasks = tasks.filter((t) => !t.completed && !isTaskOverdue(t));
  
  // Distribute active into "To Do" and "In Progress" (tasks with subtasks or urgent/high priority)
  const inProgressTasks = activeTasks.filter(
    (t) => (t.subtasks && t.subtasks.length > 0) || t.priority === 'urgent' || t.priority === 'high'
  );
  const todoTasks = activeTasks.filter(
    (t) => !((t.subtasks && t.subtasks.length > 0) || t.priority === 'urgent' || t.priority === 'high')
  );
  
  const completedTasks = tasks.filter((t) => t.completed);

  const columns = [
    {
      id: 'overdue',
      title: 'Overdue',
      icon: <AlertTriangle className="w-4 h-4 text-rose-500" />,
      color: 'border-rose-500/30 bg-rose-50/20 dark:bg-rose-950/10',
      badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900',
      items: overdueTasks
    },
    {
      id: 'todo',
      title: 'To Do',
      icon: <ListTodo className="w-4 h-4 text-blue-500" />,
      color: 'border-blue-500/30 bg-blue-50/10 dark:bg-slate-900/40',
      badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900',
      items: todoTasks
    },
    {
      id: 'in_progress',
      title: 'In Progress / Focused',
      icon: <Clock className="w-4 h-4 text-amber-500" />,
      color: 'border-amber-500/30 bg-amber-50/10 dark:bg-slate-900/40',
      badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900',
      items: inProgressTasks
    },
    {
      id: 'completed',
      title: 'Completed',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      color: 'border-emerald-500/30 bg-emerald-50/10 dark:bg-slate-900/40',
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
      items: completedTasks
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start max-w-7xl mx-auto overflow-x-auto pb-6">
      {columns.map((col) => (
        <div
          key={col.id}
          className={`rounded-2xl border ${col.color} p-4 space-y-3 min-w-[280px]`}
        >
          {/* Column Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center gap-2">
              {col.icon}
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">{col.title}</h3>
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${col.badge}`}>
              {col.items.length}
            </span>
          </div>

          {/* Column Items */}
          <div className="space-y-3 min-h-[120px]">
            {col.items.length === 0 ? (
              <div className="py-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <p className="text-xs text-slate-400 font-medium">No tasks in {col.title.toLowerCase()}</p>
              </div>
            ) : (
              col.items.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  categories={categories}
                  onToggleComplete={onToggleComplete}
                  onTogglePin={onTogglePin}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onDuplicate={onDuplicate}
                  onToggleSubtask={onToggleSubtask}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
