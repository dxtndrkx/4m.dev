import { Task, Goal } from '../types';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, differenceInMinutes, parseISO } from 'date-fns';

export const processDashboardData = (tasks: Task[], goals: Goal[], range: number = 30) => {
  const endDate = new Date();
  const startDate = subDays(endDate, range - 1);
  const dateArray = eachDayOfInterval({ start: startDate, end: endDate });

  const tasksInRange = tasks.filter(task => {
    const taskDate = new Date(task.date);
    return taskDate >= startDate && taskDate <= endDate;
  });

  // 1. KPI Cards
  const todayStr = format(endDate, 'yyyy-MM-dd');
  const todayTasks = tasks.filter(task => task.date === todayStr);
  const completedToday = todayTasks.filter(t => t.completed).length;

  let streak = 0;
  for (let i = 0; i < range; i++) {
    const day = subDays(endDate, i);
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayTasks = tasks.filter(t => t.date === dayStr);
    if (dayTasks.length > 0 && dayTasks.every(t => t.completed)) {
      streak++;
    } else if (dayTasks.length > 0) {
      break;
    }
  }

  const totalCompleted = tasksInRange.filter(t => t.completed).length;
  const completionRate = tasksInRange.length > 0 ? (totalCompleted / tasksInRange.length) * 100 : 0;
  
  const totalDaysWithTasks = new Set(tasksInRange.map(t => t.date)).size;
  const avgDailyProductivity = totalDaysWithTasks > 0 ? totalCompleted / totalDaysWithTasks : 0;

  const kpis = {
    completedToday,
    weeklyStreak: streak,
    completionRate: Math.round(completionRate),
    avgDailyProductivity: avgDailyProductivity.toFixed(1),
  };

  // 2. Productivity Line Chart
  const productivityOverTime = dateArray.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayTasks = tasks.filter(task => task.date === dateStr);
    return {
      date: format(date, 'MMM d'),
      completed: dayTasks.filter(t => t.completed).length,
    };
  });

  // 3. Category Bar Chart (Time Breakdown)
  const categoryTime = tasksInRange.reduce((acc, task) => {
    if (task.completed) {
      const duration = differenceInMinutes(
        new Date(`${task.date}T${task.endTime}`),
        new Date(`${task.date}T${task.startTime}`)
      );
      acc[task.category] = (acc[task.category] || 0) + duration;
    }
    return acc;
  }, {} as Record<string, number>);

  const categoryBreakdown = Object.entries(categoryTime).map(([name, time]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    time: Math.round(time / 60), // in hours
  }));

  // 4. Skill Radar Chart
  const skillFocus = tasksInRange.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const totalTasks = tasksInRange.length;
  const radarData = [
    { subject: 'DSA', value: ((skillFocus['dsa'] || 0) / totalTasks) * 100, fullMark: 100 },
    { subject: 'Dev', value: ((skillFocus['dev'] || 0) / totalTasks) * 100, fullMark: 100 },
    { subject: 'Core', value: ((skillFocus['core'] || 0) / totalTasks) * 100, fullMark: 100 },
    { subject: 'Health', value: ((skillFocus['health'] || 0) / totalTasks) * 100, fullMark: 100 },
    { subject: 'Other', value: ((skillFocus['other'] || 0) / totalTasks) * 100, fullMark: 100 },
  ];

  // 5. Calendar Heatmap
  const heatmapData = dateArray.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const count = tasks.filter(t => t.date === dateStr && t.completed).length;
    return { date: dateStr, count };
  });

  // 6. Goal Progress
  const today = new Date();
  const dailyGoals = goals.filter(g => g.type === 'daily' && isSameDay(parseISO(g.date), today));
  const weeklyGoals = goals.filter(g => g.type === 'weekly' && isSameDay(startOfWeek(parseISO(g.date)), startOfWeek(today)));
  const monthlyGoals = goals.filter(g => g.type === 'monthly' && isSameDay(parseISO(g.date), today));

  const goalProgress = {
    daily: dailyGoals[0] ? (dailyGoals[0].current / dailyGoals[0].target) * 100 : 0,
    weekly: weeklyGoals[0] ? (weeklyGoals[0].current / weeklyGoals[0].target) * 100 : 0,
    monthly: monthlyGoals[0] ? (monthlyGoals[0].current / monthlyGoals[0].target) * 100 : 0,
  };

  // 7. Smart Suggestions
  const suggestions = [];
  if (completionRate < 70 && tasksInRange.length > 10) {
    suggestions.push({
      id: 'completion',
      icon: 'TrendingDown',
      text: `Your completion rate is ${Math.round(completionRate)}%. Try breaking tasks into smaller subtasks.`,
      cta: 'Review Tasks'
    });
  }
  if (streak > 3) {
    suggestions.push({
      id: 'streak',
      icon: 'Flame',
      text: `You're on a ${streak}-day streak! Keep up the great work.`,
      cta: 'View Streak'
    });
  }
  const dsaTime = categoryTime['dsa'] || 0;
  const devTime = categoryTime['dev'] || 0;
  const totalTime = dsaTime + devTime;
  if (totalTime > 0 && (dsaTime / totalTime < 0.3 || devTime / totalTime < 0.3)) {
     suggestions.push({
      id: 'balance',
      icon: 'GitCommitVertical',
      text: 'Your time allocation seems unbalanced. Ensure you are covering all key areas.',
      cta: 'Check Balance'
    });
  }


  return {
    kpis,
    productivityOverTime,
    categoryBreakdown,
    radarData,
    heatmapData,
    goalProgress,
    suggestions,
  };
};
