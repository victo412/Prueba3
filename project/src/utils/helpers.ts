import { format, addHours, startOfDay } from 'date-fns';

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function formatTime(date: Date): string {
  return format(date, 'HH:mm');
}

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function parseTimeString(timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export function generateTimeSlots(startHour: number = 6, endHour: number = 23): string[] {
  const slots: string[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  return slots;
}

// Category colors for borders and backgrounds
export function getTaskCategoryColor(category: string): string {
  const colors = {
    work: 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700',
    personal: 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700',
    health: 'bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700',
    learning: 'bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700',
    social: 'bg-pink-50 dark:bg-pink-900/20 text-pink-800 dark:text-pink-300 border-pink-200 dark:border-pink-700',
  };
  return colors[category as keyof typeof colors] || 'bg-gray-50 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
}

// Category colors for task card borders (main visual indicator)
export function getTaskCategoryBorderColor(category: string): string {
  const colors = {
    work: 'border-l-4 border-l-blue-500',
    personal: 'border-l-4 border-l-green-500',
    health: 'border-l-4 border-l-purple-500',
    learning: 'border-l-4 border-l-orange-500',
    social: 'border-l-4 border-l-pink-500',
  };
  return colors[category as keyof typeof colors] || 'border-l-4 border-l-gray-500';
}

// Priority colors for small indicators
export function getPriorityColor(priority: string): string {
  const colors = {
    high: 'text-red-600 dark:text-red-400',
    medium: 'text-yellow-600 dark:text-yellow-400',
    low: 'text-green-600 dark:text-green-400',
  };
  return colors[priority as keyof typeof colors] || 'text-gray-600 dark:text-gray-400';
}

// Priority background colors for badges
export function getPriorityBadgeColor(priority: string): string {
  const colors = {
    high: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700',
    medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700',
    low: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700',
  };
  return colors[priority as keyof typeof colors] || 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
}

// Category display names
export function getCategoryDisplayName(category: string): string {
  const names = {
    work: 'Trabajo',
    personal: 'Personal',
    health: 'Salud',
    learning: 'Aprendizaje',
    social: 'Social',
  };
  return names[category as keyof typeof names] || category;
}

// Priority display names
export function getPriorityDisplayName(priority: string): string {
  const names = {
    high: 'Alta',
    medium: 'Media',
    low: 'Baja',
  };
  return names[priority as keyof typeof names] || priority;
}

// Category color dots for legend and selectors
export function getCategoryColorDot(category: string): string {
  const colors = {
    work: 'bg-blue-500',
    personal: 'bg-green-500',
    health: 'bg-purple-500',
    learning: 'bg-orange-500',
    social: 'bg-pink-500',
  };
  return colors[category as keyof typeof colors] || 'bg-gray-500';
}

// Priority color dots for legend and selectors
export function getPriorityColorDot(priority: string): string {
  const colors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
  };
  return colors[priority as keyof typeof colors] || 'bg-gray-500';
}

export function calculateDuration(startTime: string, endTime: string): number {
  try {
    let start: Date;
    let end: Date;

    // Handle different time formats
    if (startTime.includes('T')) {
      start = new Date(startTime);
    } else {
      start = parseTimeString(startTime);
    }

    if (endTime.includes('T')) {
      end = new Date(endTime);
    } else {
      end = parseTimeString(endTime);
    }

    const duration = (end.getTime() - start.getTime()) / (1000 * 60); // Duration in minutes
    return Math.max(0, duration); // Ensure non-negative duration
  } catch (error) {
    console.error('Error calculating duration:', error);
    return 60; // Default to 1 hour
  }
}

// Helper function to format datetime for display
export function formatDateTime(dateTimeString: string): string {
  try {
    const date = new Date(dateTimeString);
    return format(date, 'HH:mm');
  } catch (error) {
    return dateTimeString;
  }
}

// Helper function to get current hour for default task creation
export function getCurrentHour(): number {
  return new Date().getHours();
}

// Helper function to create datetime string for today at specific hour
export function createTodayDateTime(hour: number, minute: number = 0): string {
  const today = new Date();
  today.setHours(hour, minute, 0, 0);
  return today.toISOString().slice(0, 16); // Format for datetime-local input
}