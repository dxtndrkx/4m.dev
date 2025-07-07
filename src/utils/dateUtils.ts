import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays, isSameDay, isSameMonth, isToday } from 'date-fns';

export const formatDate = (date: Date, formatStr: string = 'yyyy-MM-dd') => {
  return format(date, formatStr);
};

export const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const getWeekDays = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(addDays(start, i));
  }
  return days;
};

export const getMonthDays = (date: Date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const startWeek = startOfWeek(start, { weekStartsOn: 1 });
  const endWeek = endOfWeek(end, { weekStartsOn: 1 });
  
  const days = [];
  let current = startWeek;
  
  while (current <= endWeek) {
    days.push(current);
    current = addDays(current, 1);
  }
  
  return days;
};

export const getTimeSlots = () => {
  const slots = [];
  for (let hour = 7; hour <= 22; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  return slots;
};

export const isDateInRange = (date: Date, startDate: Date, endDate: Date) => {
  return date >= startDate && date <= endDate;
};

export const getDayName = (date: Date, short: boolean = false) => {
  return format(date, short ? 'EEE' : 'EEEE');
};

export const getMonthName = (date: Date, short: boolean = false) => {
  return format(date, short ? 'MMM' : 'MMMM');
};

export { isSameDay, isSameMonth, isToday };
