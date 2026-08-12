import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  CheckCircle2,
  ListTodo,
  Sparkles,
  AlertTriangle,
  Search,
  SlidersHorizontal,
  Calendar,
  Layers,
  HelpCircle
} from 'lucide-react';

import { Task, Category, FilterState, ViewMode, Priority, StatusFilter } from './types';
import { loadTasks, saveTasks, loadCategories, saveCategories, resetToDemoData, exportDataJSON } from './utils/storage';
import { isTaskOverdue, isTaskToday, isTaskUpcoming } from './utils/dateUtils';

import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';
import { CategoryModal } from './components/CategoryModal';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { KanbanBoard } from './components/KanbanBoard';
import { CalendarView } from './components/CalendarView';
import { CommandPalette } from './components/CommandPalette';
import { ToastContainer, ToastMessage } from './components/Toast';

export default function App() {
  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('taskflow_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('taskflow_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      addToast('info', `${next === 'dark' ? '🌙 Dark' : '☀️ Light'} Theme Activated`);
      return next;
    });
  };

  // Main State
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [categories, setCategories] = useState<Category[]>(() => loadCategories());

  // View & Filter State
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filter, setFilter] = useState<FilterState>({
    status: 'all',
    categoryId: 'all',
    priority: 'all',
    searchQuery: '',
    tag: null,
    sortBy: 'dueDate',
    sortOrder: 'asc'
  });

  // Modals & Navigation State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [presetDateForModal, setPresetDateForModal] = useState<string | null>(null);

  // Toast Notifications State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  // Sync to LocalStorage
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveCategories(categories);
  }, [categories]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      // 'N' for New Task
      if (e.key.toLowerCase() === 'n' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setEditingTask(null);
        setIsTaskModalOpen(true);
      }

      // Cmd+K or Ctrl+K for Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Filter & Sort Engine
  const processedTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Category Filter
      if (filter.categoryId !== 'all' && task.categoryId !== filter.categoryId) {
        return false;
      }

      // Priority Filter
      if (filter.priority !== 'all' && task.priority !== filter.priority) {
        return false;
      }

      // Status Filter
      if (filter.status === 'completed' && !task.completed) return false;
      if (filter.status === 'active' && task.completed) return false;
      if (filter.status === 'overdue' && (!isTaskOverdue(task) || task.completed)) return false;
      if (filter.status === 'today' && (!isTaskToday(task) || task.completed)) return false;
      if (filter.status === 'upcoming' && (!isTaskUpcoming(task) || task.completed)) return false;

      // Tag Filter
      if (filter.tag && (!task.tags || !task.tags.includes(filter.tag))) {
        return false;
      }

      // Search Query
      if (filter.searchQuery.trim()) {
        const q = filter.searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchDesc = task.description?.toLowerCase().includes(q) || false;
        const matchTags = task.tags?.some((t) => t.toLowerCase().includes(q)) || false;
        if (!matchTitle && !matchDesc && !matchTags) return false;
      }

      return true;
    }).sort((a, b) => {
      // Always put pinned tasks first in list view
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      // Primary sorting
      let comparison = 0;

      if (filter.sortBy === 'dueDate') {
        const dateA = a.dueDate ? `${a.dueDate}T${a.dueTime || '23:59'}` : '9999-99-99';
        const dateB = b.dueDate ? `${b.dueDate}T${b.dueTime || '23:59'}` : '9999-99-99';
        comparison = dateA.localeCompare(dateB);
      } else if (filter.sortBy === 'priority') {
        const priorityWeights: Record<Priority, number> = {
          urgent: 4,
          high: 3,
          medium: 2,
          low: 1
        };
        comparison = priorityWeights[b.priority] - priorityWeights[a.priority];
      } else if (filter.sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (filter.sortBy === 'createdAt') {
        comparison = b.createdAt.localeCompare(a.createdAt);
      }

      return filter.sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [tasks, filter]);

  // Handlers
  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            addToast('success', 'Task Completed! 🎉', `"${t.title}" marked as done.`);
          }
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined
          };
        }
        return t;
      })
    );
  };

  const handleTogglePin = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextPinned = !t.pinned;
          addToast('info', nextPinned ? 'Task Pinned' : 'Task Unpinned');
          return { ...t, pinned: nextPinned };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (taskToDelete) {
      addToast('info', 'Task Deleted', `"${taskToDelete.title}" removed.`);
    }
  };

  const handleSaveTask = (
    taskData: Omit<Task, 'id' | 'createdAt'> & { id?: string }
  ) => {
    if (taskData.id) {
      // Edit
      setTasks((prev) =>
        prev.map((t) => (t.id === taskData.id ? { ...t, ...taskData } : t))
      );
      addToast('success', 'Task Updated', 'Changes saved successfully.');
    } else {
      // Create
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
        dueDate: presetDateForModal || taskData.dueDate
      };
      setTasks((prev) => [newTask, ...prev]);
      addToast('success', 'Task Created! ✨', `Added "${newTask.title}".`);
      setPresetDateForModal(null);
    }
  };

  const handleDuplicateTask = (task: Task) => {
    const dup: Task = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: `${task.title} (Copy)`,
      createdAt: new Date().toISOString(),
      completed: false,
      completedAt: undefined
    };
    setTasks((prev) => [dup, ...prev]);
    addToast('info', 'Task Duplicated', `Created copy of "${task.title}".`);
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          return { ...t, subtasks: updatedSubtasks };
        }
        return t;
      })
    );
  };

  const handleSaveCategory = (categoryData: { name: string; color: string; icon: string }) => {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: categoryData.name,
      color: categoryData.color,
      icon: categoryData.icon
    };
    setCategories((prev) => [...prev, newCat]);
    addToast('success', 'Custom List Added', `Created list "${newCat.name}".`);
  };

  const handleExportData = () => {
    exportDataJSON(tasks, categories);
    addToast('success', 'Backup Exported', 'Downloaded taskflow-backup.json file.');
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset tasks to sample initial dataset? Existing custom changes will be replaced.')) {
      const reset = resetToDemoData();
      setTasks(reset.tasks);
      setCategories(reset.categories);
      addToast('info', 'Sample Tasks Restored');
    }
  };

  // Get active Category title
  const activeCategoryObj = categories.find((c) => c.id === filter.categoryId);
  let activeCategoryName = 'All Tasks';
  if (filter.categoryId !== 'all') {
    activeCategoryName = activeCategoryObj?.name || 'Custom List';
  } else if (filter.status === 'today') {
    activeCategoryName = "Today's Tasks";
  } else if (filter.status === 'upcoming') {
    activeCategoryName = 'Upcoming Scheduled Tasks';
  } else if (filter.status === 'overdue') {
    activeCategoryName = 'Overdue Tasks';
  } else if (filter.status === 'completed') {
    activeCategoryName = 'Completed Archive';
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row antialiased font-sans selection:bg-blue-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        tasks={tasks}
        categories={categories}
        activeStatus={filter.status}
        activeCategory={filter.categoryId}
        viewMode={viewMode}
        onSelectStatus={(status) => setFilter((f) => ({ ...f, status }))}
        onSelectCategory={(categoryId) => setFilter((f) => ({ ...f, categoryId }))}
        onSelectViewMode={(v) => setViewMode(v)}
        onOpenAddCategory={() => setIsCategoryModalOpen(true)}
        onExport={handleExportData}
        onResetDemo={handleResetDemoData}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Top Header */}
        <Header
          filter={filter}
          onUpdateFilter={(updates) => setFilter((f) => ({ ...f, ...updates }))}
          onOpenNewTask={() => {
            setEditingTask(null);
            setIsTaskModalOpen(true);
          }}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          categories={categories}
          activeCategoryName={activeCategoryName}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        {/* View Content Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Active View Switcher rendering */}
          {viewMode === 'dashboard' ? (
            <DashboardView
              tasks={tasks}
              categories={categories}
              onSelectStatusFilter={(status) => {
                setFilter((f) => ({ ...f, status, categoryId: 'all' }));
                setViewMode('list');
              }}
              onSelectCategoryFilter={(catId) => {
                setFilter((f) => ({ ...f, categoryId: catId, status: 'all' }));
                setViewMode('list');
              }}
            />
          ) : viewMode === 'board' ? (
            <KanbanBoard
              tasks={processedTasks}
              categories={categories}
              onToggleComplete={handleToggleComplete}
              onTogglePin={handleTogglePin}
              onDelete={handleDeleteTask}
              onEdit={(t) => {
                setEditingTask(t);
                setIsTaskModalOpen(true);
              }}
              onDuplicate={handleDuplicateTask}
              onToggleSubtask={handleToggleSubtask}
            />
          ) : viewMode === 'calendar' ? (
            <CalendarView
              tasks={tasks}
              categories={categories}
              onToggleComplete={handleToggleComplete}
              onTogglePin={handleTogglePin}
              onDelete={handleDeleteTask}
              onEdit={(t) => {
                setEditingTask(t);
                setIsTaskModalOpen(true);
              }}
              onDuplicate={handleDuplicateTask}
              onToggleSubtask={handleToggleSubtask}
              onOpenNewTaskForDate={(dateStr) => {
                setPresetDateForModal(dateStr);
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
            />
          ) : (
            /* Default List View */
            <div className="space-y-4">
              {/* Active Filter Pills Bar */}
              {(filter.searchQuery || filter.priority !== 'all' || filter.status !== 'all' || filter.categoryId !== 'all') && (
                <div className="flex items-center justify-between gap-2 bg-blue-50/60 dark:bg-blue-950/30 p-3 rounded-2xl border border-blue-200/60 dark:border-blue-900/40 text-xs font-medium">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-blue-700 dark:text-blue-300 font-bold">Filtered By:</span>
                    {filter.status !== 'all' && (
                      <span className="bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-slate-700 font-semibold">
                        Status: {filter.status}
                      </span>
                    )}
                    {filter.priority !== 'all' && (
                      <span className="bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-slate-700 font-semibold uppercase">
                        Priority: {filter.priority}
                      </span>
                    )}
                    {filter.searchQuery && (
                      <span className="bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-slate-700 font-semibold">
                        Search: "{filter.searchQuery}"
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setFilter({
                        status: 'all',
                        categoryId: 'all',
                        priority: 'all',
                        searchQuery: '',
                        tag: null,
                        sortBy: 'dueDate',
                        sortOrder: 'asc'
                      })
                    }
                    className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-semibold shrink-0"
                  >
                    Reset Filters
                  </button>
                </div>
              )}

              {/* Tasks List Container */}
              {processedTasks.length === 0 ? (
                <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                    <ListTodo className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                    No tasks found
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    There are no tasks matching your current filters. Create a new task or adjust your search filter!
                  </p>
                  <button
                    onClick={() => {
                      setEditingTask(null);
                      setIsTaskModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Task</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {processedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      categories={categories}
                      onToggleComplete={handleToggleComplete}
                      onTogglePin={handleTogglePin}
                      onDelete={handleDeleteTask}
                      onEdit={(t) => {
                        setEditingTask(t);
                        setIsTaskModalOpen(true);
                      }}
                      onDuplicate={handleDuplicateTask}
                      onToggleSubtask={handleToggleSubtask}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Task Modal (Create & Edit) */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
          setPresetDateForModal(null);
        }}
        onSave={handleSaveTask}
        categories={categories}
        initialTask={editingTask}
        defaultCategoryId={filter.categoryId}
      />

      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
      />

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        tasks={tasks}
        categories={categories}
        onOpenNewTask={() => {
          setEditingTask(null);
          setIsTaskModalOpen(true);
        }}
        onOpenAddCategory={() => setIsCategoryModalOpen(true)}
        onSelectViewMode={(v) => setViewMode(v)}
        onSelectStatusFilter={(s) => setFilter((f) => ({ ...f, status: s }))}
        onSelectCategoryFilter={(c) => setFilter((f) => ({ ...f, categoryId: c }))}
        onExport={handleExportData}
        onResetDemo={handleResetDemoData}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  );
}
