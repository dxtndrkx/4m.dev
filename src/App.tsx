import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Task, Goal, ViewType, Calendar, AppSettings, ProductivityStats } from './types';
import { 
  saveTasks, loadTasks, saveGoals, loadGoals, saveCalendars, loadCalendars,
  saveSettings, loadSettings, saveStats, loadStats, exportData, importData
} from './utils/localStorage';
import { detectTaskConflicts, exportToICS } from './utils/calendarUtils';
import Header from './components/Header';
import MonthView from './components/views/MonthView';
import WeekView from './components/views/WeekView';
import DayView from './components/views/DayView';
import AnalyticsView from './components/views/AnalyticsView';
import FocusView from './components/views/FocusView';
import DashboardView from './components/views/DashboardView';
import EnhancedTaskModal from './components/EnhancedTaskModal';
import GoalsBar from './components/GoalsBar';
import CalendarSidebar from './components/CalendarSidebar';
import CommandPalette from './components/CommandPalette';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [settings, setSettings] = useState<AppSettings>();
  const [stats, setStats] = useState<ProductivityStats[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [taskModalDate, setTaskModalDate] = useState<Date>(new Date());
  const [taskModalTime, setTaskModalTime] = useState<string>('');
  const [saveIndicator, setSaveIndicator] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showCalendarSidebar, setShowCalendarSidebar] = useState(true);
  const [conflicts, setConflicts] = useState<ReturnType<typeof detectTaskConflicts>>([]);

  // Load data on mount
  useEffect(() => {
    setTasks(loadTasks());
    setGoals(loadGoals());
    setCalendars(loadCalendars());
    setSettings(loadSettings());
    setStats(loadStats());
  }, []);

  // Save tasks when they change
  useEffect(() => {
    if (tasks.length > 0 || localStorage.getItem('4m_tasks')) {
      saveTasks(tasks);
      showSaveIndicator();
      
      // Detect conflicts if enabled
      if (settings?.smartConflictDetection) {
        setConflicts(detectTaskConflicts(tasks));
      }
    }
  }, [tasks, settings]);

  // Save other data when changed
  useEffect(() => {
    saveGoals(goals);
    showSaveIndicator();
  }, [goals]);

  useEffect(() => {
    saveCalendars(calendars);
  }, [calendars]);

  useEffect(() => {
    if (settings) {
      saveSettings(settings);
    }
  }, [settings]);

  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  const showSaveIndicator = () => {
    setSaveIndicator(true);
    setTimeout(() => setSaveIndicator(false), 2000);
  };

  const handleAddTask = (date: Date, time?: string) => {
    setTaskModalDate(date);
    setTaskModalTime(time || '09:00');
    setEditingTask(undefined);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskModalDate(new Date(task.date));
    setTaskModalTime(task.startTime);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id'>) => {
    if (editingTask) {
      setTasks(tasks.map(task => 
        task.id === editingTask.id 
          ? { ...taskData, id: editingTask.id }
          : task
      ));
    } else {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      };
      setTasks([...tasks, newTask]);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setCurrentView('day');
  };

  const handleSaveGoal = (goalData: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    setGoals([...goals, newGoal]);
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  const handleUpdateGoal = (goalId: string, updates: Partial<Goal>) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, ...updates }
        : goal
    ));
  };

  const handleToggleCalendarVisibility = (calendarId: string) => {
    setCalendars(calendars.map(calendar =>
      calendar.id === calendarId
        ? { ...calendar, visible: !calendar.visible }
        : calendar
    ));
  };

  const handleExportData = () => {
    exportData();
  };

  const handleImportData = async (file: File) => {
    const success = await importData(file);
    if (success) {
      // Reload data
      setTasks(loadTasks());
      setGoals(loadGoals());
      setCalendars(loadCalendars());
      setSettings(loadSettings());
      setStats(loadStats());
      showSaveIndicator();
    }
  };

  const handleExportICS = () => {
    const icsContent = exportToICS(tasks, calendars);
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `4m-calendar-${new Date().toISOString().split('T')[0]}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target && ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
        return;
      }

      switch (e.key) {
        case 'd':
          setCurrentView('dashboard');
          break;
        case '1':
          setCurrentView('month');
          break;
        case '2':
          setCurrentView('week');
          break;
        case '3':
          setCurrentView('day');
          break;
        case '4':
          setCurrentView('analytics');
          break;
        case '5':
          setCurrentView('focus');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderView = () => {
    const visibleCalendars = calendars.filter(c => c.visible);
    const filteredTasks = tasks.filter(task => 
      visibleCalendars.some(c => c.id === task.calendarId)
    );

    const commonProps = {
      selectedDate,
      tasks: filteredTasks,
      onTaskClick: handleEditTask,
      onAddTask: handleAddTask,
      onToggleComplete: handleToggleComplete,
    };

    switch (currentView) {
      case 'dashboard':
        return <DashboardView tasks={filteredTasks} goals={goals} />;
      case 'month':
        return <MonthView {...commonProps} onDateClick={handleDateClick} />;
      case 'week':
        return <WeekView {...commonProps} />;
      case 'day':
        return <DayView {...commonProps} />;
      case 'analytics':
        return <AnalyticsView tasks={filteredTasks} goals={goals} stats={stats} selectedDate={selectedDate} />;
      case 'focus':
        return <FocusView tasks={filteredTasks} selectedDate={selectedDate} onToggleComplete={handleToggleComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-app-bg ${settings?.theme === 'light' ? 'light' : 'dark'}`}>
      <Header
        currentView={currentView}
        selectedDate={selectedDate}
        onViewChange={setCurrentView}
        onDateChange={setSelectedDate}
        onToggleSidebar={() => setShowCalendarSidebar(!showCalendarSidebar)}
        onExportICS={handleExportICS}
      />

      <div className="flex">
        {showCalendarSidebar && (
          <CalendarSidebar
            calendars={calendars}
            onToggleVisibility={handleToggleCalendarVisibility}
            onAddCalendar={() => {/* TODO: Implement */}}
            onEditCalendar={() => {/* TODO: Implement */}}
            onDeleteCalendar={() => {/* TODO: Implement */}}
          />
        )}

        <main className="flex-1 max-w-7xl mx-auto overflow-y-auto">
          {currentView !== 'focus' && currentView !== 'dashboard' && (
            <div className="px-4 sm:px-6 lg:px-8">
              <GoalsBar
                goals={goals}
                selectedDate={selectedDate}
                onSaveGoal={handleSaveGoal}
                onDeleteGoal={handleDeleteGoal}
                onUpdateGoal={handleUpdateGoal}
              />
            </div>
          )}

          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
          >
            {renderView()}
          </motion.div>
        </main>
      </div>

      <EnhancedTaskModal
        isOpen={isTaskModalOpen}
        task={editingTask}
        selectedDate={taskModalDate}
        calendars={calendars}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />

      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onViewChange={setCurrentView}
        onAddTask={() => handleAddTask(selectedDate)}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />

      {conflicts.length > 0 && settings?.smartConflictDetection && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-20 right-4 bg-yellow-600 text-white p-4 rounded-lg shadow-lg max-w-sm"
        >
          <div className="font-medium mb-1">⚠️ Schedule Conflicts</div>
          <div className="text-sm">
            {conflicts.length} task{conflicts.length > 1 ? 's have' : ' has'} timing conflicts
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: saveIndicator ? 1 : 0, y: saveIndicator ? 0 : 50 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        ✓ Saved
      </motion.div>

      <div className="fixed bottom-4 left-4 text-text-muted text-sm hidden md:block">
        <div className="bg-card-base p-3 rounded-lg border border-light-border">
          <div className="font-medium mb-1">Shortcuts:</div>
          <div>D: Dashboard • 1-5: Views • Cmd+K: Palette</div>
        </div>
      </div>
    </div>
  );
}

export default App;
