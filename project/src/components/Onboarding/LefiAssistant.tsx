import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Sparkles } from 'lucide-react';

interface LefiAssistantProps {
  currentStep: string;
  stepNumber: number;
  totalSteps: number;
}

export function LefiAssistant({ currentStep, stepNumber, totalSteps }: LefiAssistantProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState('');

  const messages = {
    welcome: {
      text: "¡Hola! Soy Lefi, tu asistente de productividad. Estoy aquí para ayudarte a configurar tu día ideal. ¡Vamos a crear algo increíble juntos! 🚀",
      tips: ["Tomate tu tiempo en cada paso", "Puedes cambiar estas configuraciones después"]
    },
    schedule: {
      text: "Perfecto, ahora vamos a configurar tu horario ideal. Conocer tu ritmo natural me ayudará a sugerirte los mejores momentos para cada actividad. ⏰",
      tips: ["Tu ritmo circadiano es único", "Esto mejorará tus sugerencias de planificación"]
    },
    goals: {
      text: "¡Excelente! Ahora definamos tus metas principales. Estas serán la brújula que guíe toda tu planificación en LEFI. 🎯",
      tips: ["Sé específico con tus metas", "Puedes agregar más metas después"]
    },
    habits: {
      text: "Los hábitos son la base del éxito. Vamos a configurar las rutinas que quieres desarrollar. ¡Pequeños pasos, grandes resultados! 💪",
      tips: ["Empieza con pocos hábitos", "La consistencia es más importante que la cantidad"]
    },
    productivity: {
      text: "Casi terminamos. Ahora personalicemos tu estilo de trabajo para que LEFI se adapte perfectamente a ti. 🎨",
      tips: ["No hay estilo correcto o incorrecto", "Esto optimizará tus sugerencias"]
    },
    complete: {
      text: "¡Increíble! Has completado la configuración. Tu LEFI personalizado está listo. ¡Empecemos a ser más productivos! ✨",
      tips: ["Tu configuración se ha guardado", "Puedes modificar todo desde Ajustes"]
    }
  };

  useEffect(() => {
    const currentMessage = messages[currentStep as keyof typeof messages];
    if (currentMessage) {
      setMessage(currentMessage.text);
      setIsOpen(true);
    }
  }, [currentStep]);

  const currentStepData = messages[currentStep as keyof typeof messages];

  if (!currentStepData) return null;

  return (
    <>
      {/* Lefi Avatar - Always visible */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
        >
          <div className="relative">
            <span className="text-2xl">🤖</span>
            {!isOpen && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </div>
        </button>
      </div>

      {/* Message Bubble */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 animate-slide-up">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-xl">🤖</span>
                <div>
                  <h3 className="text-white font-semibold">Lefi</h3>
                  <p className="text-purple-100 text-xs">Tu asistente personal</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Content */}
            <div className="p-4">
              <div className="mb-4">
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                  {message}
                </p>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Consejos útiles:
                  </span>
                </div>
                <ul className="space-y-1">
                  {currentStepData.tips.map((tip, index) => (
                    <li key={index} className="text-sm text-blue-700 dark:text-blue-400 flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Progress indicator */}
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Paso {stepNumber} de {totalSteps}</span>
                <div className="flex space-x-1">
                  {Array.from({ length: totalSteps }, (_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index < stepNumber ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Speech bubble tail */}
          <div className="absolute bottom-0 right-8 transform translate-y-full">
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800"></div>
          </div>
        </div>
      )}
    </>
  );
}