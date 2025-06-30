import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Sun, Moon, Sunrise, Sunset, Clock } from 'lucide-react';
import { OnboardingData } from '../OnboardingFlow';

interface ScheduleStepProps {
  data: Partial<OnboardingData>;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ScheduleStep({ data, onUpdate, onNext, onBack }: ScheduleStepProps) {
  const [wakeUpTime, setWakeUpTime] = useState(data.wakeUpTime || '07:00');
  const [sleepTime, setSleepTime] = useState(data.sleepTime || '23:00');
  const [energyPeak, setEnergyPeak] = useState(data.energyPeak || 'morning');

  const handleNext = () => {
    onUpdate({
      wakeUpTime,
      sleepTime,
      energyPeak
    });
    onNext();
  };

  const energyOptions = [
    {
      id: 'morning',
      label: 'Madrugador',
      description: 'Más energía en la mañana (6:00 - 12:00)',
      icon: Sunrise,
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 'afternoon',
      label: 'Tarde productiva',
      description: 'Pico de energía en la tarde (12:00 - 18:00)',
      icon: Sun,
      color: 'from-orange-400 to-red-500'
    },
    {
      id: 'evening',
      label: 'Vespertino',
      description: 'Más activo en la noche (18:00 - 22:00)',
      icon: Sunset,
      color: 'from-purple-400 to-pink-500'
    },
    {
      id: 'night',
      label: 'Nocturno',
      description: 'Trabajo mejor de noche (22:00 - 2:00)',
      icon: Moon,
      color: 'from-blue-400 to-purple-500'
    }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Configuremos tu horario ideal
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Conocer tu ritmo natural me ayudará a sugerirte los mejores momentos para cada actividad
        </p>
      </div>

      <div className="space-y-8">
        {/* Sleep Schedule */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Moon className="w-5 h-5 text-blue-500" />
            <span>Horario de sueño</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ¿A qué hora te despiertas normalmente?
              </label>
              <input
                type="time"
                value={wakeUpTime}
                onChange={(e) => setWakeUpTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ¿A qué hora te acuestas normalmente?
              </label>
              <input
                type="time"
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Horas de sueño calculadas:</strong> {
                (() => {
                  const wake = new Date(`2000-01-01T${wakeUpTime}`);
                  const sleep = new Date(`2000-01-01T${sleepTime}`);
                  if (sleep > wake) sleep.setDate(sleep.getDate() + 1);
                  const diff = (wake.getTime() - sleep.getTime()) / (1000 * 60 * 60);
                  return `${Math.round(diff * 10) / 10} horas`;
                })()
              }
            </p>
          </div>
        </div>

        {/* Energy Peak */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Sun className="w-5 h-5 text-yellow-500" />
            <span>¿Cuándo tienes más energía?</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {energyOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => setEnergyPeak(option.id as any)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    energyPeak === option.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-10 h-10 bg-gradient-to-r ${option.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{option.label}</h4>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
                </button>
              );
            })}
          </div>
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
          className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <span>Continuar</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}