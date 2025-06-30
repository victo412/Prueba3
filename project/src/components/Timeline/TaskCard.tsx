import React, { useState } from 'react';
import { Task, TaskStatus } from '../../types';
import { 
  Clock, 
  Check, 
  Play, 
  Pause, 
  MoreHorizontal,
  Edit2,
  Trash2,
  Flag
} from 'lucide-react';
import { 
  getTaskCategoryColor, 
  getTaskCategoryBorderColor,
  getPriorityColor,
  getPriorityBadgeColor,
  getCategoryDisplayName,
  getPriorityDisplayName
} from '../../utils/helpers';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: () => void;
  isExtended?: boolean; // For tasks that span multiple hours
  position?: 'start' | 'middle' | 'end'; // Position in extended task
}

export function TaskCard({ task, onClick, onUpdate, onDelete, isExtended = false, position = 'start' }: TaskCardProps) {
  const [showActions, setShowActions] = useState(false);
  
  const categoryBorderColor = getTaskCategoryBorderColor(task.category);
  const categoryColor = getTaskCategoryColor(task.category);
  const priorityColor = getPriorityColor(task.priority);
  const priorityBadgeColor = getPriorityBadgeColor(task.priority);

  const handleStatusChange = (newStatus: TaskStatus) => {
    onUpdate(task.id, { status: newStatus });
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <Play className="w-4 h-4 text-blue-600" />;
      case 'postponed':
        return <Pause className="w-4 h-4 text-orange-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'completed':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'in-progress':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'postponed':
        return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      default:
        return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours}h`;
      } else {
        return `${hours}h ${remainingMinutes}min`;
      }
    }
  };

  // For extended tasks, only show full content on the first segment
  const showFullContent = !isExtended || position === 'start';
  const showContinuation = isExtended && position !== 'start';

  // Get rounded corners based on position - FIXED
  const getRoundedCorners = () => {
    if (!isExtended) return 'rounded-xl';
    
    switch (position) {
      case 'start':
        return 'rounded-t-xl';
      case 'middle':
        return '';
      case 'end':
        return 'rounded-b-xl';
      default:
        return 'rounded-xl';
    }
  };

  // Get border styles based on position - FIXED
  const getBorderStyles = () => {
    if (!isExtended) return 'border';
    
    switch (position) {
      case 'start':
        return 'border border-b-0';
      case 'middle':
        return 'border-l border-r';
      case 'end':
        return 'border border-t-0';
      default:
        return 'border';
    }
  };

  return (
    <div
      className={`relative group transition-all duration-200 hover:shadow-md cursor-pointer ${getStatusColor()} ${categoryBorderColor} ${getRoundedCorners()} ${getBorderStyles()}`}
      onClick={onClick}
      style={{ 
        marginBottom: isExtended && position !== 'end' ? '0' : undefined,
        marginTop: isExtended && position !== 'start' ? '0' : undefined
      }}
    >
      {showContinuation ? (
        // Continuation indicator for extended tasks
        <div className="flex items-center justify-center py-6">
          <div className="flex items-center space-x-1 text-gray-400 dark:text-gray-500">
            <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse"></div>
            <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(
                      task.status === 'completed' ? 'scheduled' : 'completed'
                    );
                  }}
                  className="flex-shrink-0 hover:scale-110 transition-transform"
                >
                  {getStatusIcon()}
                </button>
                
                <h3 className={`font-semibold text-gray-900 dark:text-white truncate ${
                  task.status === 'completed' ? 'line-through text-gray-500 dark:text-gray-400' : ''
                }`}>
                  {task.title}
                </h3>
              </div>

              {task.description && showFullContent && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="flex items-center space-x-3 text-xs flex-wrap gap-y-1">
                {/* Category Badge */}
                <span className={`px-2 py-1 rounded-md border ${categoryColor}`}>
                  {getCategoryDisplayName(task.category)}
                </span>
                
                {/* Priority Badge */}
                <span className={`px-2 py-1 rounded-md border ${priorityBadgeColor} flex items-center space-x-1`}>
                  <Flag className="w-3 h-3" />
                  <span>{getPriorityDisplayName(task.priority)}</span>
                </span>
                
                {/* Duration */}
                <span className="text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatDuration(task.duration)}</span>
                </span>
                
                {task.project && showFullContent && (
                  <span className="text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-md">
                    {task.project}
                  </span>
                )}
              </div>
            </div>

            {showFullContent && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(!showActions);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all"
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </button>

                {showActions && (
                  <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 py-1 min-w-[120px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClick();
                        setShowActions(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                        setShowActions(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}