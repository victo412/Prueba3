import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, Info, CheckCircle, Loader2, TestTube } from 'lucide-react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onToggleMode: () => void;
  isLogin: boolean;
  isLoading: boolean;
  error?: string;
  onTestAccount?: () => void;
}

export function LoginForm({ onLogin, onToggleMode, isLogin, isLoading, error, onTestAccount }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!isLogin && password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && !isLoading) {
      onLogin(email, password);
    }
  };

  const handleTestAccount = () => {
    if (onTestAccount && !isLoading) {
      setEmail('test@lefi.app');
      setPassword('test123456');
      onTestAccount();
    }
  };

  const isCredentialsError = error?.includes('incorrectos') || error?.includes('Invalid login credentials');
  const isSuccessMessage = error?.includes('exitosamente') || error?.includes('Ahora puedes iniciar sesión');

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-2xl">L</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isLogin ? 'Bienvenido a LEFI' : 'Únete a LEFI'}
        </h1>
        <p className="text-gray-600">
          {isLogin 
            ? 'Tu asistente inteligente de productividad te espera' 
            : 'Comienza tu viaje hacia la máxima productividad'
          }
        </p>
      </div>

      {/* Test Account Button */}
      {isLogin && onTestAccount && (
        <div className="mb-6">
          <button
            type="button"
            onClick={handleTestAccount}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TestTube className="w-5 h-5" />
            <span>Usar Cuenta de Prueba</span>
          </button>
          <p className="text-xs text-green-600 mt-2 text-center">
            Email: test@lefi.app | Contraseña: test123456
          </p>
        </div>
      )}

      {/* Error/Success Display */}
      {error && (
        <div className={`mb-6 p-4 border rounded-xl ${
          isSuccessMessage 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start space-x-3">
            {isSuccessMessage ? (
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`text-sm font-medium ${
                isSuccessMessage ? 'text-green-700' : 'text-red-700'
              }`}>
                {error}
              </p>
              {isCredentialsError && isLogin && (
                <p className="text-red-600 text-xs mt-1">
                  ¿No tienes cuenta aún? 
                  <button
                    type="button"
                    onClick={onToggleMode}
                    disabled={isLoading}
                    className="ml-1 underline hover:no-underline disabled:opacity-50"
                  >
                    Créala aquí
                  </button>
                </p>
              )}
              {isSuccessMessage && !isLogin && (
                <p className="text-green-600 text-xs mt-1">
                  <button
                    type="button"
                    onClick={onToggleMode}
                    disabled={isLoading}
                    className="underline hover:no-underline disabled:opacity-50"
                  >
                    Ir al inicio de sesión
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info for new users */}
      {isLogin && !error && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-800 text-sm font-medium mb-1">¿Primera vez en LEFI?</p>
              <p className="text-blue-700 text-sm">
                Si no tienes cuenta, 
                <button
                  type="button"
                  onClick={onToggleMode}
                  disabled={isLoading}
                  className="ml-1 underline hover:no-underline font-medium disabled:opacity-50"
                >
                  regístrate aquí
                </button>
                {' '}para comenzar.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correo electrónico
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="tu@email.com"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Field (only for register) */}
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar contraseña
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{isLogin ? 'Iniciando sesión...' : 'Creando cuenta...'}</span>
            </>
          ) : (
            <>
              <span>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        {/* Toggle Mode */}
        <div className="text-center">
          <p className="text-gray-600">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <button
              type="button"
              onClick={onToggleMode}
              disabled={isLoading}
              className="ml-2 text-blue-600 hover:text-blue-700 font-medium transition-colors disabled:opacity-50"
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </form>

      {/* Connection Status */}
      <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs">✓</span>
          </div>
          <div>
            <p className="text-sm text-green-800 font-medium mb-1">Conectado a Supabase</p>
            <p className="text-sm text-green-700">
              {isLogin 
                ? 'Inicia sesión con tu cuenta existente o crea una nueva.'
                : 'Tu cuenta se creará de forma segura en nuestra base de datos.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}