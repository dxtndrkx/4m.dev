import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Task } from '../../types';
import { getMonthDays, isSameDay, isToday, isSameMonth } from '../../utils/dateUtils';
import { format } from 'date-fns';

interface MonthViewProps {
  selectedDate: Date;
  tasks: Task[];
  onDateClick: (date: Date) => void;
  onAddTask: (date: Date) => void;
}

const MonthView: React.FC<MonthViewProps> = ({
  selectedDate,
  tasks,
  onDateClick,
  onAddTask,
}) => {
  const monthDays = getMonthDays(selectedDate);
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => isSameDay(new Date(task.date), date));
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.01,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Week days header */}
        <div className="grid grid-cols-7 gap-4 mb-4">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-text-muted py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-7 gap-4"
        >
          {monthDays.map((date) => {
            const dayTasks = getTasksForDate(date);
            const isCurrentMonth = isSameMonth(date, selectedDate);
            const isCurrentDay = isToday(date);
            
            return (
              <motion.div
                key={date.toISOString()}
                variants={item}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={`card-base p-3 min-h-[120px] cursor-pointer transition-all duration-200 ${
                  isCurrentDay
                    ? 'ring-2 ring-accent-from bg-gradient-to-br from-accent-from/5 to-accent-to/5'
                    : 'hover:shadow-lift'
                } ${!isCurrentMonth ? 'opacity-40' : ''}`}
                onClick={() => onDateClick(date)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-sm font-medium ${
                      isCurrentDay
                        ? 'text-accent-from'
                        : isCurrentMonth
                        ? 'text-text-primary'
                        : 'text-text-muted'
                    }`}
                  >
                    {format(date, 'd')}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddTask(date);
                    }}
                    className="p-1 rounded-md hover:bg-light-border transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Plus className="w-4 h-4 text-text-muted" />
                  </motion.button>
                </div>

                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className={`text-xs p-1.5 rounded-md truncate ${
                        task.priority === 'high'
                          ? 'bg-red-500/20 text-red-400'
                          : task.priority === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-green-500/20 text-green-400'
                      } ${task.completed ? 'line-through opacity-60' : ''}`}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-text-muted text-center">
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MonthView;
