import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Target, Menu, Download, BarChart3, Focus, LayoutDashboard } from 'lucide-react';
import { ViewType } from '../types';
import { format, addDays, addWeeks, addMonths, subDays, subWeeks, subMonths } from 'date-fns';

interface HeaderProps {
  currentView: ViewType;
  selectedDate: Date;
  onViewChange: (view: ViewType) => void;
  onDateChange: (date: Date) => void;
  onToggleSidebar?: () => void;
  onExportICS?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentView,
  selectedDate,
  onViewChange,
  onDateChange,
  onToggleSidebar,
  onExportICS,
}) => {
  const navigateDate = (direction: 'prev' | 'next') => {
    let newDate = selectedDate;
    
    if (direction === 'prev') {
      switch (currentView) {
        case 'day':
          newDate = subDays(selectedDate, 1);
          break;
        case 'week':
          newDate = subWeeks(selectedDate, 1);
          break;
        case 'month':
          newDate = subMonths(selectedDate, 1);
          break;
      }
    } else {
      switch (currentView) {
        case 'day':
          newDate = addDays(selectedDate, 1);
          break;
        case 'week':
          newDate = addWeeks(selectedDate, 1);
          break;
        case 'month':
          newDate = addMonths(selectedDate, 1);
          break;
      }
    }
    
    onDateChange(newDate);
  };

  const getDateTitle = () => {
    switch (currentView) {
      case 'day':
        return format(selectedDate, 'EEEE, MMMM d, yyyy');
      case 'week':
      case 'month':
        return format(selectedDate, 'MMMM yyyy');
      case 'analytics':
        return 'Productivity Analytics';
      case 'focus':
        return 'Focus Mode';
      case 'dashboard':
        return 'Productivity Dashboard';
      default:
        return '';
    }
  };

  const viewIcons = {
    dashboard: LayoutDashboard,
    month: Calendar,
    week: Calendar,
    day: Calendar,
    analytics: BarChart3,
    focus: Focus,
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 backdrop-blur-app bg-app-bg/90 border-b border-light-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Sidebar Toggle */}
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleSidebar}
              className="p-2 rounded-lg hover:bg-light-border transition-colors md:hidden"
            >
              <Menu className="w-5 h-5 text-text-muted" />
            </motion.button>
            
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-accent-from to-accent-to rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-text-primary">4m</h1>
            </motion.div>
          </div>

          {/* Date Navigation & Title */}
          <div className="flex-grow flex items-center justify-center">
            {(currentView === 'day' || currentView === 'week' || currentView === 'month') ? (
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateDate('prev')}
                  className="p-2 rounded-lg hover:bg-light-border transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-text-muted" />
                </motion.button>
                
                <h2 className="text-lg font-semibold text-text-primary min-w-0 text-center">
                  {getDateTitle()}
                </h2>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateDate('next')}
                  className="p-2 rounded-lg hover:bg-light-border transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-text-muted" />
                </motion.button>
              </div>
            ) : (
              <h2 className="text-lg font-semibold text-text-primary">
                {getDateTitle()}
              </h2>
            )}
          </div>

          {/* Right side - View Switcher and Actions */}
          <div className="flex items-center space-x-3">
            {onExportICS && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onExportICS}
                className="p-2 rounded-lg hover:bg-light-border transition-colors"
                title="Export to Calendar"
              >
                <Download className="w-4 h-4 text-text-muted" />
              </motion.button>
            )}

            <div className="flex items-center space-x-1 bg-card-base rounded-lg p-1">
              {(['dashboard', 'month', 'week', 'day', 'analytics', 'focus'] as ViewType[]).map((view) => {
                const IconComponent = viewIcons[view];
                return (
                  <motion.button
                    key={view}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onViewChange(view)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                      currentView === view
                        ? 'bg-gradient-to-r from-accent-from to-accent-to text-white shadow-md'
                        : 'text-text-muted hover:text-text-primary hover:bg-light-border'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {view.charAt(0).toUpperCase() + view.slice(1)}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
