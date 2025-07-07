import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Flag, Tag, CheckCircle2, Circle } from 'lucide-react';
import { Task } from '../types';
import { formatTime } from '../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onToggleComplete: (taskId: string) => void;
  compact?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onClick,
  onToggleComplete,
  compact = false,
}) => {
  const priorityColors = {
    low: 'border-green-500 bg-green-500/10',
    medium: 'border-yellow-500 bg-yellow-500/10',
    high: 'border-red-500 bg-red-500/10',
  };

  const categoryEmojis = {
    study: '📚',
    interview: '💼',
    project: '🛠️',
    revision: '🔄',
    other: '📝',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`card-base cursor-pointer transition-all duration-200 hover:shadow-lift ${
        task.completed ? 'opacity-60' : ''
      } ${priorityColors[task.priority]}`}
      onClick={onClick}
    >
      <div className={`p-${compact ? '3' : '4'} space-y-2`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete(task.id);
              }}
              className="text-accent-from hover:text-accent-to transition-colors"
            >
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </motion.button>
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium ${task.completed ? 'line-through text-text-muted' : 'text-text-primary'} ${compact ? 'text-sm' : ''}`}>
                {task.title}
              </h3>
              {!compact && task.description && (
                <p className="text-sm text-text-muted mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-${compact ? 'xs' : 'sm'}`}>
              {categoryEmojis[task.category]}
            </span>
            {task.priority === 'high' && (
              <Flag className="w-4 h-4 text-red-500" />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-text-muted">
            <Clock className="w-4 h-4" />
            <span className={`text-${compact ? 'xs' : 'sm'}`}>
              {formatTime(task.startTime)} - {formatTime(task.endTime)}
            </span>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
            {task.priority}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
