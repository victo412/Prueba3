import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Target, Plus, X } from 'lucide-react';
import { OnboardingData } from '../OnboardingFlow';

interface GoalsStepProps {
  data: Partial<OnboardingData>;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function GoalsStep({ data, onUpdate, onNext, onBack }: GoalsStepProps) {
  const [goals, setGoals] = useState<string[]>(data.goals || []);
  const [newGoal, setNewGoal] = useState('');

  const addGoal = () => {
    if (newGoal.trim() && goals.length < 5) {
      setGoals([...goals, newGoal.trim()]);
      setNewGoal('');
    }
  };

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    onUpdate({ goals });
    onNext();
  };

  const suggestedGoals = [
    'Mejorar mi productividad personal',
    'Desarrollar nuevas habilidades profesionales',
    'Mantener un mejor equilibrio vida-trabajo',
    'Crear hábitos saludables',
    'Completar un proyecto importante',
    'Aprender algo nuevo cada día',
    'Organizar mejor mi tiempo',
    'Reducir el estrés diario'
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Define tus metas principales
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Estas serán la brújula que guíe toda tu planificación en LEFI
        </p>
      </div>

      <div className="space-y-6">
        {/* Current Goals */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Tus metas ({goals.length}/5)
          </h3>
          
          {goals.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Aún no has agregado ninguna meta. ¡Comienza definiendo tu primera meta!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {goals.map((goal, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{index + 1}</span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">{goal}</span>
                  </div>
                  <button
                    onClick={() => removeGoal(index)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Goal */}
          {goals.length < 5 && (
            <div className="mt-4">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                  placeholder="Escribe una nueva meta..."
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button
                  onClick={addGoal}
                  disabled={!newGoal.trim()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Goals */}
        {goals.length < 5 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Sugerencias populares
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestedGoals
                .filter(suggested => !goals.includes(suggested))
                .slice(0, 6)
                .map((goal, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (goals.length < 5) {
                        setGoals([...goals, goal]);
                      }
                    }}
                    className="p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 rounded-xl transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    <div className="flex items-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span className="text-sm">{goal}</span>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Consejos para definir metas efectivas:</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <li>• Sé específico: "Leer 12 libros este año" vs "Leer más"</li>
            <li>• Hazlas medibles: incluye números o fechas cuando sea posible</li>
            <li>• Enfócate en 3-5 metas principales para mantener el foco</li>
          </ul>
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
          disabled={goals.length === 0}
          className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <span>Continuar</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}