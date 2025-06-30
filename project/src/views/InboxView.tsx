import React from 'react';
import { Inbox, Plus, Archive, Tag, Clock } from 'lucide-react';

export function InboxView() {
  const inboxItems = [
    {
      id: 1,
      content: 'Revisar propuesta de nuevo cliente para proyecto web',
      type: 'task',
      createdAt: '2024-01-20T10:30:00',
      category: 'work',
      processed: false
    },
    {
      id: 2,
      content: 'Comprar regalo de cumpleaños para María',
      type: 'task',
      createdAt: '2024-01-20T09:15:00',
      category: 'personal',
      processed: false
    },
    {
      id: 3,
      content: 'Idea: Sistema de gamificación para aumentar productividad',
      type: 'idea',
      createdAt: '2024-01-19T16:45:00',
      category: 'learning',
      processed: false
    },
    {
      id: 4,
      content: 'Recordar agendar cita médica anual',
      type: 'reminder',
      createdAt: '2024-01-19T14:20:00',
      category: 'health',
      processed: true
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'task':
        return '📋';
      case 'idea':
        return '💡';
      case 'reminder':
        return '⏰';
      default:
        return '📝';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      work: 'bg-blue-50 text-blue-700 border-blue-200',
      personal: 'bg-green-50 text-green-700 border-green-200',
      health: 'bg-purple-50 text-purple-700 border-purple-200',
      learning: 'bg-orange-50 text-orange-700 border-orange-200',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const pendingItems = inboxItems.filter(item => !item.processed);
  const processedItems = inboxItems.filter(item => item.processed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bandeja de Entrada</h2>
          <p className="text-gray-600 mt-1">
            Captura rápida y organización de ideas, tareas y notas
          </p>
        </div>
        
        <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
          <Plus className="w-5 h-5" />
          <span>Captura Rápida</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Inbox className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{pendingItems.length}</h3>
              <p className="text-sm text-gray-600">Por Procesar</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-50 rounded-xl">
              <Archive className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{processedItems.length}</h3>
              <p className="text-sm text-gray-600">Procesados</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Tag className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{inboxItems.length}</h3>
              <p className="text-sm text-gray-600">Total Items</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Items */}
      {pendingItems.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span>Por Procesar ({pendingItems.length})</span>
          </h3>
          
          <div className="space-y-3">
            {pendingItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 text-2xl">
                    {getTypeIcon(item.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium mb-2 leading-relaxed">
                      {item.content}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <span className={`px-2 py-1 rounded-md border ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                      
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(item.createdAt).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors">
                      Programar
                    </button>
                    <button className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-medium transition-colors">
                      Procesar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processed Items */}
      {processedItems.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Procesados ({processedItems.length})</span>
          </h3>
          
          <div className="space-y-3">
            {processedItems.map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 opacity-75">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 text-xl opacity-50">
                    {getTypeIcon(item.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-600 font-medium mb-2 leading-relaxed line-through">
                      {item.content}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="px-2 py-1 rounded-md border bg-gray-100 text-gray-600 border-gray-200">
                        {item.category}
                      </span>
                      
                      <div className="flex items-center space-x-1 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>
                          Procesado el {new Date(item.createdAt).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {inboxItems.length === 0 && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
          <Inbox className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tu bandeja está vacía
          </h3>
          <p className="text-gray-600 mb-6">
            Captura ideas, tareas y notas rápidamente para procesarlas después.
          </p>
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
            Hacer Primera Captura
          </button>
        </div>
      )}

      {/* Lefi Tip */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">💡</span>
          </div>
          <div>
            <h3 className="font-semibold text-purple-900 mb-2">Consejo de Lefi</h3>
            <p className="text-purple-800 leading-relaxed">
              La clave de un buen sistema de captura es procesarlo regularmente. 
              Te recomiendo revisar tu bandeja cada mañana y convertir los elementos 
              en tareas programadas o proyectos estructurados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}