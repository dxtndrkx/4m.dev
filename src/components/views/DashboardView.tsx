import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Task, Goal } from '../../types';
import { processDashboardData } from '../../utils/dashboardUtils';
import KpiCard from '../dashboard/KpiCard';
import ProductivityLineChart from '../dashboard/ProductivityLineChart';
import CategoryBarChart from '../dashboard/CategoryBarChart';
import SkillRadarChart from '../dashboard/SkillRadarChart';
import Heatmap from '../dashboard/Heatmap';
import GoalProgress from '../dashboard/GoalProgress';
import SuggestionsPanel from '../dashboard/SuggestionsPanel';
import { CheckCircle, Zap, Percent, Activity } from 'lucide-react';

interface DashboardViewProps {
  tasks: Task[];
  goals: Goal[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ tasks, goals }) => {
  const data = useMemo(() => processDashboardData(tasks, goals, 35), [tasks, goals]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-6 space-y-6"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-muted">Your 30-day productivity snapshot.</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        variants={container}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <KpiCard title="Tasks Completed Today" value={data.kpis.completedToday} icon={<CheckCircle className="w-6 h-6" />} color="text-green-400" />
        <KpiCard title="Productivity Streak" value={`${data.kpis.weeklyStreak} Days`} icon={<Zap className="w-6 h-6" />} color="text-yellow-400" />
        <KpiCard title="Completion Rate" value={`${data.kpis.completionRate}%`} icon={<Percent className="w-6 h-6" />} color="text-blue-400" />
        <KpiCard title="Avg. Daily Tasks" value={data.kpis.avgDailyProductivity} icon={<Activity className="w-6 h-6" />} color="text-purple-400" />
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={item} className="card-base p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Productivity Over Time</h3>
            <ProductivityLineChart data={data.productivityOverTime} />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={item} className="card-base p-6">
              <h3 className="text-xl font-semibold text-text-primary mb-4">Category Time Breakdown (hrs)</h3>
              <CategoryBarChart data={data.categoryBreakdown} />
            </motion.div>
            <motion.div variants={item} className="card-base p-6">
              <h3 className="text-xl font-semibold text-text-primary mb-4">Skill Focus Balance</h3>
              <SkillRadarChart data={data.radarData} />
            </motion.div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <motion.div variants={item} className="card-base p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Completion Heatmap</h3>
            <Heatmap data={data.heatmapData} />
          </motion.div>
          <motion.div variants={item} className="card-base p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Goal Progress</h3>
            <GoalProgress {...data.goalProgress} />
          </motion.div>
          <motion.div variants={item}>
             <h3 className="text-xl font-semibold text-text-primary mb-4">Suggestions</h3>
            <SuggestionsPanel suggestions={data.suggestions} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardView;
