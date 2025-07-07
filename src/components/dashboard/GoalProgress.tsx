import React from 'react';
import { motion } from 'framer-motion';

interface GoalProgressProps {
  daily: number;
  weekly: number;
  monthly: number;
}

const ProgressRing: React.FC<{ progress: number; radius: number; color: string; delay: number }> = ({ progress, radius, color, delay }) => {
  const circumference = 2 * Math.PI * radius;
  return (
    <motion.circle
      cx="50"
      cy="50"
      r={radius}
      stroke={color}
      strokeWidth="6"
      fill="none"
      strokeLinecap="round"
      transform="rotate(-90 50 50)"
      initial={{ strokeDashoffset: circumference }}
      animate={{ strokeDashoffset: circumference - (progress / 100) * circumference }}
      transition={{ duration: 1, delay, ease: "circOut" }}
      strokeDasharray={circumference}
    />
  );
};

const GoalProgress: React.FC<GoalProgressProps> = ({ daily, weekly, monthly }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <svg viewBox="0 0 100 100" className="w-48 h-48">
        <circle cx="50" cy="50" r="45" stroke="#2a2a2a" strokeWidth="6" fill="none" />
        <circle cx="50" cy="50" r="35" stroke="#2a2a2a" strokeWidth="6" fill="none" />
        <circle cx="50" cy="50" r="25" stroke="#2a2a2a" strokeWidth="6" fill="none" />
        <ProgressRing progress={monthly} radius={45} color="#aaaaaa" delay={0.6} />
        <ProgressRing progress={weekly} radius={35} color="#888888" delay={0.3} />
        <ProgressRing progress={daily} radius={25} color="#666666" delay={0} />
      </svg>
      <div className="ml-6 space-y-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#666666] mr-3" />
          <div>
            <div className="text-text-muted text-sm">Daily Goal</div>
            <div className="text-text-primary font-bold">{Math.round(daily)}%</div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#888888] mr-3" />
          <div>
            <div className="text-text-muted text-sm">Weekly Goal</div>
            <div className="text-text-primary font-bold">{Math.round(weekly)}%</div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#aaaaaa] mr-3" />
          <div>
            <div className="text-text-muted text-sm">Monthly Goal</div>
            <div className="text-text-primary font-bold">{Math.round(monthly)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalProgress;
