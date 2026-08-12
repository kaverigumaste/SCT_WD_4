import { Category, Task } from '../types';
import { getTodayString, getTomorrowString } from '../utils/dateUtils';

const today = getTodayString();
const tomorrow = getTomorrowString();

// Calculate yesterday and future dates dynamically
const now = new Date();

const yesterdayDate = new Date();
yesterdayDate.setDate(now.getDate() - 1);
const yesterday = yesterdayDate.toISOString().split('T')[0];

const nextWeekDate = new Date();
nextWeekDate.setDate(now.getDate() + 4);
const nextWeek = nextWeekDate.toISOString().split('T')[0];

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'inbox',
    name: 'Inbox',
    color: '#3b82f6', // blue
    icon: 'Inbox',
    isSystem: true
  },
  {
    id: 'work',
    name: 'Work & Projects',
    color: '#8b5cf6', // purple
    icon: 'Briefcase',
    isSystem: false
  },
  {
    id: 'personal',
    name: 'Personal Life',
    color: '#10b981', // emerald
    icon: 'User',
    isSystem: false
  },
  {
    id: 'shopping',
    name: 'Shopping List',
    color: '#f59e0b', // amber
    icon: 'ShoppingCart',
    isSystem: false
  },
  {
    id: 'health',
    name: 'Health & Fitness',
    color: '#ec4899', // pink
    icon: 'HeartPulse',
    isSystem: false
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Finalize Q3 Product Design System',
    description: 'Review updated typography scales, button micro-interactions, and component tokens with the UI team.',
    completed: false,
    createdAt: new Date(now.getTime() - 86400000 * 2).toISOString(),
    dueDate: today,
    dueTime: '16:00',
    priority: 'urgent',
    categoryId: 'work',
    tags: ['design', 'ui-ux', 'v2'],
    pinned: true,
    subtasks: [
      { id: 'st-1', title: 'Check WCAG contrast ratios', completed: true },
      { id: 'st-2', title: 'Export Figma icons package', completed: true },
      { id: 'st-3', title: 'Conduct peer design review', completed: false }
    ]
  },
  {
    id: 'task-2',
    title: 'Submit monthly financial reports',
    description: 'Compile receipts, verify expense items, and send to accounting portal.',
    completed: false,
    createdAt: new Date(now.getTime() - 86400000 * 3).toISOString(),
    dueDate: yesterday,
    dueTime: '18:00',
    priority: 'high',
    categoryId: 'work',
    tags: ['finance', 'quarterly'],
    pinned: false,
    subtasks: [
      { id: 'st-21', title: 'Collect cloud server invoices', completed: true },
      { id: 'st-22', title: 'File reimbursement claim', completed: false }
    ]
  },
  {
    id: 'task-3',
    title: 'Weekly grocery store trip',
    description: 'Buy organic fruits, avocados, Greek yogurt, sourdough bread, and sparkling water.',
    completed: false,
    createdAt: new Date(now.getTime() - 86400000).toISOString(),
    dueDate: today,
    dueTime: '19:30',
    priority: 'medium',
    categoryId: 'shopping',
    tags: ['groceries', 'home'],
    pinned: false,
    subtasks: [
      { id: 'st-31', title: 'Fresh berries & apples', completed: false },
      { id: 'st-32', title: 'Almond milk & coffee beans', completed: false }
    ]
  },
  {
    id: 'task-4',
    title: '30-minute evening treadmill & core session',
    description: 'Maintain daily health goal. Warm up for 5 mins, steady pace interval, stretch.',
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: today,
    dueTime: '20:00',
    priority: 'medium',
    categoryId: 'health',
    tags: ['fitness', 'routine'],
    pinned: false,
    subtasks: []
  },
  {
    id: 'task-5',
    title: 'Schedule dentist checkup & cleaning',
    description: 'Call Dr. Smith\'s office to pick a morning slot next month.',
    completed: true,
    completedAt: new Date(now.getTime() - 3600000 * 4).toISOString(),
    createdAt: new Date(now.getTime() - 86400000 * 4).toISOString(),
    dueDate: yesterday,
    dueTime: '11:00',
    priority: 'low',
    categoryId: 'personal',
    tags: ['health', 'appointments'],
    pinned: false,
    subtasks: []
  },
  {
    id: 'task-6',
    title: 'Plan weekend trip itinerary to the coast',
    description: 'Book seaside cabin reservation and make list of scenic hiking spots.',
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: tomorrow,
    dueTime: '15:00',
    priority: 'low',
    categoryId: 'personal',
    tags: ['travel', 'vacation'],
    pinned: false,
    subtasks: [
      { id: 'st-61', title: 'Reserve kayak rental', completed: false },
      { id: 'st-62', title: 'Check weather forecast', completed: true }
    ]
  },
  {
    id: 'task-7',
    title: 'Deploy microservice security patch',
    description: 'Verify dependencies and deploy container updates to staging and production.',
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: nextWeek,
    dueTime: '10:00',
    priority: 'high',
    categoryId: 'work',
    tags: ['devops', 'security'],
    pinned: false,
    subtasks: []
  }
];
