import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Clock, Flag, Tag, Plus, Trash2, 
  CheckSquare, Square, Hash, Bell, Calendar as CalendarIcon
} from 'lucide-react';
import { Task, Calendar, Subtask, ChecklistItem } from '../types';
import { formatDate } from '../utils/dateUtils';

interface EnhancedTaskModalProps {
  isOpen: boolean;
  task?: Task;
  selectedDate: Date;
  calendars: Calendar[];
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'>) => void;
  onDelete?: (taskId: string) => void;
}

const EnhancedTaskModal: React.FC<EnhancedTaskModalProps> = ({
  isOpen,
  task,
  selectedDate,
  calendars,
  onClose,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(formatDate(selectedDate));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState<'study' | 'interview' | 'project' | 'revision' | 'other'>('study');
  const [calendarId, setCalendarId] = useState(calendars[0]?.id || '');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [reminder, setReminder] = useState<number | undefined>();
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setDate(task.date);
      setStartTime(task.startTime);
      setEndTime(task.endTime);
      setPriority(task.priority);
      setCategory(task.category);
      setCalendarId(task.calendarId);
      setTags(task.tags || []);
      setSubtasks(task.subtasks || []);
      setChecklistItems(task.checklistItems || []);
      setReminder(task.reminder);
      setNotes(task.notes || '');
    } else {
      setTitle('');
      setDescription('');
      setDate(formatDate(selectedDate));
      setStartTime('09:00');
      setEndTime('10:00');
      setPriority('medium');
      setCategory('study');
      setCalendarId(calendars[0]?.id || '');
      setTags([]);
      setSubtasks([]);
      setChecklistItems([]);
      setReminder(undefined);
      setNotes('');
    }
  }, [task, selectedDate, calendars]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      date,
      startTime,
      endTime,
      priority,
      category,
      calendarId,
      tags,
      subtasks,
      checklistItems,
      dependencies: task?.dependencies || [],
      reminder,
      notes: notes.trim(),
      completed: task?.completed || false,
    });

    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      const subtask: Subtask = {
        id: Date.now().toString(),
        title: newSubtask.trim(),
        completed: false,
        order: subtasks.length,
      };
      setSubtasks([...subtasks, subtask]);
      setNewSubtask('');
    }
  };

  const toggleSubtask = (subtaskId: string) => {
    setSubtasks(subtasks.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    ));
  };

  const removeSubtask = (subtaskId: string) => {
    setSubtasks(subtasks.filter(st => st.id !== subtaskId));
  };

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      const item: ChecklistItem = {
        id: Date.now().toString(),
        text: newChecklistItem.trim(),
        checked: false,
        order: checklistItems.length,
      };
      setChecklistItems([...checklistItems, item]);
      setNewChecklistItem('');
    }
  };

  const toggleChecklistItem = (itemId: string) => {
    setChecklistItems(checklistItems.map(item => 
      item.id === itemId ? { ...item, checked: !item.checked } : item
    ));
  };

  const removeChecklistItem = (itemId: string) => {
    setChecklistItems(checklistItems.filter(item => item.id !== itemId));
  };

  const selectedCalendar = calendars.find(c => c.id === calendarId);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="card-base w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  {selectedCalendar && (
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: selectedCalendar.color }}
                    />
                  )}
                  <h2 className="text-xl font-semibold text-text-primary">
                    {task ? 'Edit Task' : 'Create Task'}
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-light-border transition-colors"
                >
                  <X className="w-5 h-5 text-text-muted" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-app-bg border border-light-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-from"
                      placeholder="Enter task title..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-app-bg border border-light-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-from resize-none"
                      placeholder="Add description..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                      <CalendarIcon className="w-4 h-4 inline mr-1" />
                      Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 bg-app-bg border border-light-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-from"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Start
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2 bg-app-bg border border-light-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-from"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                      End
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-3 py-2 bg-app-bg border border-light-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-from"
                      required
                    />
                  </div>
                </div>

                {/* Calendar and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                      Calendar
                    </label>
                    <select
                      value={calendarId}
                      onChange={(e) => setCalendarId(e.target.value)}
                      className="w-full px-3 py-2 bg-app-bg border border-light-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-from"
                    >
                      {calendars.map((calendar) => (
                        <option key={calendar.id} value={calendar.id}>
                          {calendar.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                      <Tag className="w-4 h-4 inline mr-1" />
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-app-bg border border-light-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-from"
                    >
                      <option value="study">📚 Study</option>
                      <option value="interview">💼 Interview</option>
                      <option value="project">🛠️ Project</option>
                      <option value="revision">🔄 Revision</option>
                      <option value="other">📝 Other</option>
                    </select>
                  </div>
                </div>

                {/* Priority and Reminder */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                      <Flag className="w-4 h-4 inline mr-1" />
                      Priority
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['low', 'medium', 'high'] as const).map((p) => (
                        <motion.button
                          key={p}
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setPriority(p)}
                          className={`px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                            priority === p
                              ? p === 'high' ? 'bg-red-600 border-red-600 text-white' :
                                p === 'medium' ? 'bg-yellow-600 border-yellow-600 text-white' :
                                'bg-green-600 border-green-600 text-white'
                              : 'border-light-border text-text-muted hover:border-accent-from'
                          }`}
                        >
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                      <Bell className="w-4 h-4 inline mr-1" />
                      Reminder
                    </label>
                    <select
                      value={reminder || ''}
                      onChange={(e) => setReminder(e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-3 py-2 bg-app-bg border border-light-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-from"
                    >
                      <option value="">No reminder</option>
                      <option value="5">5 minutes before</option>
                      <option value="15">15 minutes before</option>
                      <option value="30">30 minutes before</option>
                      <option value="60">1 hour before</option>
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-2">
                    <Hash className="w-4 h-4 inline mr-1" />
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center space-x-1 px-2 py-1 bg-accent-from/20 text-accent-from rounded-md text-sm"
                      >
                        <span>#{tag}</span>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.8 }}
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-accent-from/70 hover:text-accent-from"
                        >
                          <X className="w-3 h-3" />
                        </motion.button>
                      </motion.span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-3 py-2 bg-app-bg border border-light-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-from"
                      placeholder="Add tag..."
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={addTag}
                      className="btn-secondary"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Subtasks */}
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-2">
                    Subtasks
                  </label>
                  <div className="space-y-2 mb-3">
                    {subtasks.map((subtask) => (
                      <div key={subtask.id} className="flex items-center space-x-2 p-2 bg-app-bg rounded-lg border border-light-border">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => toggleSubtask(subtask.id)}
                          className="text-accent-from"
                        >
                          {subtask.completed ? (
                            <CheckSquare className="w-4 h-4" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </motion.button>
                        <span className={`flex-1 text-sm ${
                          subtask.completed ? 'line-through text-text-muted' : 'text-text-primary'
                        }`}>
                          {subtask.title}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => removeSubtask(subtask.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </motion.button>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                      className="flex-1 px-3 py-2 bg-app-bg border border-light-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-from"
                      placeholder="Add subtask..."
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={addSubtask}
                      className="btn-secondary"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-2">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-app-bg border border-light-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-from resize-none"
                    placeholder="Additional notes..."
                    rows={3}
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-between pt-4 border-t border-light-border">
                  {task && onDelete && (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        onDelete(task.id);
                        onClose();
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete Task
                    </motion.button>
                  )}
                  <div className="flex space-x-3 ml-auto">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClose}
                      className="btn-secondary"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary"
                    >
                      {task ? 'Update Task' : 'Create Task'}
                    </motion.button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnhancedTaskModal;
