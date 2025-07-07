import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Clock, Calendar, Award, Zap } from 'lucide-react';
import { Task, Goal, ProductivityStats } from '../../types';
import { calculateProductivityScore } from '../../utils/calendarUtils';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

interface AnalyticsViewProps {
  tasks: Task[];
  goals: Goal[];
  stats: ProductivityStats[];
  selectedDate: Date;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  tasks,
  goals,
  stats,
  selectedDate,
}) => {
  const analytics = useMemo(() => {
    const today = format(selectedDate, 'yyyy-MM-dd');
    const last7Days = Array.from({ length: 7 }, (_, i) => 
      format(subDays(selectedDate, i), 'yyyy-MM-dd')
    ).reverse();

    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });

    // Calculate weekly stats
    const weekTasks = tasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate >= weekStart && taskDate <= weekEnd;
    });

    const completedThisWeek = weekTasks.filter(task => task.completed).length;
    const totalThisWeek = weekTasks.length;
    const completionRate = totalThisWeek > 0 ? (completedThisWeek / totalThisWeek) * 100 : 0;

    // Calculate productivity scores for last 7 days
    const productivityTrend = last7Days.map(date => ({
      date,
      score: calculateProductivityScore(tasks, date),
      completed: tasks.filter(task => task.date === date && task.completed).length,
      total: tasks.filter(task => task.date === date).length,
    }));

    // Category breakdown
    const categoryStats = weekTasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Time allocation
    const timeSpent = weekTasks
      .filter(task => task.completed)
      .reduce((total, task) => {
        const start = new Date(`2000-01-01T${task.startTime}`);
        const end = new Date(`2000-01-01T${task.endTime}`);
        return total + (end.getTime() - start.getTime()) / (1000 * 60);
      }, 0);

    // Streak calculation
    let currentStreak = 0;
    for (let i = 0; i < last7Days.length; i++) {
      const dayScore = calculateProductivityScore(tasks, last7Days[last7Days.length - 1 - i]);
      if (dayScore > 50) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      completionRate,
      productivityTrend,
      categoryStats,
      timeSpent,
      currentStreak,
      avgDailyTasks: totalThisWeek / 7,
      highPriorityCompleted: weekTasks.filter(task => task.completed && task.priority === 'high').length,
    };
  }, [tasks, selectedDate]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: number;
    color?: string;
  }> = ({ title, value, icon, trend, color = 'text-accent-from' }) => (
    <motion.div variants={item} className="card-base p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br from-accent-from/10 to-accent-to/10 ${color}`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center space-x-1 text-sm ${
            trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-text-muted'
          }`}>
            <TrendingUp className="w-3 h-3" />
            <span>{trend > 0 ? '+' : ''}{trend}%</span>
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-text-primary mb-1">
        {value}
      </div>
      <div className="text-sm text-text-muted">
        {title}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="p-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-text-muted">
            Track your productivity and progress insights
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Completion Rate"
              value={`${Math.round(analytics.completionRate)}%`}
              icon={<Target className="w-6 h-6" />}
              color="text-green-400"
            />
            <StatCard
              title="Current Streak"
              value={`${analytics.currentStreak} days`}
              icon={<Zap className="w-6 h-6" />}
              color="text-yellow-400"
            />
            <StatCard
              title="Time Invested"
              value={`${Math.round(analytics.timeSpent / 60)}h`}
              icon={<Clock className="w-6 h-6" />}
              color="text-blue-400"
            />
            <StatCard
              title="High Priority Done"
              value={analytics.highPriorityCompleted}
              icon={<Award className="w-6 h-6" />}
              color="text-purple-400"
            />
          </div>

          {/* Productivity Trend */}
          <motion.div variants={item} className="card-base p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-6">
              7-Day Productivity Trend
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {analytics.productivityTrend.map((day, index) => (
                <div key={day.date} className="text-center">
                  <div className="text-xs text-text-muted mb-2">
                    {format(new Date(day.date), 'EEE')}
                  </div>
                  <div className="relative">
                    <div className="w-full h-24 bg-light-border rounded-lg overflow-hidden">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${day.score}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`w-full bg-gradient-to-t from-accent-from to-accent-to transition-all duration-300 ${
                          day.score > 80 ? 'from-green-500 to-green-400' :
                          day.score > 60 ? 'from-blue-500 to-blue-400' :
                          day.score > 40 ? 'from-yellow-500 to-yellow-400' :
                          'from-red-500 to-red-400'
                        }`}
                        style={{ marginTop: 'auto' }}
                      />
                    </div>
                    <div className="text-xs text-text-muted mt-1">
                      {day.completed}/{day.total}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div variants={item} className="card-base p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-6">
              Task Categories This Week
            </h3>
            <div className="space-y-4">
              {Object.entries(analytics.categoryStats).map(([category, count]) => {
                const percentage = (count / Object.values(analytics.categoryStats).reduce((a, b) => a + b, 0)) * 100;
                return (
                  <div key={category} className="flex items-center space-x-4">
                    <div className="w-20 text-sm text-text-muted capitalize">
                      {category}
                    </div>
                    <div className="flex-1 bg-light-border rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-accent-from to-accent-to rounded-full"
                      />
                    </div>
                    <div className="text-sm text-text-primary font-medium">
                      {count}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Goals Progress */}
          <motion.div variants={item} className="card-base p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-6">
              Active Goals
            </h3>
            {goals.length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <p className="text-text-muted">No active goals set</p>
              </div>
            ) : (
              <div className="space-y-4">
                {goals.slice(0, 5).map((goal) => (
                  <div key={goal.id} className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">
                        {goal.title}
                      </div>
                      <div className="text-sm text-text-muted capitalize">
                        {goal.type} goal
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-light-border rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-accent-from to-accent-to rounded-full"
                        />
                      </div>
                      <div className="text-sm text-text-primary font-medium">
                        {goal.current}/{goal.target}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnalyticsView;
