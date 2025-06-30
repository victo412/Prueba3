import React from 'react';
import { Task } from '../types';
import { DailyTimeline } from '../components/Timeline/DailyTimeline';
import { CategoryLegend } from '../components/Timeline/CategoryLegend';
import { StatsCard } from '../components/Dashboard/StatsCard';
import { ProgressRing } from '../components/Dashboard/ProgressRing';
import { 
  CheckCircle, 
  Clock, 
  Target, 
  Zap,
  TrendingUp,
  Coffee,
  RefreshCw
} from 'lucide-react';

interface TodayViewProps {
  tasks: Task[];
  currentDate: Date;
  onTaskClick: (task: Task) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
  onAddTask: (hour: number) => void;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function TodayView({ 
  tasks, 
  currentDate, 
  onTaskClick, 
  onTaskUpdate, 
  onTaskDelete, 
  onAddTask,
  isLoading = false,
  onRefresh
}: TodayViewProps) {
  const todayTasks = tasks.filter(task => {
    // Check if startTime exists and is a valid string
    if (!task.startTime || typeof task.startTime !== 'string') {
      return false;
    }
    
    const taskDate = task.startTime.split('T')[0];
    const today = currentDate.toISOString().split('T')[0];
    return taskDate === today;
  });

  const completedTasks = todayTasks.filter(task => task.status === 'completed');
  const inProgressTasks = todayTasks.filter(task => task.status === 'in-progress');
  const totalTasks = todayTasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  const currentHour = new Date().getHours();
  const currentTask = todayTasks.find(task => {
    // Additional safety check for startTime
    if (!task.startTime || typeof task.startTime !== 'string') {
      return false;
    }
    
    const taskHour = parseInt(task.startTime.split(':')[0]) || 
      parseInt(task.startTime.split('T')[1]?.split(':')[0] || '0');
    return taskHour === currentHour && task.status !== 'completed';
  });

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Vista de Hoy</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {totalTasks === 0 
              ? 'No tienes tareas programadas para hoy'
              : `${totalTasks} tareas programadas`
            }
          </p>
        </div>
        
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Tareas Completadas"
          value={`${completedTasks.length}/${totalTasks}`}
          subtitle="progreso del día"
          icon={CheckCircle}
          color="green"
          trend={totalTasks > 0 ? { value: completionRate, isPositive: completionRate > 50 } : undefined}
        />
        
        <StatsCard
          title="En Progreso"
          value={inProgressTasks.length}
          subtitle="tareas activas"
          icon={Clock}
          color="blue"
        />
        
        <StatsCard
          title="Productividad"
          value={`${completionRate}%`}
          subtitle="eficiencia diaria"
          icon={TrendingUp}
          color="purple"
          trend={totalTasks > 0 ? { value: completionRate - 50, isPositive: completionRate > 50 } : undefined}
        />
        
        <StatsCard
          title="Enfoque"
          value={totalTasks > 0 ? (completionRate > 70 ? "Alta" : completionRate > 40 ? "Media" : "Baja") : "N/A"}
          subtitle="nivel de energía"
          icon={Zap}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Timeline */}
        <div className="lg:col-span-3">
          <DailyTimeline
            tasks={todayTasks}
            onTaskClick={onTaskClick}
            onTaskUpdate={onTaskUpdate}
            onTaskDelete={onTaskDelete}
            onAddTask={onAddTask}
            isLoading={isLoading}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category Legend */}
          <CategoryLegend />

          {/* Daily Progress */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Progreso del Día
            </h3>
            
            <div className="flex items-center justify-center mb-6">
              <ProgressRing
                progress={completionRate}
                size={120}
                strokeWidth={8}
                color="#3B82F6"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{completionRate}%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Completado</div>
                </div>
              </ProgressRing>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Completadas</span>
                <span className="font-medium text-green-600 dark:text-green-400">{completedTasks.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">En progreso</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">{inProgressTasks.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Pendientes</span>
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  {totalTasks - completedTasks.length - inProgressTasks.length}
                </span>
              </div>
            </div>
          </div>

          {/* Current Task */}
          {currentTask && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 transition-colors">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Ahora</h3>
              </div>
              
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">{currentTask.title}</h4>
              <p className="text-sm text-blue-600 dark:text-blue-300 mb-4">
                {currentTask.startTime?.split('T')[1]?.slice(0, 5)} - Duración: {Math.floor(currentTask.duration / 60)}h {currentTask.duration % 60}min
              </p>
              
              <button
                onClick={() => onTaskClick(currentTask)}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Ver Detalles
              </button>
            </div>
          )}

          {/* Lefi Assistant */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800 transition-colors">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🤖</span>
              </div>
              <div>
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">Lefi</h3>
                <p className="text-sm text-purple-600 dark:text-purple-300">Tu asistente inteligente</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {totalTasks === 0 ? (
                <div className="bg-white/50 dark:bg-white/10 rounded-lg p-3">
                  <p className="text-sm text-purple-800 dark:text-purple-200 leading-relaxed">
                    ¡Hola! Parece que no tienes tareas programadas para hoy. 
                    ¿Te ayudo a planificar tu día? 📅
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-white/50 dark:bg-white/10 rounded-lg p-3">
                    <p className="text-sm text-purple-800 dark:text-purple-200 leading-relaxed">
                      ¡Buen trabajo! Llevas un {completionRate}% de progreso. 
                      {completionRate > 70 
                        ? ' ¡Vas excelente! 🎉'
                        : ' ¡Vamos que puedes lograr más! 💪'
                      }
                    </p>
                  </div>
                  
                  {totalTasks - completedTasks.length > 0 && (
                    <div className="bg-white/50 dark:bg-white/10 rounded-lg p-3">
                      <p className="text-sm text-purple-800 dark:text-purple-200 leading-relaxed">
                        Te quedan {totalTasks - completedTasks.length} tareas por completar. 
                        ¿Quieres que te ayude a optimizar tu agenda?
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Acciones Rápidas
            </h3>
            
            <div className="space-y-3">
              <button 
                onClick={() => onAddTask(currentHour + 1)}
                className="w-full flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Target className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">Añadir tarea</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Coffee className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">Programar descanso</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}