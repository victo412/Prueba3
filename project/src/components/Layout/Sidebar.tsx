import React from 'react';
import { 
  Calendar, 
  Target, 
  Inbox, 
  Settings, 
  BarChart3,
  Moon,
  Plus
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onQuickCapture: () => void;
}

export function Sidebar({ currentView, onViewChange, onQuickCapture }: SidebarProps) {
  const menuItems = [
    { id: 'today', label: 'Hoy', icon: Calendar },
    { id: 'projects', label: 'Proyectos', icon: Target },
    { id: 'inbox', label: 'Bandeja', icon: Inbox },
    { id: 'analytics', label: 'Progreso', icon: BarChart3 },
    { id: 'sleep', label: 'Sueño', icon: Moon },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full transition-colors">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">LEFI</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tu asistente inteligente</p>
          </div>
        </div>
      </div>

      {/* Quick Capture */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <button
          onClick={onQuickCapture}
          className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-xl transition-colors group"
        >
          <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="text-blue-700 dark:text-blue-300 font-medium">Captura Rápida</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Lefi Assistant */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800/30">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">🤖</span>
            </div>
            <span className="font-semibold text-gray-800 dark:text-gray-200">Lefi</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            ¡Hola! Estoy aquí para ayudarte a optimizar tu día. ¿Necesitas algún consejo?
          </p>
        </div>
      </div>
    </aside>
  );
}