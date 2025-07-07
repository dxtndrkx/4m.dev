import { Task, Goal, Calendar, AppSettings, ProductivityStats } from '../types';
import { defaultCalendars } from './calendarUtils';

const STORAGE_KEYS = {
  TASKS: '4m_tasks',
  GOALS: '4m_goals',
  CALENDARS: '4m_calendars',
  SETTINGS: '4m_settings',
  STATS: '4m_stats',
} as const;

const defaultSettings: AppSettings = {
  theme: 'dark',
  defaultCalendar: 'personal',
  workingHours: {
    start: '09:00',
    end: '18:00',
  },
  notifications: true,
  smartConflictDetection: true,
  focusMode: false,
  weekStartsOn: 1,
  timeFormat: '12h',
  defaultTaskDuration: 60,
};

export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks:', error);
  }
};

export const loadTasks = (): Task[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load tasks:', error);
    return [];
  }
};

export const saveGoals = (goals: Goal[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  } catch (error) {
    console.error('Failed to save goals:', error);
  }
};

export const loadGoals = (): Goal[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.GOALS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load goals:', error);
    return [];
  }
};

export const saveCalendars = (calendars: Calendar[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CALENDARS, JSON.stringify(calendars));
  } catch (error) {
    console.error('Failed to save calendars:', error);
  }
};

export const loadCalendars = (): Calendar[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CALENDARS);
    return stored ? JSON.parse(stored) : defaultCalendars;
  } catch (error) {
    console.error('Failed to load calendars:', error);
    return defaultCalendars;
  }
};

export const saveSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

export const loadSettings = (): AppSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return defaultSettings;
  }
};

export const saveStats = (stats: ProductivityStats[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save stats:', error);
  }
};

export const loadStats = (): ProductivityStats[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STATS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load stats:', error);
    return [];
  }
};

export const exportData = () => {
  const data = {
    tasks: loadTasks(),
    goals: loadGoals(),
    calendars: loadCalendars(),
    settings: loadSettings(),
    stats: loadStats(),
    exportDate: new Date().toISOString(),
    version: '1.0',
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `4m-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importData = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.tasks) saveTasks(data.tasks);
        if (data.goals) saveGoals(data.goals);
        if (data.calendars) saveCalendars(data.calendars);
        if (data.settings) saveSettings(data.settings);
        if (data.stats) saveStats(data.stats);
        
        resolve(true);
      } catch (error) {
        console.error('Failed to import data:', error);
        resolve(false);
      }
    };
    reader.readAsText(file);
  });
};

export const clearAllData = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Failed to clear data:', error);
  }
};
