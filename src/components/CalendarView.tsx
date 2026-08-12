import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Task, Category } from '../types';
import { TaskCard } from './TaskCard';

interface CalendarViewProps {
  tasks: Task[];
  categories: Category[];
  onToggleComplete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDuplicate: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onOpenNewTaskForDate: (dateStr: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  categories,
  onToggleComplete,
  onTogglePin,
  onDelete,
  onEdit,
  onDuplicate,
  onToggleSubtask,
  onOpenNewTaskForDate
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of month
  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Build grid days
  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    calendarDays.push({ day, dateStr });
  }

  // Today string
  const todayObj = new Date();
  const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;

  // Filtered tasks for selected date or showing day breakdown
  const tasksByDate: Record<string, Task[]> = {};
  tasks.forEach((t) => {
    if (t.dueDate) {
      if (!tasksByDate[t.dueDate]) tasksByDate[t.dueDate] = [];
      tasksByDate[t.dueDate].push(t);
    }
  });

  const selectedDateTasks = selectedDateStr ? tasksByDate[selectedDateStr] || [] : [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Calendar Header Controls */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {monthNames[month]} {year}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            Today
          </button>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((item, idx) => {
            if (!item) {
              return <div key={`empty-${idx}`} className="h-24 sm:h-28 rounded-xl bg-slate-50/40 dark:bg-slate-800/20" />;
            }

            const dayTasks = tasksByDate[item.dateStr] || [];
            const isToday = item.dateStr === todayStr;
            const isSelected = item.dateStr === selectedDateStr;

            return (
              <div
                key={item.dateStr}
                onClick={() => setSelectedDateStr(item.dateStr)}
                className={`group relative h-24 sm:h-28 p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-50/20 dark:bg-blue-950/20'
                    : isToday
                    ? 'border-amber-400 bg-amber-50/20 dark:bg-amber-950/20'
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                    isToday
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {item.day}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenNewTaskForDate(item.dateStr);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-blue-500 transition-opacity"
                    title="Add task for this date"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Task Indicators */}
                <div className="space-y-1 overflow-hidden mt-1">
                  {dayTasks.slice(0, 2).map((t) => {
                    const category = categories.find((c) => c.id === t.categoryId);
                    return (
                      <div
                        key={t.id}
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded truncate flex items-center gap-1 ${
                          t.completed
                            ? 'line-through bg-slate-100 dark:bg-slate-800 text-slate-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: category?.color || '#3b82f6' }}
                        />
                        <span className="truncate">{t.title}</span>
                      </div>
                    );
                  })}
                  {dayTasks.length > 2 && (
                    <p className="text-[10px] font-bold text-blue-500 dark:text-blue-400 pl-1">
                      +{dayTasks.length - 2} more
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Detail Drawer */}
      {selectedDateStr && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
              Tasks scheduled for {selectedDateStr} ({selectedDateTasks.length})
            </h3>
            <button
              onClick={() => onOpenNewTaskForDate(selectedDateStr)}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Task for Date
            </button>
          </div>

          {selectedDateTasks.length === 0 ? (
            <p className="text-sm text-slate-400">No tasks scheduled for this date.</p>
          ) : (
            <div className="space-y-3">
              {selectedDateTasks.map((task) => (
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
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
