import React, { useState } from 'react';
import { X, Mic, Calendar, Send } from 'lucide-react';
import { TaskCategory } from '../../types';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (content: string, category?: TaskCategory) => void;
}

export function QuickCaptureModal({ isOpen, onClose, onCapture }: QuickCaptureModalProps) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<TaskCategory>('work');
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onCapture(content.trim(), category);
      setContent('');
      onClose();
    }
  };

  const handleVoiceCapture = () => {
    setIsVoiceActive(!isVoiceActive);
    // Aquí se integraría la funcionalidad de reconocimiento de voz
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">⚡</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Captura Rápida</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Escribe tu tarea, idea o nota rápida..."
              rows={4}
              autoFocus
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría sugerida
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="work">Trabajo</option>
              <option value="personal">Personal</option>
              <option value="health">Salud</option>
              <option value="learning">Aprendizaje</option>
              <option value="social">Social</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleVoiceCapture}
                className={`p-3 rounded-xl transition-all ${
                  isVoiceActive 
                    ? 'bg-red-100 text-red-600 animate-pulse' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Mic className="w-5 h-5" />
              </button>
              
              <button
                type="button"
                className="p-3 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <Calendar className="w-5 h-5" />
              </button>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!content.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Capturar</span>
              </button>
            </div>
          </div>
        </form>

        <div className="px-6 pb-6">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">💡</span>
              </div>
              <div>
                <p className="text-sm text-blue-800 font-medium mb-1">Consejo de Lefi</p>
                <p className="text-sm text-blue-700">
                  Las ideas capturadas aquí irán a tu bandeja de entrada para organizarlas después. 
                  ¡Mantén el flujo y captura todo!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}