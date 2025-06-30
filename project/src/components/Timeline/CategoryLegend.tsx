import React from 'react';
import { 
  getCategoryColorDot, 
  getPriorityColorDot,
  getCategoryDisplayName,
  getPriorityDisplayName
} from '../../utils/helpers';
import { TaskCategory, TaskPriority } from '../../types';

export function CategoryLegend() {
  const categories: TaskCategory[] = ['work', 'personal', 'health', 'learning', 'social'];
  const priorities: TaskPriority[] = ['high', 'medium', 'low'];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Leyenda de Colores
      </h3>
      
      <div className="space-y-6">
        {/* Categories */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Categorías
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${getCategoryColorDot(category)}`}></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {getCategoryDisplayName(category)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Priorities */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Prioridades
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {priorities.map((priority) => (
              <div key={priority} className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${getPriorityColorDot(priority)}`}></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {getPriorityDisplayName(priority)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs">💡</span>
          </div>
          <div>
            <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-1">
              Tip de organización
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              El borde izquierdo de cada tarea indica su categoría, mientras que las etiquetas muestran tanto categoría como prioridad.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}