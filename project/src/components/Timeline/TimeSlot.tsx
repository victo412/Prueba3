import React from 'react';
import { Task } from '../../types';
import { TaskCard } from './TaskCard';

interface TimeSlotProps {
  hour: number;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
  onAddTask: (hour: number) => void;
  extendedTasks?: { task: Task; position: 'start' | 'middle' | 'end' }[]; // Tasks that extend into this slot
}

export function TimeSlot({ 
  hour, 
  tasks, 
  onTaskClick, 
  onTaskUpdate, 
  onTaskDelete, 
  onAddTask,
  extendedTasks = []
}: TimeSlotProps) {
  const timeString = `${hour.toString().padStart(2, '0')}:00`;
  const currentHour = new Date().getHours();
  const isCurrentHour = hour === currentHour;
  const isPastHour = hour < currentHour;

  const hasAnyTasks = tasks.length > 0 || extendedTasks.length > 0;

  return (
    <div className={`flex border-b border-gray-100 dark:border-gray-800 min-h-[80px] transition-colors ${
      isCurrentHour ? 'bg-blue-50/30 dark:bg-blue-900/10' : isPastHour ? 'bg-gray-50/30 dark:bg-gray-800/30' : ''
    }`}>
      {/* Time Label */}
      <div className="w-20 flex-shrink-0 p-4 border-r border-gray-100 dark:border-gray-800">
        <div className={`text-sm font-medium transition-colors ${
          isCurrentHour ? 'text-blue-600 dark:text-blue-400' : isPastHour ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'
        }`}>
          {timeString}
        </div>
        {isCurrentHour && (
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 animate-pulse"></div>
        )}
      </div>

      {/* Tasks Area */}
      <div className="flex-1 p-4">
        {!hasAnyTasks ? (
          <button
            onClick={() => onAddTask(hour)}
            className="w-full h-12 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
          >
            <span className="text-sm font-medium group-hover:scale-105 transition-transform">
              + Agregar tarea
            </span>
          </button>
        ) : (
          <div className="space-y-2">
            {/* Extended tasks from previous hours */}
            {extendedTasks.map(({ task, position }, index) => (
              <div key={`${task.id}-extended-${index}`} className={position !== 'start' ? '-mt-2' : ''}>
                <TaskCard
                  task={task}
                  onClick={() => onTaskClick(task)}
                  onUpdate={onTaskUpdate}
                  onDelete={() => onTaskDelete(task.id)}
                  isExtended={true}
                  position={position}
                />
              </div>
            ))}
            
            {/* Tasks that start in this hour */}
            {tasks.map((task, index) => (
              <div key={task.id} className={index > 0 || extendedTasks.length > 0 ? 'mt-2' : ''}>
                <TaskCard
                  task={task}
                  onClick={() => onTaskClick(task)}
                  onUpdate={onTaskUpdate}
                  onDelete={() => onTaskDelete(task.id)}
                />
              </div>
            ))}
            
            {/* Add task button for hours with existing tasks */}
            {tasks.length > 0 && (
              <button
                onClick={() => onAddTask(hour)}
                className="w-full h-8 border border-dashed border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-xs mt-2"
              >
                + Otra tarea
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}