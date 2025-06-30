import React, { useState, useEffect } from 'react';

export function LoadingScreen() {
  const [dots, setDots] = useState('');
  const [showTimeout, setShowTimeout] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    // Show timeout message after 8 seconds
    const timeout = setTimeout(() => {
      setShowTimeout(true);
    }, 8000);

    // Show debug info after 5 seconds
    const debugTimeout = setTimeout(() => {
      setShowDebugInfo(true);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      clearTimeout(debugTimeout);
    };
  }, []);

  const handleReload = () => {
    window.location.reload();
  };

  const handleSkipAuth = () => {
    // Clear any stored auth data and force to login screen
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-3xl animate-pulse">L</span>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Iniciando LEFI
        </h2>
        
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        <p className="text-gray-600 mb-4">
          Verificando sesión{dots}
        </p>

        {showDebugInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5">ℹ️</div>
              <div className="text-left">
                <p className="text-blue-800 text-sm font-medium mb-2">
                  Verificando conexión...
                </p>
                <p className="text-blue-700 text-sm mb-3">
                  Si esto tarda mucho, puede ser un problema de conectividad.
                </p>
                <button
                  onClick={handleSkipAuth}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors mr-2"
                >
                  Ir a Login
                </button>
              </div>
            </div>
          </div>
        )}

        {showTimeout && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5">⚠️</div>
              <div className="text-left">
                <p className="text-yellow-800 text-sm font-medium mb-2">
                  La conexión está tardando más de lo esperado
                </p>
                <p className="text-yellow-700 text-sm mb-3">
                  Esto puede deberse a problemas de conectividad o configuración.
                </p>
                <div className="space-x-2">
                  <button
                    onClick={handleReload}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-lg font-medium transition-colors"
                  >
                    Reintentar
                  </button>
                  <button
                    onClick={handleSkipAuth}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg font-medium transition-colors"
                  >
                    Ir a Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Verificando variables de entorno</p>
          <p>• Conectando con Supabase</p>
          <p>• Validando sesión de usuario</p>
        </div>
      </div>
    </div>
  );
}