import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, Plus, Settings, BarChart3, Focus, Download, Upload } from 'lucide-react';
import { ViewType } from '../types';

interface Command {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onViewChange: (view: ViewType) => void;
  onAddTask: () => void;
  onExportData: () => void;
  onImportData: (file: File) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onViewChange,
  onAddTask,
  onExportData,
  onImportData,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    {
      id: 'add-task',
      title: 'Add Task',
      description: 'Create a new task',
      icon: <Plus className="w-4 h-4" />,
      action: onAddTask,
      category: 'Actions',
    },
    {
      id: 'view-month',
      title: 'Month View',
      description: 'Switch to monthly calendar view',
      icon: <Calendar className="w-4 h-4" />,
      action: () => onViewChange('month'),
      category: 'Navigation',
    },
    {
      id: 'view-week',
      title: 'Week View',
      description: 'Switch to weekly calendar view',
      icon: <Calendar className="w-4 h-4" />,
      action: () => onViewChange('week'),
      category: 'Navigation',
    },
    {
      id: 'view-day',
      title: 'Day View',
      description: 'Switch to daily calendar view',
      icon: <Calendar className="w-4 h-4" />,
      action: () => onViewChange('day'),
      category: 'Navigation',
    },
    {
      id: 'view-analytics',
      title: 'Analytics',
      description: 'View productivity analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      action: () => onViewChange('analytics'),
      category: 'Navigation',
    },
    {
      id: 'view-focus',
      title: 'Focus Mode',
      description: 'Enter distraction-free focus mode',
      icon: <Focus className="w-4 h-4" />,
      action: () => onViewChange('focus'),
      category: 'Navigation',
    },
    {
      id: 'export-data',
      title: 'Export Data',
      description: 'Download your data as backup',
      icon: <Download className="w-4 h-4" />,
      action: onExportData,
      category: 'Data',
    },
    {
      id: 'import-data',
      title: 'Import Data',
      description: 'Restore data from backup file',
      icon: <Upload className="w-4 h-4" />,
      action: () => fileInputRef.current?.click(),
      category: 'Data',
    },
  ];

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(query.toLowerCase()) ||
    command.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        onClose();
        setQuery('');
      }
    } else if (e.key === 'Escape') {
      onClose();
      setQuery('');
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportData(file);
      onClose();
      setQuery('');
    }
  };

  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, Command[]>);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="card-base w-full max-w-2xl max-h-96 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-light-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a command or search..."
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-text-primary placeholder-text-muted focus:outline-none"
                />
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {Object.entries(groupedCommands).map(([category, commands]) => (
                <div key={category} className="p-2">
                  <div className="px-2 py-1 text-xs font-medium text-text-muted uppercase tracking-wider">
                    {category}
                  </div>
                  {commands.map((command, index) => {
                    const globalIndex = filteredCommands.indexOf(command);
                    return (
                      <motion.div
                        key={command.id}
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                        className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                          selectedIndex === globalIndex
                            ? 'bg-light-border'
                            : 'hover:bg-light-border/50'
                        }`}
                        onClick={() => {
                          command.action();
                          onClose();
                          setQuery('');
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-text-muted">
                            {command.icon}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-text-primary">
                              {command.title}
                            </div>
                            <div className="text-xs text-text-muted">
                              {command.description}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
