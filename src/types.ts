export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: string; // ISO string
  createdAt: string; // ISO string
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: Priority;
  categoryId: string;
  tags: string[];
  subtasks: Subtask[];
  pinned: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string; // TailWind color key or Hex
  icon: string; // Lucide icon name
  isSystem?: boolean;
}

export type StatusFilter = 'all' | 'active' | 'completed' | 'overdue' | 'today' | 'upcoming';

export interface FilterState {
  status: StatusFilter;
  categoryId: string | 'all';
  priority: Priority | 'all';
  searchQuery: string;
  tag: string | null;
  sortBy: 'dueDate' | 'priority' | 'createdAt' | 'title';
  sortOrder: 'asc' | 'desc';
}

export type ViewMode = 'list' | 'board' | 'calendar' | 'dashboard';

export interface TaskStats {
  total: number;
  completed: number;
  active: number;
  overdue: number;
  dueToday: number;
  completionRate: number;
  priorityCounts: Record<Priority, number>;
  categoryCounts: Record<string, number>;
}
