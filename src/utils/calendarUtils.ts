import { Task, Calendar, ConflictDetection } from '../types';
import { isAfter, isBefore, parseISO, addMinutes } from 'date-fns';

export const defaultCalendars: Calendar[] = [
  {
    id: 'personal',
    name: 'Personal',
    color: '#10b981', // emerald-500
    description: 'Personal tasks and events',
    visible: true,
    order: 1,
  },
  {
    id: 'study',
    name: 'Study',
    color: '#3b82f6', // blue-500
    description: 'Academic and learning tasks',
    visible: true,
    order: 2,
  },
  {
    id: 'placement',
    name: 'Placement',
    color: '#f59e0b', // amber-500
    description: 'Interview and placement preparation',
    visible: true,
    order: 3,
  },
  {
    id: 'project',
    name: 'Projects',
    color: '#8b5cf6', // violet-500
    description: 'Development and project work',
    visible: true,
    order: 4,
  },
];

export const detectTaskConflicts = (tasks: Task[]): ConflictDetection[] => {
  const conflicts: ConflictDetection[] = [];
  const sortedTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`);
      const dateB = new Date(`${b.date}T${b.startTime}`);
      return dateA.getTime() - dateB.getTime();
    });

  for (let i = 0; i < sortedTasks.length; i++) {
    const currentTask = sortedTasks[i];
    const currentStart = new Date(`${currentTask.date}T${currentTask.startTime}`);
    const currentEnd = new Date(`${currentTask.date}T${currentTask.endTime}`);
    
    const conflictingTasks: string[] = [];

    for (let j = i + 1; j < sortedTasks.length; j++) {
      const compareTask = sortedTasks[j];
      const compareStart = new Date(`${compareTask.date}T${compareTask.startTime}`);
      const compareEnd = new Date(`${compareTask.date}T${compareTask.endTime}`);

      // Check if tasks overlap
      if (
        (isAfter(compareStart, currentStart) && isBefore(compareStart, currentEnd)) ||
        (isAfter(compareEnd, currentStart) && isBefore(compareEnd, currentEnd)) ||
        (isBefore(compareStart, currentStart) && isAfter(compareEnd, currentEnd))
      ) {
        conflictingTasks.push(compareTask.id);
      }
    }

    if (conflictingTasks.length > 0) {
      conflicts.push({
        taskId: currentTask.id,
        conflictingTasks,
        severity: conflictingTasks.length > 1 ? 'major' : 'minor',
        suggestion: `Consider rescheduling or adjusting time for better productivity`,
      });
    }
  }

  return conflicts;
};

export const generateTaskSuggestions = (tasks: Task[], goals: Goal[]) => {
  const suggestions = [];
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(task => task.date === today && !task.completed);
  
  // Overloaded day suggestion
  if (todayTasks.length > 8) {
    suggestions.push({
      id: 'overloaded',
      type: 'reschedule',
      title: 'Day seems overloaded',
      description: `You have ${todayTasks.length} tasks today. Consider moving some to tomorrow.`,
      priority: 'medium',
    });
  }

  // Break suggestion
  const highPriorityTasks = todayTasks.filter(task => task.priority === 'high');
  if (highPriorityTasks.length > 3) {
    suggestions.push({
      id: 'break',
      type: 'break',
      title: 'Take a break',
      description: 'You have many high-priority tasks. Consider scheduling short breaks.',
      priority: 'low',
    });
  }

  return suggestions;
};

export const exportToICS = (tasks: Task[], calendars: Calendar[]) => {
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//4m Planner//EN',
    'CALSCALE:GREGORIAN',
  ];

  tasks.forEach(task => {
    const calendar = calendars.find(c => c.id === task.calendarId);
    const startDateTime = new Date(`${task.date}T${task.startTime}`);
    const endDateTime = new Date(`${task.date}T${task.endTime}`);
    
    icsLines.push(
      'BEGIN:VEVENT',
      `UID:${task.id}@4m.app`,
      `DTSTART:${startDateTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTEND:${endDateTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `SUMMARY:${task.title}`,
      `DESCRIPTION:${task.description || ''}`,
      `CATEGORIES:${calendar?.name || 'Default'}`,
      `PRIORITY:${task.priority === 'high' ? '1' : task.priority === 'medium' ? '5' : '9'}`,
      'END:VEVENT'
    );
  });

  icsLines.push('END:VCALENDAR');
  return icsLines.join('\r\n');
};

export const calculateProductivityScore = (tasks: Task[], date: string): number => {
  const dayTasks = tasks.filter(task => task.date === date);
  if (dayTasks.length === 0) return 0;

  const completed = dayTasks.filter(task => task.completed).length;
  const highPriority = dayTasks.filter(task => task.priority === 'high').length;
  const completedHighPriority = dayTasks.filter(task => task.completed && task.priority === 'high').length;

  const completionRate = completed / dayTasks.length;
  const priorityBonus = highPriority > 0 ? (completedHighPriority / highPriority) * 0.2 : 0;

  return Math.min(100, Math.round((completionRate + priorityBonus) * 100));
};
