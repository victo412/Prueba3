import React, { useState } from 'react';
import { AuthLayout } from '../components/Auth/AuthLayout';
import { LoginForm } from '../components/Auth/LoginForm';
import { useAuth } from '../hooks/useAuth';

export function AuthView() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const { login, register, createTestAccount, isLoading } = useAuth();

  const handleAuth = async (email: string, password: string) => {
    setError('');
    
    const result = isLogin 
      ? await login(email, password)
      : await register(email, password);

    if (!result.success && result.error) {
      setError(result.error);
    }
  };

  const handleTestAccount = async () => {
    setError('');
    
    try {
      console.log('Using test account...');
      const result = await createTestAccount();
      
      if (!result.success && result.error) {
        setError(result.error);
      }
    } catch (error) {
      console.error('Test account error:', error);
      setError('Error al acceder a la cuenta de prueba. Intenta crear una cuenta manual.');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <AuthLayout>
      <LoginForm
        onLogin={handleAuth}
        onToggleMode={toggleMode}
        onTestAccount={isLogin ? handleTestAccount : undefined}
        isLogin={isLogin}
        isLoading={isLoading}
        error={error}
      />
    </AuthLayout>
  );
}