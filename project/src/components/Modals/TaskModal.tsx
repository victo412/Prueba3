import React, { useState, useEffect } from 'react';
import { Task, TaskCategory, TaskPriority } from '../../types';
import { X, Calendar, Clock, Tag, Flag, FolderOpen } from 'lucide-react';
import { formatDate, getCategoryColorDot, getPriorityColorDot, getCategoryDisplayName, getPriorityDisplayName } from '../../utils/helpers';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'>) => void;
  onUpdate?: (updates: Partial<Task>) => void;
  task?: Task | null;
  defaultHour?: number;
}

const DURATION_OPTIONS = [
  { value: 15, label: '15 minutos' },
  { value: 30, label: '30 minutos' },
  { value: 45, label: '45 minutos' },
  { value: 60, label: '1 hora' },
  { value: 90, label: '1.5 horas' },
  { value: 120, label: '2 horas' },
  { value: 150, label: '2.5 horas' },
  { value: 180, label: '3 horas' },
  { value: 240, label: '4 horas' },
  { value: 300, label: '5 horas' },
  { value: 360, label: '6 horas' },
  { value: 480, label: '8 horas' },
];

const CATEGORIES: { value: TaskCategory; label: string }[] = [
  { value: 'work', label: 'Trabajo' },
  { value: 'personal', label: 'Personal' },
  { value: 'health', label: 'Salud' },
  { value: 'learning', label: 'Aprendizaje' },
  { value: 'social', label: 'Social' },
];

const PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Media' },
  { value: 'low', label: 'Baja' },
];

export function TaskModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onUpdate, 
  task, 
  defaultHour 
}: TaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    duration: 60, // Default 1 hour
    category: 'work' as TaskCategory,
    priority: 'medium' as TaskPriority,
    project: '',
    contextTag: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (task) {
        // Editing existing task - load all task data
        console.log('Loading task data:', task);
        
        setFormData({
          title: task.title || '',
          description: task.description || '',
          startTime: task.startTime || '',
          duration: task.duration || 60,
          category: task.category || 'work',
          priority: task.priority || 'medium',
          project: task.project || '',
          contextTag: task.contextTag || '',
        });
      } else if (defaultHour !== undefined) {
        // Creating new task with default hour
        const today = formatDate(new Date());
        const startTime = `${today}T${defaultHour.toString().padStart(2, '0')}:00`;
        
        setFormData({
          title: '',
          description: '',
          startTime,
          duration: 60,
          category: 'work',
          priority: 'medium',
          project: '',
          contextTag: '',
        });
      } else {
        // Creating new task without default hour
        setFormData({
          title: '',
          description: '',
          startTime: '',
          duration: 60,
          category: 'work',
          priority: 'medium',
          project: '',
          contextTag: '',
        });
      }
    }
  }, [task, defaultHour, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (task && onUpdate) {
      // Update existing task
      console.log('Updating task with data:', formData);
      onUpdate(formData);
    } else {
      // Create new task
      console.log('Creating new task with data:', formData);
      onSave({
        ...formData,
        status: 'scheduled',
      });
    }
    
    onClose();
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getEndTime = () => {
    if (!formData.startTime || !formData.duration) return '';
    
    try {
      const startDate = new Date(formData.startTime);
      const endDate = new Date(startDate.getTime() + formData.duration * 60000);
      return endDate.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } catch (error) {
      return '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {task ? 'Editar Tarea' : 'Nueva Tarea'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título de la tarea *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
              placeholder="¿Qué necesitas hacer?"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción (opcional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
              placeholder="Detalles adicionales..."
              rows={3}
            />
          </div>

          {/* Start Time and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Hora de inicio *
              </label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Duración *
              </label>
              <select
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
              >
                {DURATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {formData.startTime && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Termina a las: {getEndTime()}
                </p>
              )}
            </div>
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
              >
                {CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {/* Category color indicator */}
              <div className="flex items-center space-x-2 mt-2">
                <div className={`w-3 h-3 rounded-full ${getCategoryColorDot(formData.category)}`}></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Color de categoría
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Flag className="w-4 h-4 inline mr-1" />
                Prioridad
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
              >
                {PRIORITIES.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
              {/* Priority color indicator */}
              <div className="flex items-center space-x-2 mt-2">
                <div className={`w-3 h-3 rounded-full ${getPriorityColorDot(formData.priority)}`}></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Color de prioridad
                </span>
              </div>
            </div>
          </div>

          {/* Project and Context */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FolderOpen className="w-4 h-4 inline mr-1" />
                Proyecto (opcional)
              </label>
              <input
                type="text"
                value={formData.project}
                onChange={(e) => handleInputChange('project', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                placeholder="Ej: Rediseño web"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Contexto (opcional)
              </label>
              <input
                type="text"
                value={formData.contextTag}
                onChange={(e) => handleInputChange('contextTag', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                placeholder="Ej: @casa, @oficina"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
            >
              {task ? 'Actualizar' : 'Crear'} Tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}