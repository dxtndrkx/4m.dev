export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO date string
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'dsa' | 'dev' | 'core' | 'health' | 'other';
  calendarId: string;
  tags: string[];
  subtasks: Subtask[];
  checklistItems: ChecklistItem[];
  dependencies: string[]; // Task IDs this task depends on
  recurring?: RecurringRule;
  reminder?: number; // minutes before task
  estimatedDuration?: number; // minutes
  actualDuration?: number; // minutes
  notes?: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  order: number;
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  order: number;
}

export interface RecurringRule {
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  interval: number; // Every N days/weeks/months
  daysOfWeek?: number[]; // 0-6, Sunday = 0
  endDate?: string;
  maxOccurrences?: number;
}

export interface Calendar {
  id: string;
  name: string;
  color: string;
  description?: string;
  visible: boolean;
  order: number;
}

export interface Goal {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly';
  target: number;
  current: number;
  date: string; // ISO date string
  category?: string;
  calendarId?: string;
}

export interface ProductivityStats {
  date: string;
  completedTasks: number;
  totalTasks: number;
  timeSpent: number; // minutes
  categories: Record<string, number>;
  efficiency: number; // 0-1
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  defaultCalendar: string;
  workingHours: {
    start: string;
    end: string;
  };
  notifications: boolean;
  smartConflictDetection: boolean;
  focusMode: boolean;
  weekStartsOn: 0 | 1; // Sunday = 0, Monday = 1
  timeFormat: '12h' | '24h';
  defaultTaskDuration: number; // minutes
}

export type ViewType = 'day' | 'week' | 'month' | 'analytics' | 'focus' | 'dashboard';

export interface AppState {
  tasks: Task[];
  goals: Goal[];
  calendars: Calendar[];
  settings: AppSettings;
  currentView: ViewType;
  selectedDate: Date;
  stats: ProductivityStats[];
}

export interface ConflictDetection {
  taskId: string;
  conflictingTasks: string[];
  severity: 'minor' | 'major';
  suggestion?: string;
}

export interface SmartSuggestion {
  id: string;
  type: 'reschedule' | 'break' | 'focus' | 'goal_alignment';
  title: string;
  description: string;
  action?: () => void;
  priority: 'low' | 'medium' | 'high';
}
