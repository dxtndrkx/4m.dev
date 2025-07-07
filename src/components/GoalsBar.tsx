import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, X, TrendingUp } from 'lucide-react';
import { Goal } from '../types';
import { format, isToday, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

interface GoalsBarProps {
  goals: Goal[];
  selectedDate: Date;
  onSaveGoal: (goal: Omit<Goal, 'id'>) => void;
  onDeleteGoal: (goalId: string) => void;
  onUpdateGoal: (goalId: string, updates: Partial<Goal>) => void;
}

const GoalsBar: React.FC<GoalsBarProps> = ({
  goals,
  selectedDate,
  onSaveGoal,
  onDeleteGoal,
  onUpdateGoal,
}) => {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState(1);
  const [newGoalType, setNewGoalType] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const getGoalsForPeriod = () => {
    const today = format(selectedDate, 'yyyy-MM-dd');
    
    return goals.filter(goal => {
      switch (goal.type) {
        case 'daily':
          return goal.date === today;
        case 'weekly':
          const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
          const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
          const goalDate = new Date(goal.date);
          return goalDate >= weekStart && goalDate <= weekEnd;
        case 'monthly':
          const monthStart = startOfMonth(selectedDate);
          const monthEnd = endOfMonth(selectedDate);
          const goalDateMonth = new Date(goal.date);
          return goalDateMonth >= monthStart && goalDateMonth <= monthEnd;
        default:
          return false;
      }
    });
  };

  const handleAddGoal = () => {
    if (!newGoalTitle.trim()) return;

    onSaveGoal({
      title: newGoalTitle.trim(),
      type: newGoalType,
      target: newGoalTarget,
      current: 0,
      date: format(selectedDate, 'yyyy-MM-dd'),
    });

    setNewGoalTitle('');
    setNewGoalTarget(1);
    setShowAddGoal(false);
  };

  const handleProgressClick = (goal: Goal) => {
    const newCurrent = Math.min(goal.current + 1, goal.target);
    onUpdateGoal(goal.id, { current: newCurrent });
  };

  const periodGoals = getGoalsForPeriod();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card-base p-4 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-accent-from" />
          <h3 className="text-lg font-semibold text-text-primary">Goals</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddGoal(true)}
          className="p-2 rounded-lg hover:bg-light-border transition-colors"
        >
          <Plus className="w-4 h-4 text-text-muted" />
        </motion.button>
      </div>

      <AnimatePresence>
        {showAddGoal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-4 p-4 bg-app-bg rounded-lg border border-light-border"
          >
            <div className="space-y-3">
              <input
                type="text"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder="Enter goal title..."
                className="w-full px-3 py-2 bg-card-base border border-light-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-from"
              />
              <div className="flex space-x-3">
                <select
                  value={newGoalType}
                  onChange={(e) => setNewGoalType(e.target.value as any)}
                  className="px-3 py-2 bg-card-base border border-light-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-from"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <input
                  type="number"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="px-3 py-2 bg-card-base border border-light-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-from"
                />
              </div>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddGoal}
                  className="btn-primary flex-1"
                >
                  Add Goal
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddGoal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {periodGoals.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="w-8 h-8 text-text-muted mx-auto mb-2" />
            <p className="text-text-muted">No goals set for this period</p>
          </div>
        ) : (
          <AnimatePresence>
            {periodGoals.map((goal) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="p-3 bg-app-bg rounded-lg border border-light-border"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-text-primary">{goal.title}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-text-muted capitalize">
                      {goal.type}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onDeleteGoal(goal.id)}
                      className="p-1 rounded-md hover:bg-red-500/20 text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </motion.button>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-light-border rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-accent-from to-accent-to rounded-full"
                    />
                  </div>
                  <span className="text-sm text-text-muted">
                    {goal.current}/{goal.target}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleProgressClick(goal)}
                    disabled={goal.current >= goal.target}
                    className="p-1 rounded-md hover:bg-green-500/20 text-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3 h-3" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

export default GoalsBar;
