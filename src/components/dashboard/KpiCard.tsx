import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, color }) => {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={item}
      whileHover={{ scale: 1.03, y: -5 }}
      className="card-base p-6 transition-all duration-200 hover:shadow-lift"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br from-accent-from/10 to-accent-to/10 ${color}`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-text-primary mb-1">
        {value}
      </div>
      <div className="text-sm text-text-muted">
        {title}
      </div>
    </motion.div>
  );
};

export default KpiCard;
