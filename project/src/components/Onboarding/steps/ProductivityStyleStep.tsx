import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Brain, Clock, List, Calendar, Zap, Coffee } from 'lucide-react';
import { OnboardingData } from '../OnboardingFlow';

interface ProductivityStyleStepProps {
  data: Partial<OnboardingData>;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ProductivityStyleStep({ data, onUpdate, onNext, onBack }: ProductivityStyleStepProps) {
  const [workStyle, setWorkStyle] = useState(data.workStyle || 'focused-blocks');
  const [breakPreference, setBreakPreference] = useState(data.breakPreference || 15);
  const [currentSystem, setCurrentSystem] = useState(data.currentSystem || 'none');
  const [improvementGoal, setImprovementGoal] = useState(data.improvementGoal || '');

  const handleNext = () => {
    onUpdate({
      workStyle,
      breakPreference,
      currentSystem,
      improvementGoal
    });
    onNext();
  };

  const workStyles = [
    {
      id: 'focused-blocks',
      title: 'Bloques de concentración',
      description: 'Prefiero trabajar en sesiones largas e ininterrumpidas (1-3 horas)',
      icon: Brain,
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'flexible',
      title: 'Flexible y adaptable',
      description: 'Me gusta cambiar entre tareas según mi energía y contexto',
      icon: Zap,
      color: 'from-green-500 to-blue-500'
    },
    {
      id: 'mixed',
      title: 'Enfoque mixto',
      description: 'Combino bloques de concentración con flexibilidad según la tarea',
      icon: Clock,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const currentSystems = [
    { id: 'calendar', label: 'Calendario (Google, Outlook, etc.)', icon: Calendar },
    { id: 'lists', label: 'Listas de tareas (Todoist, Any.do, etc.)', icon: List },
    { id: 'none', label: 'No uso ningún sistema específico', icon: Coffee },
    { id: 'other', label: 'Otro sistema', icon: Brain }
  ];

  const improvementGoals = [
    'Ser más organizado y estructurado',
    'Reducir la procrastinación',
    'Mejorar el equilibrio vida-trabajo',
    'Aumentar mi concentración',
    'Gestionar mejor mi tiempo',
    'Reducir el estrés diario',
    'Ser más consistente con mis hábitos',
    'Lograr mis metas más rápido'
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Personaliza tu estilo de trabajo
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Esto me ayudará a adaptar LEFI perfectamente a tu forma de trabajar
        </p>
      </div>

      <div className="space-y-6">
        {/* Work Style */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            ¿Cómo prefieres trabajar?
          </h3>
          
          <div className="space-y-3">
            {workStyles.map((style) => {
              const Icon = style.icon;
              return (
                <button
                  key={style.id}
                  onClick={() => setWorkStyle(style.id as any)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    workStyle === style.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${style.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{style.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{style.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Break Preference */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            ¿Cada cuánto prefieres hacer pausas?
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[5, 15, 30, 60].map((minutes) => (
              <button
                key={minutes}
                onClick={() => setBreakPreference(minutes)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                  breakPreference === minutes
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Coffee className="w-6 h-6 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                <div className="font-semibold text-gray-900 dark:text-white">{minutes} min</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {minutes === 5 ? 'Muy frecuentes' : 
                   minutes === 15 ? 'Frecuentes' :
                   minutes === 30 ? 'Moderadas' : 'Espaciadas'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Current System */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            ¿Qué sistema usas actualmente?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentSystems.map((system) => {
              const Icon = system.icon;
              return (
                <button
                  key={system.id}
                  onClick={() => setCurrentSystem(system.id as any)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    currentSystem === system.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">{system.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Improvement Goal */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            ¿Qué esperas mejorar con LEFI?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {improvementGoals.map((goal, index) => (
              <button
                key={index}
                onClick={() => setImprovementGoal(goal)}
                className={`p-3 text-left rounded-xl border-2 transition-all duration-200 ${
                  improvementGoal === goal
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="text-sm">{goal}</span>
              </button>
            ))}
          </div>

          <input
            type="text"
            value={improvementGoal}
            onChange={(e) => setImprovementGoal(e.target.value)}
            placeholder="O escribe tu propio objetivo..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Anterior</span>
        </button>
        
        <button
          onClick={handleNext}
          disabled={!improvementGoal.trim()}
          className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <span>Continuar</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}