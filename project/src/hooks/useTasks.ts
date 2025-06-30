import { useState, useCallback, useEffect } from 'react';
import { Task, TaskStatus } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load tasks from Supabase
  const loadTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading tasks:', error);
        return;
      }

      // Transform Supabase data to our Task interface
      const transformedTasks: Task[] = (data || []).map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        startTime: task.scheduled_start ? formatDateTimeForDisplay(task.scheduled_start) : '',
        duration: calculateDurationFromTimes(task.scheduled_start, task.scheduled_end),
        category: mapCategoryFromDB(task.project_id ? 'work' : 'personal'),
        status: mapStatusFromDB(task.status),
        priority: mapPriorityFromDB(task.priority),
        project: task.project_id || '',
        contextTag: '',
      }));

      setTasks(transformedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load tasks when user changes
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addTask = useCallback(async (taskData: Omit<Task, 'id'>) => {
    if (!user) return null;

    try {
      // Convert datetime-local format to proper ISO string
      const startTime = taskData.startTime ? convertToUTCString(taskData.startTime) : null;
      const endTime = startTime ? calculateEndTime(startTime, taskData.duration) : null;

      const dbTask = {
        user_id: user.id,
        title: taskData.title,
        description: taskData.description || null,
        status: mapStatusToDB(taskData.status),
        priority: mapPriorityToDB(taskData.priority),
        scheduled_start: startTime,
        scheduled_end: endTime,
        value_score: null,
        project_id: null,
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([dbTask])
        .select()
        .single();

      if (error) {
        console.error('Error adding task:', error);
        return null;
      }

      // Transform back to our Task interface
      const newTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        startTime: data.scheduled_start ? formatDateTimeForDisplay(data.scheduled_start) : '',
        duration: taskData.duration,
        category: taskData.category,
        status: mapStatusFromDB(data.status),
        priority: mapPriorityFromDB(data.priority),
        project: taskData.project || '',
        contextTag: taskData.contextTag || '',
      };

      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (error) {
      console.error('Error adding task:', error);
      return null;
    }
  }, [user]);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    if (!user) return;

    try {
      const dbUpdates: any = {};
      
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.status !== undefined) dbUpdates.status = mapStatusToDB(updates.status);
      if (updates.priority !== undefined) dbUpdates.priority = mapPriorityToDB(updates.priority);
      
      if (updates.startTime !== undefined) {
        dbUpdates.scheduled_start = updates.startTime ? convertToUTCString(updates.startTime) : null;
        
        // If duration is also being updated or we have the current task data
        const currentTask = tasks.find(t => t.id === id);
        const duration = updates.duration !== undefined ? updates.duration : currentTask?.duration || 60;
        
        if (dbUpdates.scheduled_start) {
          dbUpdates.scheduled_end = calculateEndTime(dbUpdates.scheduled_start, duration);
        }
      }
      
      if (updates.duration !== undefined) {
        // If we're updating duration, we need to recalculate end time
        const currentTask = tasks.find(t => t.id === id);
        const startTime = updates.startTime !== undefined ? updates.startTime : currentTask?.startTime;
        
        if (startTime) {
          const startTimeUTC = convertToUTCString(startTime);
          dbUpdates.scheduled_end = calculateEndTime(startTimeUTC, updates.duration);
        }
      }

      const { error } = await supabase
        .from('tasks')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating task:', error);
        return;
      }

      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, ...updates } : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }, [user, tasks]);

  const deleteTask = useCallback(async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting task:', error);
        return;
      }

      setTasks(prev => prev.filter(task => task.id !== id));
      if (selectedTask?.id === id) {
        setSelectedTask(null);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }, [user, selectedTask]);

  const updateTaskStatus = useCallback(async (id: string, status: TaskStatus) => {
    await updateTask(id, { status });
  }, [updateTask]);

  const getTasksByDate = useCallback((date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return tasks.filter(task => {
      if (!task.startTime) return false;
      const taskDate = task.startTime.split('T')[0];
      return taskDate === dateString;
    });
  }, [tasks]);

  return {
    tasks,
    selectedTask,
    setSelectedTask,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getTasksByDate,
    isLoading,
    refreshTasks: loadTasks,
  };
}

// Helper function to convert datetime-local format to UTC string for database
function convertToUTCString(dateTimeLocal: string): string {
  if (!dateTimeLocal) return '';
  
  // If it's already an ISO string, return as is
  if (dateTimeLocal.includes('Z') || dateTimeLocal.includes('+')) {
    return dateTimeLocal;
  }
  
  // For datetime-local format (YYYY-MM-DDTHH:mm), treat as local time
  const date = new Date(dateTimeLocal);
  return date.toISOString();
}

// Helper function to calculate end time based on start time and duration
function calculateEndTime(startTimeISO: string, durationMinutes: number): string {
  const startDate = new Date(startTimeISO);
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
  return endDate.toISOString();
}

// Helper function to calculate duration from start and end times
function calculateDurationFromTimes(startTime: string | null, endTime: string | null): number {
  if (!startTime || !endTime) return 60; // Default 1 hour
  
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = Math.round(durationMs / (1000 * 60));
    return Math.max(15, durationMinutes); // Minimum 15 minutes
  } catch (error) {
    console.error('Error calculating duration:', error);
    return 60;
  }
}

// Helper function to format database datetime for display in datetime-local input
function formatDateTimeForDisplay(isoString: string): string {
  if (!isoString) return '';
  
  try {
    const date = new Date(isoString);
    // Convert to local time and format for datetime-local input
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return isoString;
  }
}

// Helper functions to map between our interface and database schema
function mapStatusToDB(status: TaskStatus): string {
  const statusMap = {
    'scheduled': 'todo',
    'in-progress': 'in_progress',
    'completed': 'done',
    'postponed': 'skipped',
  };
  return statusMap[status] || 'todo';
}

function mapStatusFromDB(status: string): TaskStatus {
  const statusMap = {
    'todo': 'scheduled',
    'in_progress': 'in-progress',
    'done': 'completed',
    'skipped': 'postponed',
  };
  return (statusMap[status] as TaskStatus) || 'scheduled';
}

function mapPriorityToDB(priority: string): number {
  const priorityMap = {
    'low': 1,
    'medium': 3,
    'high': 5,
  };
  return priorityMap[priority as keyof typeof priorityMap] || 3;
}

function mapPriorityFromDB(priority: number): string {
  if (priority <= 2) return 'low';
  if (priority >= 4) return 'high';
  return 'medium';
}

function mapCategoryFromDB(category: string): string {
  return category || 'work';
}