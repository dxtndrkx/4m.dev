import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar } from 'lucide-react';
import { Task } from '../../types';
import { isSameDay, getTimeSlots } from '../../utils/dateUtils';
import { format } from 'date-fns';
import TaskCard from '../TaskCard';

interface DayViewProps {
  selectedDate: Date;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (date: Date, time?: string) => void;
  onToggleComplete: (taskId: string) => void;
}

const DayView: React.FC<DayViewProps> = ({
  selectedDate,
  tasks,
  onTaskClick,
  onAddTask,
  onToggleComplete,
}) => {
  const timeSlots = getTimeSlots();
  const dayTasks = tasks.filter(task => isSameDay(new Date(task.date), selectedDate));

  const getTasksForTime = (time: string) => {
    return dayTasks.filter(task => {
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
        staggerChildren: 0.03,
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
      <div className="max-w-4xl mx-auto">
        {/* Day header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-accent-from to-accent-to rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary">
                {format(selectedDate, 'EEEE')}
              </h2>
              <p className="text-text-muted">
                {format(selectedDate, 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAddTask(selectedDate)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </motion.button>
        </div>

        {/* Tasks summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="card-base p-4 text-center">
            <div className="text-2xl font-bold text-text-primary">
              {dayTasks.length}
            </div>
            <div className="text-sm text-text-muted">Total Tasks</div>
          </div>
          <div className="card-base p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {dayTasks.filter(task => task.completed).length}
            </div>
            <div className="text-sm text-text-muted">Completed</div>
          </div>
          <div className="card-base p-4 text-center">
            <div className="text-2xl font-bold text-accent-from">
              {dayTasks.filter(task => !task.completed).length}
            </div>
            <div className="text-sm text-text-muted">Remaining</div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-2"
          >
            {timeSlots.map((time) => {
              const timeTasks = getTasksForTime(time);
              return (
                <motion.div
                  key={time}
                  variants={item}
                  className="flex items-start space-x-4"
                >
                  <div className="w-20 text-sm text-text-muted pt-4 flex-shrink-0">
                    {format(new Date(`2000-01-01T${time}`), 'h:mm a')}
                  </div>
                  <div className="flex-1 min-h-[60px] border-l border-light-border pl-4 relative group">
                    <div className="absolute -left-2 top-4 w-4 h-4 bg-light-border rounded-full"></div>
                    {timeTasks.length > 0 ? (
                      <div className="space-y-2">
                        {timeTasks.map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onClick={() => onTaskClick(task)}
                            onToggleComplete={onToggleComplete}
                          />
                        ))}
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onAddTask(selectedDate, time)}
                        className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-light-border/10 rounded-lg border-2 border-dashed border-light-border"
                      >
                        <div className="flex items-center space-x-2 text-text-muted">
                          <Plus className="w-4 h-4" />
                          <span className="text-sm">Add task</span>
                        </div>
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DayView;
