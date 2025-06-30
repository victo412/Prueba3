import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block">
          <div className="text-center lg:text-left">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Organiza tu vida con
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}inteligencia artificial
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              LEFI es tu asistente personal de productividad que combina planificación inteligente, 
              gestión de proyectos y optimización del tiempo en una sola plataforma.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Planificación Inteligente</h3>
                  <p className="text-gray-600">Organiza tu día con bloques de tiempo adaptativos</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🧠</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Segundo Cerebro</h3>
                  <p className="text-gray-600">Gestiona proyectos, notas y conocimiento</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Asistente Lefi</h3>
                  <p className="text-gray-600">IA que aprende y optimiza tu productividad</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}