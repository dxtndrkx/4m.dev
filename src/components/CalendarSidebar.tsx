import React from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Plus, Edit, Trash2 } from 'lucide-react';
import { Calendar } from '../types';

interface CalendarSidebarProps {
  calendars: Calendar[];
  onToggleVisibility: (calendarId: string) => void;
  onAddCalendar: () => void;
  onEditCalendar: (calendar: Calendar) => void;
  onDeleteCalendar: (calendarId: string) => void;
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  calendars,
  onToggleVisibility,
  onAddCalendar,
  onEditCalendar,
  onDeleteCalendar,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-64 card-base p-4 m-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Calendars</h3>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onAddCalendar}
          className="p-2 rounded-lg hover:bg-light-border transition-colors"
        >
          <Plus className="w-4 h-4 text-text-muted" />
        </motion.button>
      </div>

      <div className="space-y-2">
        {calendars.map((calendar) => (
          <motion.div
            key={calendar.id}
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-light-border/50 transition-colors group"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onToggleVisibility(calendar.id)}
              className="flex-shrink-0"
            >
              {calendar.visible ? (
                <Eye className="w-4 h-4 text-text-muted" />
              ) : (
                <EyeOff className="w-4 h-4 text-text-muted opacity-50" />
              )}
            </motion.button>

            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: calendar.color }}
            />

            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-text-primary truncate">
                {calendar.name}
              </div>
              {calendar.description && (
                <div className="text-xs text-text-muted truncate">
                  {calendar.description}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onEditCalendar(calendar)}
                className="p-1 rounded hover:bg-light-border transition-colors"
              >
                <Edit className="w-3 h-3 text-text-muted" />
              </motion.button>
              {calendars.length > 1 && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onDeleteCalendar(calendar.id)}
                  className="p-1 rounded hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CalendarSidebar;
