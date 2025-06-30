import React, { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import { useAuth } from './hooks/useAuth';
import { useOnboarding } from './hooks/useOnboarding';
import { useDarkMode } from './hooks/useDarkMode';
import { Task, TaskCategory } from './types';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { TaskModal } from './components/Modals/TaskModal';
import { QuickCaptureModal } from './components/Modals/QuickCaptureModal';
import { OnboardingFlow } from './components/Onboarding/OnboardingFlow';
import { TodayView } from './views/TodayView';
import { ProjectsView } from './views/ProjectsView';
import { InboxView } from './views/InboxView';
import { AuthView } from './views/AuthView';
import { LoadingScreen } from './components/Auth/LoadingScreen';
import { formatDate } from './utils/helpers';

function App() {
  const { isAuthenticated, user, refreshUser, isLoading: authLoading } = useAuth();
  const { completeOnboarding, isLoading: onboardingLoading } = useOnboarding();
  const { isDark } = useDarkMode();
  const [currentView, setCurrentView] = useState('today');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [selectedTaskHour, setSelectedTaskHour] = useState<number | undefined>();

  const {
    tasks,
    selectedTask,
    setSelectedTask,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getTasksByDate,
    isLoading: tasksLoading,
    refreshTasks,
  } = useTasks();

  console.log('🎯 App render state:', {
    authLoading,
    isAuthenticated,
    userEmail: user?.email,
    userName: user?.name,
    hasOnboarded: user?.hasOnboarded,
    hasOnboardingData: !!user?.onboardingData,
    onboardingLoading
  });

  // Show loading screen while checking authentication
  if (authLoading) {
    console.log('⏳ Showing loading screen - auth loading');
    return <LoadingScreen />;
  }

  // Show auth view if not authenticated
  if (!isAuthenticated) {
    console.log('🔐 Showing auth view - not authenticated');
    return <AuthView />;
  }

  // Check if user needs onboarding
  // A user needs onboarding if hasOnboarded is false (regardless of onboardingData)
  const needsOnboarding = user?.hasOnboarded === false;
  
  if (needsOnboarding && !onboardingLoading) {
    console.log('🎯 User needs onboarding - showing onboarding flow');
    return (
      <OnboardingFlow 
        onComplete={async (data) => {
          try {
            console.log('🎉 Completing onboarding with data:', data);
            await completeOnboarding(data);
            // Refresh user data to get the updated onboarding status
            await refreshUser();
            console.log('✅ Onboarding completed successfully');
          } catch (error) {
            console.error('❌ Error completing onboarding:', error);
          }
        }} 
      />
    );
  }

  console.log('🏠 Showing main app - user has completed onboarding');

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  const handleTaskClick = (task: Task) => {
    console.log('Task clicked:', task);
    setSelectedTask(task);
    setSelectedTaskHour(undefined);
    setIsTaskModalOpen(true);
  };

  const handleAddTask = (hour: number) => {
    console.log('Adding task at hour:', hour);
    setSelectedTaskHour(hour);
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  const handleTaskSave = async (taskData: Omit<Task, 'id'>) => {
    console.log('Saving new task:', taskData);
    const newTask = await addTask(taskData);
    if (newTask) {
      setSelectedTaskHour(undefined);
      setIsTaskModalOpen(false);
      setSelectedTask(null);
    }
  };

  const handleTaskUpdate = async (updates: Partial<Task>) => {
    if (selectedTask) {
      console.log('Updating task:', selectedTask.id, 'with updates:', updates);
      await updateTask(selectedTask.id, updates);
      setIsTaskModalOpen(false);
      setSelectedTask(null);
    }
  };

  const handleModalClose = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
    setSelectedTaskHour(undefined);
  };

  const handleQuickCapture = async (content: string, category?: TaskCategory) => {
    const today = formatDate(new Date());
    const currentHour = new Date().getHours();
    const nextHour = currentHour + 1;
    
    await addTask({
      title: content,
      description: 'Capturada desde entrada rápida',
      startTime: `${today}T${nextHour.toString().padStart(2, '0')}:00`,
      duration: 60,
      category: category || 'work',
      status: 'scheduled',
      priority: 'medium',
    });
    
    setIsQuickCaptureOpen(false);
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'today':
        return 'Hoy';
      case 'projects':
        return 'Proyectos';
      case 'inbox':
        return 'Bandeja de Entrada';
      case 'analytics':
        return 'Progreso';
      case 'sleep':
        return 'Gestión del Sueño';
      case 'settings':
        return 'Ajustes';
      default:
        return 'LEFI';
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'today':
        return (
          <TodayView
            tasks={tasks}
            currentDate={currentDate}
            onTaskClick={handleTaskClick}
            onTaskUpdate={updateTask}
            onTaskDelete={deleteTask}
            onAddTask={handleAddTask}
            isLoading={tasksLoading}
            onRefresh={refreshTasks}
          />
        );
      case 'projects':
        return <ProjectsView />;
      case 'inbox':
        return <InboxView />;
      case 'analytics':
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Panel de Progreso
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Próximamente: estadísticas detalladas y análisis de productividad</p>
            </div>
          </div>
        );
      case 'sleep':
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Gestión del Sueño
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Próximamente: optimización del sueño y rutinas inteligentes</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Configuración
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Próximamente: personalización de Lefi y preferencias de la aplicación</p>
            </div>
          </div>
        );
      default:
        return <TodayView 
          tasks={tasks}
          currentDate={currentDate}
          onTaskClick={handleTaskClick}
          onTaskUpdate={updateTask}
          onTaskDelete={deleteTask}
          onAddTask={handleAddTask}
          isLoading={tasksLoading}
          onRefresh={refreshTasks}
        />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        onQuickCapture={() => setIsQuickCaptureOpen(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          title={getViewTitle()}
        />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-950">
          {renderCurrentView()}
        </main>
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleModalClose}
        onSave={handleTaskSave}
        onUpdate={handleTaskUpdate}
        task={selectedTask}
        defaultHour={selectedTaskHour}
      />

      <QuickCaptureModal
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
        onCapture={handleQuickCapture}
      />
    </div>
  );
}

export default App;