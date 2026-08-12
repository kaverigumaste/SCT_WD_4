import { Category, Task } from '../types';
import { DEFAULT_CATEGORIES, INITIAL_TASKS } from '../data/initialData';

const TASKS_KEY = 'taskflow_tasks_v1';
const CATEGORIES_KEY = 'taskflow_categories_v1';

export const loadTasks = (): Task[] => {
  try {
    const data = localStorage.getItem(TASKS_KEY);
    if (!data) {
      saveTasks(INITIAL_TASKS);
      return INITIAL_TASKS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to load tasks from localStorage', err);
    return INITIAL_TASKS;
  }
};

export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks to localStorage', err);
  }
};

export const loadCategories = (): Category[] => {
  try {
    const data = localStorage.getItem(CATEGORIES_KEY);
    if (!data) {
      saveCategories(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to load categories from localStorage', err);
    return DEFAULT_CATEGORIES;
  }
};

export const saveCategories = (categories: Category[]): void => {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (err) {
    console.error('Failed to save categories to localStorage', err);
  }
};

export const resetToDemoData = (): { tasks: Task[]; categories: Category[] } => {
  saveTasks(INITIAL_TASKS);
  saveCategories(DEFAULT_CATEGORIES);
  return { tasks: INITIAL_TASKS, categories: DEFAULT_CATEGORIES };
};

export const exportDataJSON = (tasks: Task[], categories: Category[]): void => {
  const exportObject = {
    app: 'TaskFlow',
    exportedAt: new Date().toISOString(),
    tasks,
    categories
  };
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(exportObject, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `taskflow-backup-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};
