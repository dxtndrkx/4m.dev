import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, Play, Pause, RotateCcw, Target, CheckCircle2 } from 'lucide-react';
import { Task } from '../../types';
import { isSameDay } from '../../utils/dateUtils';

interface FocusViewProps {
  tasks: Task[];
  selectedDate: Date;
  onToggleComplete: (taskId: string) => void;
}

const FocusView: React.FC<FocusViewProps> = ({
  tasks,
  selectedDate,
  onToggleComplete,
}) => {
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes default
  const [isRunning, setIsRunning] = useState(false);
  const [completedToday, setCompletedToday] = useState(0);

  const todayTasks = tasks.filter(task => 
    isSameDay(new Date(task.date), selectedDate) && !task.completed
  ).sort((a, b) => a.priority === 'high' ? -1 : 1);

  const currentTask = currentTaskId ? tasks.find(t => t.id === currentTaskId) : todayTasks[0];

  useEffect(() => {
    const completed = tasks.filter(task => 
      isSameDay(new Date(task.date), selectedDate) && task.completed
    ).length;
    setCompletedToday(completed);
  }, [tasks, selectedDate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            // Notification when timer completes
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Focus session complete!', {
                body: 'Time for a break or mark task as complete.',
                icon: '/favicon.ico',
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining(25 * 60);
  };

  const handleCompleteTask = () => {
    if (currentTask) {
      onToggleComplete(currentTask.id);
      setTimeRemaining(25 * 60);
      setIsRunning(false);
      setCurrentTaskId(null);
    }
  };

  const progress = (25 * 60 - timeRemaining) / (25 * 60);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen bg-app-bg flex items-center justify-center p-6"
    >
      <div className="max-w-2xl w-full">
        {/* Focus Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-from to-accent-to rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-text-primary">
              Focus Mode
            </h1>
          </div>
          <p className="text-text-muted">
            Concentrate on one task at a time with the Pomodoro technique
          </p>
        </motion.div>

        {/* Current Task */}
        {currentTask ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="card-base p-8 mb-8 text-center"
          >
            <div className="mb-6">
              <div className="text-sm text-text-muted mb-2">Current Task</div>
              <h2 className="text-2xl font-semibold text-text-primary mb-2">
                {currentTask.title}
              </h2>
              {currentTask.description && (
                <p className="text-text-muted">
                  {currentTask.description}
                </p>
              )}
              <div className={`inline-flex items-center space-x-2 mt-3 px-3 py-1 rounded-full text-sm ${
                currentTask.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                currentTask.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                <span className="capitalize">{currentTask.priority} Priority</span>
              </div>
            </div>

            {/* Timer Circle */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-light-border"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="url(#gradient)"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: progress }}
                  transition={{ duration: 0.5 }}
                  style={{
                    strokeDasharray: `${2 * Math.PI * 45}`,
                    strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress)}`,
                  }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#666666" />
                    <stop offset="100%" stopColor="#aaaaaa" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-text-primary">
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="text-sm text-text-muted">
                    {isRunning ? 'Focus Time' : timeRemaining === 0 ? 'Complete!' : 'Ready to Start'}
                  </div>
                </div>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              {!isRunning ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStart}
                  className="btn-primary flex items-center space-x-2 px-6 py-3"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Focus</span>
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePause}
                  className="btn-secondary flex items-center space-x-2 px-6 py-3"
                >
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="btn-secondary flex items-center space-x-2 px-4 py-3"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </motion.button>
            </div>

            {/* Complete Task */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCompleteTask}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-3 flex items-center justify-center space-x-2 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Complete</span>
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="card-base p-8 text-center"
          >
            <Timer className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              No Tasks Available
            </h2>
            <p className="text-text-muted">
              All tasks for today are completed! Time to relax or add new tasks.
            </p>
          </motion.div>
        )}

        {/* Today's Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-base p-6"
        >
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Today's Progress
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">
                {completedToday}
              </div>
              <div className="text-sm text-text-muted">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent-from">
                {todayTasks.length}
              </div>
              <div className="text-sm text-text-muted">Remaining</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {completedToday + todayTasks.length}
              </div>
              <div className="text-sm text-text-muted">Total</div>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Tasks */}
        {todayTasks.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <h4 className="text-md font-medium text-text-muted mb-3">
              Up Next
            </h4>
            <div className="space-y-2">
              {todayTasks.slice(1, 4).map((task) => (
                <motion.div
                  key={task.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setCurrentTaskId(task.id)}
                  className="card-base p-3 cursor-pointer transition-all hover:shadow-lift"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      task.priority === 'high' ? 'bg-red-500' :
                      task.priority === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} />
                    <span className="text-text-primary font-medium">
                      {task.title}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default FocusView;
