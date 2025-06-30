import React from 'react';
import { FolderOpen, Plus, Target, Clock, CheckCircle } from 'lucide-react';

export function ProjectsView() {
  const projects = [
    {
      id: 1,
      name: 'Rediseño de la aplicación',
      description: 'Mejorar la interfaz de usuario y experiencia general',
      progress: 75,
      tasks: 8,
      completedTasks: 6,
      dueDate: '2024-02-15',
      priority: 'high',
      color: 'blue'
    },
    {
      id: 2,
      name: 'Plan de marketing Q1',
      description: 'Estrategia de marketing para el primer trimestre',
      progress: 40,
      tasks: 12,
      completedTasks: 5,
      dueDate: '2024-03-01',
      priority: 'medium',
      color: 'green'
    },
    {
      id: 3,
      name: 'Curso de desarrollo personal',
      description: 'Completar curso de productividad y liderazgo',
      progress: 60,
      tasks: 15,
      completedTasks: 9,
      dueDate: '2024-02-28',
      priority: 'low',
      color: 'purple'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-400 bg-red-50';
      case 'medium':
        return 'border-l-yellow-400 bg-yellow-50';
      case 'low':
        return 'border-l-green-400 bg-green-50';
      default:
        return 'border-l-gray-400 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Segundo Cerebro</h2>
          <p className="text-gray-600 mt-1">
            Gestiona tus proyectos, metas y conocimiento
          </p>
        </div>
        
        <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
          <Plus className="w-5 h-5" />
          <span>Nuevo Proyecto</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <FolderOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{projects.length}</h3>
              <p className="text-sm text-gray-600">Proyectos Activos</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {projects.reduce((acc, p) => acc + p.completedTasks, 0)}
              </h3>
              <p className="text-sm text-gray-600">Tareas Completadas</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)}%
              </h3>
              <p className="text-sm text-gray-600">Progreso Promedio</p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div 
            key={project.id}
            className={`bg-white rounded-xl border-l-4 ${getPriorityColor(project.priority)} p-6 hover:shadow-md transition-shadow cursor-pointer`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {project.description}
                </p>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Vence</div>
                <div className="text-sm font-medium text-gray-900">
                  {new Date(project.dueDate).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Progreso</span>
                <span className="font-medium text-gray-900">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Task Stats */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-gray-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>{project.completedTasks}/{project.tasks} tareas</span>
                </div>
                
                <div className="flex items-center space-x-1 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>
                    {project.tasks - project.completedTasks} pendientes
                  </span>
                </div>
              </div>
              
              <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                project.priority === 'high' ? 'bg-red-100 text-red-800' :
                project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {project.priority === 'high' ? 'Alta' :
                 project.priority === 'medium' ? 'Media' : 'Baja'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State for more projects */}
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
        <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          ¿Listo para tu próximo proyecto?
        </h3>
        <p className="text-gray-600 mb-6">
          Organiza tus ideas y objetivos en proyectos estructurados.
        </p>
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
          Crear Nuevo Proyecto
        </button>
      </div>
    </div>
  );
}