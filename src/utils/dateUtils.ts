import { Task } from '../types';

export const getTodayString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTomorrowString = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTaskDateTime = (dueDate?: string, dueTime?: string): Date | null => {
  if (!dueDate) return null;
  const timeStr = dueTime || '23:59:59';
  const [year, month, day] = dueDate.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  
  return new Date(year, month - 1, day, hours, minutes || 0);
};

export const isTaskOverdue = (task: Task): boolean => {
  if (task.completed || !task.dueDate) return false;
  
  const now = new Date();
  const taskDate = getTaskDateTime(task.dueDate, task.dueTime);
  if (!taskDate) return false;
  
  return taskDate < now;
};

export const isTaskToday = (task: Task): boolean => {
  if (!task.dueDate) return false;
  return task.dueDate === getTodayString();
};

export const isTaskUpcoming = (task: Task): boolean => {
  if (!task.dueDate || task.completed) return false;
  const today = getTodayString();
  return task.dueDate > today;
};

export const formatTime = (time24?: string): string => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  const minsPadded = String(minutes).padStart(2, '0');
  return `${hours12}:${minsPadded} ${period}`;
};

export const formatFriendlyDate = (dueDate?: string, dueTime?: string): string => {
  if (!dueDate) return 'No due date';
  
  const today = getTodayString();
  const tomorrow = getTomorrowString();
  const timeFormatted = dueTime ? ` at ${formatTime(dueTime)}` : '';
  
  if (dueDate === today) {
    return `Today${timeFormatted}`;
  }
  
  if (dueDate === tomorrow) {
    return `Tomorrow${timeFormatted}`;
  }
  
  // Format as short date like "Aug 15" or "Aug 15, 2026"
  const [year, month, day] = dueDate.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  
  const currentYear = new Date().getFullYear();
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    ...(year !== currentYear ? { year: 'numeric' } : {})
  };
  
  const formattedDate = dateObj.toLocaleDateString('en-US', options);
  return `${formattedDate}${timeFormatted}`;
};

export const getRelativeOverdueText = (dueDate?: string, dueTime?: string): string => {
  const taskDate = getTaskDateTime(dueDate, dueTime);
  if (!taskDate) return 'Overdue';
  
  const now = new Date();
  const diffMs = now.getTime() - taskDate.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays >= 1) {
    return `${diffDays}d overdue`;
  }
  if (diffHours >= 1) {
    return `${diffHours}h overdue`;
  }
  return 'Overdue just now';
};
