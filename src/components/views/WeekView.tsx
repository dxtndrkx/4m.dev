import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Task } from '../../types';
import { getWeekDays, isSameDay, isToday, getTimeSlots } from '../../utils/dateUtils';
import { format } from 'date-fns';
import TaskCard from '../TaskCard';

interface WeekViewProps {
  selectedDate: Date;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (date: Date, time?: string) => void;
  onToggleComplete: (taskId: string) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  selectedDate,
  tasks,
  onTaskClick,
  onAddTask,
  onToggleComplete,
}) => {
  const weekDays = getWeekDays(selectedDate);
  const timeSlots = getTimeSlots();

  const getTasksForDateTime = (date: Date, time: string) => {
    return tasks.filter(task => {
      if (!isSameDay(new Date(task.date), date)) return false;
      const taskHour = parseInt(task.startTime.split(':')[0]);
      const slotHour = parseInt(time.split(':')[0]);
      return taskHour === slotHour;
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
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
        <div className="grid grid-cols-8 gap-4 mb-4">
          <div className="text-center text-sm font-medium text-text-muted py-2">
            Time
          </div>
          {weekDays.map((date) => (
            <div
              key={date.toISOString()}
              className={`text-center py-2 rounded-lg ${
                isToday(date)
                  ? 'bg-gradient-to-r from-accent-from to-accent-to text-white'
                  : 'text-text-primary'
              }`}
            >
              <div className="text-sm font-medium">
                {format(date, 'EEE')}
              </div>
              <div className="text-lg font-bold">
                {format(date, 'd')}
              </div>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="overflow-auto max-h-[70vh]">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-8 gap-4"
          >
            {timeSlots.map((time) => (
              <React.Fragment key={time}>
                <motion.div
                  variants={item}
                  className="text-sm text-text-muted py-4 text-center border-r border-light-border"
                >
                  {format(new Date(`2000-01-01T${time}`), 'h:mm a')}
                </motion.div>
                {weekDays.map((date) => {
                  const dayTasks = getTasksForDateTime(date, time);
                  return (
                    <motion.div
                      key={`${date.toISOString()}-${time}`}
                      variants={item}
                      className="min-h-[80px] border-b border-light-border/50 relative group"
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onAddTask(date, time)}
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-light-border/10 rounded-lg"
                      >
                        <Plus className="w-5 h-5 text-text-muted" />
                      </motion.button>
                      <div className="space-y-1 p-1">
                        {dayTasks.map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onClick={() => onTaskClick(task)}
                            onToggleComplete={onToggleComplete}
                            compact
                          />
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeekView;
