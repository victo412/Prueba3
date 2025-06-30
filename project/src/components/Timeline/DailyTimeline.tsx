import React from 'react';
import { Task } from '../../types';
import { TimeSlot } from './TimeSlot';
import { generateTimeSlots } from '../../utils/helpers';
import { Loader2 } from 'lucide-react';

interface DailyTimelineProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
  onAddTask: (hour: number) => void;
  isLoading?: boolean;
}

export function DailyTimeline({ 
  tasks, 
  onTaskClick, 
  onTaskUpdate, 
  onTaskDelete, 
  onAddTask,
  isLoading = false
}: DailyTimelineProps) {
  const timeSlots = generateTimeSlots(6, 23);

  const getTasksForHour = (hour: number) => {
    return tasks.filter(task => {
      if (!task.startTime) return false;
      
      try {
        let taskHour: number;
        
        if (task.startTime.includes('T')) {
          // datetime-local format: "2024-01-20T14:00"
          const timePart = task.startTime.split('T')[1];
          taskHour = parseInt(timePart.split(':')[0]);
        } else if (task.startTime.includes(':')) {
          // Simple time format: "14:00"
          taskHour = parseInt(task.startTime.split(':')[0]);
        } else {
          return false;
        }
        
        return taskHour === hour;
      } catch (error) {
        console.error('Error parsing task time:', task.startTime, error);
        return false;
      }
    });
  };

  const getExtendedTasksForHour = (hour: number) => {
    const extendedTasks: { task: Task; position: 'start' | 'middle' | 'end' }[] = [];
    
    tasks.forEach(task => {
      if (!task.startTime || !task.duration) return;
      
      try {
        let taskStartHour: number;
        let taskStartMinute: number = 0;
        
        if (task.startTime.includes('T')) {
          const timePart = task.startTime.split('T')[1];
          const [hourStr, minuteStr] = timePart.split(':');
          taskStartHour = parseInt(hourStr);
          taskStartMinute = parseInt(minuteStr) || 0;
        } else if (task.startTime.includes(':')) {
          const [hourStr, minuteStr] = task.startTime.split(':');
          taskStartHour = parseInt(hourStr);
          taskStartMinute = parseInt(minuteStr) || 0;
        } else {
          return;
        }
        
        // Calculate how many hours this task spans
        const durationHours = Math.ceil(task.duration / 60);
        const taskEndHour = taskStartHour + durationHours;
        
        // Check if this hour is within the task's duration (but not the starting hour)
        if (hour > taskStartHour && hour < taskEndHour) {
          let position: 'start' | 'middle' | 'end' = 'middle';
          
          // If this is the last hour the task spans
          if (hour === taskEndHour - 1) {
            // Check if the task actually needs this full hour or just part of it
            const totalMinutesUsed = (hour - taskStartHour) * 60;
            const remainingMinutes = task.duration - totalMinutesUsed;
            
            if (remainingMinutes > 0) {
              position = 'end';
            } else {
              return; // Task doesn't actually extend into this hour
            }
          }
          
          extendedTasks.push({ task, position });
        }
      } catch (error) {
        console.error('Error calculating extended tasks:', error);
      }
    });
    
    return extendedTasks;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="timeline-gradient dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 p-6 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Cronograma del Día
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Organiza tu día en bloques de tiempo. Las tareas se extienden según su duración.
          </p>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Cargando tareas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
      <div className="timeline-gradient dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 p-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Cronograma del Día
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Organiza tu día en bloques de tiempo. Las tareas se extienden según su duración.
            </p>
          </div>
          
          {tasks.length > 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {tasks.length} tarea{tasks.length !== 1 ? 's' : ''} programada{tasks.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      <div className="max-h-[600px] overflow-y-auto scrollbar-hide">
        {timeSlots.map((timeSlot) => {
          const hour = parseInt(timeSlot.split(':')[0]);
          const hourTasks = getTasksForHour(hour);
          const extendedTasks = getExtendedTasksForHour(hour);
          
          return (
            <TimeSlot
              key={timeSlot}
              hour={hour}
              tasks={hourTasks}
              extendedTasks={extendedTasks}
              onTaskClick={onTaskClick}
              onTaskUpdate={onTaskUpdate}
              onTaskDelete={onTaskDelete}
              onAddTask={onAddTask}
            />
          );
        })}
      </div>
    </div>
  );
}