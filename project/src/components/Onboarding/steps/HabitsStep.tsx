import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Repeat, Plus, X, Heart, BookOpen, Briefcase, User } from 'lucide-react';
import { OnboardingData } from '../OnboardingFlow';

interface HabitsStepProps {
  data: Partial<OnboardingData>;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

type HabitCategory = 'health' | 'learning' | 'work' | 'personal';

export function HabitsStep({ data, onUpdate, onNext, onBack }: HabitsStepProps) {
  const [habits, setHabits] = useState(data.habits || []);
  const [newHabit, setNewHabit] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory>('health');
  const [selectedFrequency, setSelectedFrequency] = useState<'daily' | 'weekly'>('daily');

  const addHabit = () => {
    if (newHabit.trim() && habits.length < 8) {
      setHabits([...habits, {
        name: newHabit.trim(),
        frequency: selectedFrequency,
        category: selectedCategory
      }]);
      setNewHabit('');
    }
  };

  const removeHabit = (index: number) => {
    setHabits(habits.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    onUpdate({ habits });
    onNext();
  };

  const categories = [
    { id: 'health', label: 'Salud', icon: Heart, color: 'text-red-500 bg-red-100 dark:bg-red-900/30' },
    { id: 'learning', label: 'Aprendizaje', icon: BookOpen, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
    { id: 'work', label: 'Trabajo', icon: Briefcase, color: 'text-green-500 bg-green-100 dark:bg-green-900/30' },
    { id: 'personal', label: 'Personal', icon: User, color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30' }
  ];

  const suggestedHabits = {
    health: ['Hacer ejercicio 30 min', 'Beber 8 vasos de agua', 'Meditar 10 minutos', 'Caminar después de comer'],
    learning: ['Leer 30 minutos', 'Practicar un idioma', 'Ver un video educativo', 'Escribir en un diario'],
    work: ['Revisar emails solo 3 veces', 'Planificar el día siguiente', 'Hacer una pausa cada hora', 'Organizar el escritorio'],
    personal: ['Llamar a un amigo/familiar', 'Practicar gratitud', 'Escuchar música', 'Tiempo sin pantallas']
  };

  const getCategoryInfo = (categoryId: HabitCategory) => {
    return categories.find(cat => cat.id === categoryId);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Repeat className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Construye hábitos poderosos
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Los hábitos son la base del éxito. ¡Pequeños pasos, grandes resultados!
        </p>
      </div>

      <div className="space-y-6">
        {/* Current Habits */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Tus hábitos ({habits.length}/8)
          </h3>
          
          {habits.length === 0 ? (
            <div className="text-center py-8">
              <Repeat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Aún no has agregado ningún hábito. ¡Comienza con uno pequeño!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {habits.map((habit, index) => {
                const categoryInfo = getCategoryInfo(habit.category);
                const Icon = categoryInfo?.icon || User;
                
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${categoryInfo?.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-gray-900 dark:text-white font-medium block">{habit.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {habit.frequency === 'daily' ? 'Diario' : 'Semanal'} • {categoryInfo?.label}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeHabit(index)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add New Habit */}
          {habits.length < 8 && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Categoría
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id as HabitCategory)}
                          className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                            selectedCategory === category.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto mb-1 ${category.color}`}>
                            <Icon className="w-3 h-3" />
                          </div>
                          <span className="text-xs text-gray-700 dark:text-gray-300">{category.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Frequency Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Frecuencia
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'daily', label: 'Diario' },
                      { id: 'weekly', label: 'Semanal' }
                    ].map((freq) => (
                      <button
                        key={freq.id}
                        onClick={() => setSelectedFrequency(freq.id as 'daily' | 'weekly')}
                        className={`w-full p-2 text-sm rounded-lg border-2 transition-all duration-200 ${
                          selectedFrequency === freq.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                            : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                        }`}
                      >
                        {freq.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addHabit()}
                  placeholder="Nombre del hábito..."
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button
                  onClick={addHabit}
                  disabled={!newHabit.trim()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Habits */}
        {habits.length < 8 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Sugerencias para {getCategoryInfo(selectedCategory)?.label}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestedHabits[selectedCategory]
                .filter(suggested => !habits.some(h => h.name === suggested))
                .map((habit, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (habits.length < 8) {
                        setHabits([...habits, {
                          name: habit,
                          frequency: selectedFrequency,
                          category: selectedCategory
                        }]);
                      }
                    }}
                    className="p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 rounded-xl transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    <div className="flex items-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span className="text-sm">{habit}</span>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
          <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">💪 Consejos para formar hábitos exitosos:</h4>
          <ul className="text-sm text-purple-800 dark:text-purple-300 space-y-1">
            <li>• Empieza pequeño: 5-10 minutos es mejor que 1 hora imposible</li>
            <li>• Sé consistente: mejor todos los días 5 min que 1 hora una vez</li>
            <li>• Vincula a hábitos existentes: "Después de lavarme los dientes, meditaré"</li>
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
          className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <span>Continuar</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}