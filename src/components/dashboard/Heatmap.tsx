import React from 'react';
import { motion } from 'framer-motion';

interface HeatmapProps {
  data: { date: string; count: number }[];
}

const Heatmap: React.FC<HeatmapProps> = ({ data }) => {
  const getColor = (count: number) => {
    if (count === 0) return 'bg-light-border/20';
    if (count <= 2) return 'bg-accent-from/40';
    if (count <= 5) return 'bg-accent-from/60';
    if (count <= 8) return 'bg-accent-to/80';
    return 'bg-accent-to';
  };

  return (
    <div className="grid grid-cols-7 gap-1.5">
      {data.map(({ date, count }, index) => (
        <motion.div
          key={date}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.01 }}
          className={`w-full aspect-square rounded ${getColor(count)}`}
          title={`${date}: ${count} tasks completed`}
        />
      ))}
    </div>
  );
};

export default Heatmap;
