import React from 'react';
import { CheckCircle, Calendar, Target, Repeat, Brain, Sparkles, ArrowRight } from 'lucide-react';
import { OnboardingData } from '../OnboardingFlow';

interface SetupCompleteStepProps {
  data: OnboardingData;
  onComplete: () => void;
  onBack: () => void;
}

export function SetupCompleteStep({ data, onComplete, onBack }: SetupCompleteStepProps) {
  const getEnergyPeakLabel = (peak: string) => {
    const labels = {
      morning: 'Madrugador',
      afternoon: 'Tarde productiva',
      evening: 'Vespertino',
      night: 'Nocturno'
    };
    return labels[peak as keyof typeof labels] || peak;
  };

  const getWorkStyleLabel = (style: string) => {
    const labels = {
      'focused-blocks': 'Bloques de concentración',
      'flexible': 'Flexible y adaptable',
      'mixed': 'Enfoque mixto'
    };
    return labels[style as keyof typeof labels] || style;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          ¡Tu LEFI está listo! 🎉
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          He configurado todo según tus preferencias. ¡Empecemos a ser más productivos!
        </p>
      </div>

      {/* Configuration Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Schedule */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Horario</h3>
          </div>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p><strong>Despertar:</strong> {data.wakeUpTime}</p>
            <p><strong>Dormir:</strong> {data.sleepTime}</p>
            <p><strong>Energía pico:</strong> {getEnergyPeakLabel(data.energyPeak)}</p>
          </div>
        </div>

        {/* Goals */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Metas ({data.goals.length})</h3>
          </div>
          <div className="space-y-1">
            {data.goals.slice(0, 3).map((goal, index) => (
              <p key={index} className="text-sm text-gray-600 dark:text-gray-400">• {goal}</p>
            ))}
            {data.goals.length > 3 && (
              <p className="text-sm text-gray-500 dark:text-gray-500">+ {data.goals.length - 3} más</p>
            )}
          </div>
        </div>

        {/* Habits */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <Repeat className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Hábitos ({data.habits.length})</h3>
          </div>
          <div className="space-y-1">
            {data.habits.slice(0, 3).map((habit, index) => (
              <p key={index} className="text-sm text-gray-600 dark:text-gray-400">
                • {habit.name} ({habit.frequency === 'daily' ? 'Diario' : 'Semanal'})
              </p>
            ))}
            {data.habits.length > 3 && (
              <p className="text-sm text-gray-500 dark:text-gray-500">+ {data.habits.length - 3} más</p>
            )}
          </div>
        </div>

        {/* Work Style */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Estilo de trabajo</h3>
          </div>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p><strong>Estilo:</strong> {getWorkStyleLabel(data.workStyle)}</p>
            <p><strong>Pausas:</strong> Cada {data.breakPreference} minutos</p>
            <p><strong>Objetivo:</strong> {data.improvementGoal}</p>
          </div>
        </div>
      </div>

      {/* What's Next */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800 mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">¿Qué sigue?</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/50 dark:bg-white/10 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">1. Agenda personalizada</h4>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              He creado bloques automáticos basados en tu horario y preferencias
            </p>
          </div>
          
          <div className="bg-white/50 dark:bg-white/10 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">2. Sugerencias inteligentes</h4>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              LEFI te sugerirá los mejores momentos para cada tipo de tarea
            </p>
          </div>
          
          <div className="bg-white/50 dark:bg-white/10 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">3. Seguimiento de hábitos</h4>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Tus hábitos aparecerán automáticamente en tu agenda diaria
            </p>
          </div>
        </div>
      </div>

      {/* Lefi Message */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800 mb-8">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xl">🤖</span>
          </div>
          <div>
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Mensaje de Lefi</h3>
            <p className="text-purple-800 dark:text-purple-300 leading-relaxed">
              ¡Estoy emocionado de acompañarte en este viaje hacia la máxima productividad! 
              Recuerda que puedes ajustar cualquier configuración desde el menú de Ajustes. 
              ¡Vamos a lograr grandes cosas juntos! 🚀
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Revisar configuración
        </button>
        
        <button
          onClick={onComplete}
          className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 group"
        >
          <span>¡Empezar a usar LEFI!</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}