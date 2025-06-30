import React from 'react';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  stepName: string;
}

export function OnboardingProgress({ currentStep, totalSteps, stepName }: OnboardingProgressProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const getStepDisplayName = (step: string) => {
    const names = {
      welcome: 'Bienvenida',
      schedule: 'Horario',
      goals: 'Metas',
      habits: 'Hábitos',
      productivity: 'Estilo',
      complete: 'Finalizar'
    };
    return names[step as keyof typeof names] || step;
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Configuración LEFI</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Paso {currentStep + 1} de {totalSteps}: {getStepDisplayName(stepName)}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {Math.round(progress)}% completado
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mt-3">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index <= currentStep
                  ? 'bg-blue-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}