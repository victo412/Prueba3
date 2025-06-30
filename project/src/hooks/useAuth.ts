import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { supabase } from '../lib/supabase';
import { OnboardingData } from '../components/Onboarding/OnboardingFlow';

interface User {
  id: string;
  email: string;
  name: string;
  onboardingData?: OnboardingData | null;
  hasOnboarded?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Start with loading true
  });
  
  const [storedUser, setStoredUser] = useLocalStorage<User | null>('lefi-user', null);

  // Helper function to fetch user data from database
  const fetchUserData = async (userId: string) => {
    try {
      console.log('🔍 Fetching user data for:', userId);
      
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('name, email, onboarding_data, has_onboarded')
        .eq('id', userId)
        .single();

      if (userError) {
        console.error('❌ Error fetching user data:', userError);
        return null;
      }

      console.log('✅ User data fetched:', {
        name: userData.name,
        email: userData.email,
        hasOnboarded: userData.has_onboarded,
        hasOnboardingData: !!userData.onboarding_data
      });
      
      return userData;
    } catch (error) {
      console.error('❌ Error in fetchUserData:', error);
      return null;
    }
  };

  // Function to mark onboarding as complete
  const markOnboardingComplete = async (userId: string, onboardingData: OnboardingData) => {
    try {
      console.log('✅ Marking onboarding as complete for user:', userId);
      
      const { error } = await supabase
        .from('users')
        .update({ 
          has_onboarded: true,
          onboarding_data: onboardingData 
        })
        .eq('id', userId);

      if (error) {
        console.error('❌ Error marking onboarding complete:', error);
        throw error;
      }

      console.log('🎉 Onboarding marked as complete in Supabase');
      return true;
    } catch (error) {
      console.error('❌ Error in markOnboardingComplete:', error);
      throw error;
    }
  };

  // Create test account and login
  const createTestAccount = async (): Promise<{ success: boolean; error?: string }> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      console.log('🧪 Creating test account...');
      
      const testEmail = 'test@lefi.app';
      const testPassword = 'test123456';
      
      // Try to create the account
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            name: 'Usuario de Prueba',
          }
        }
      });

      if (signUpError) {
        console.log('⚠️ Signup error (might be expected):', signUpError.message);
        
        // If user already exists, try to sign in
        if (signUpError.message.includes('User already registered') || 
            signUpError.message.includes('already been registered')) {
          console.log('🔄 Test account already exists, signing in...');
          
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: testEmail,
            password: testPassword,
          });

          if (signInError) {
            console.error('❌ Sign in error:', signInError);
            setAuthState(prev => ({ ...prev, isLoading: false }));
            return { 
              success: false, 
              error: 'Error al acceder a la cuenta de prueba. Intenta crear una cuenta manual.' 
            };
          }

          if (signInData.user) {
            console.log('✅ Test account login successful');
            return { success: true };
          }
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
          return { 
            success: false, 
            error: 'Error al crear la cuenta de prueba: ' + signUpError.message 
          };
        }
      }

      // If signup was successful
      if (signUpData.user) {
        console.log('✅ Test account created successfully');
        
        // If we have a session, we're logged in
        if (signUpData.session) {
          console.log('🚀 Test account logged in automatically');
          return { success: true };
        } else {
          // Try to sign in manually
          console.log('🔄 Attempting to sign in with test account...');
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: testEmail,
            password: testPassword,
          });

          if (signInError) {
            console.error('❌ Manual sign in error:', signInError);
            setAuthState(prev => ({ ...prev, isLoading: false }));
            return { 
              success: false, 
              error: 'Cuenta creada pero no se pudo iniciar sesión automáticamente.' 
            };
          }

          if (signInData.user) {
            console.log('✅ Test account manual login successful');
            return { success: true };
          }
        }
      }

      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { 
        success: false, 
        error: 'Error inesperado al configurar la cuenta de prueba.' 
      };

    } catch (error) {
      console.error('❌ Error in createTestAccount:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { 
        success: false, 
        error: 'Error de conexión al configurar la cuenta de prueba.' 
      };
    }
  };

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        console.log('🔍 Checking existing session...');
        
        // Set a timeout to prevent infinite loading
        timeoutId = setTimeout(() => {
          if (mounted) {
            console.log('⏰ Auth initialization timeout - proceeding without session');
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        }, 10000); // 10 second timeout

        const { data: { session }, error } = await supabase.auth.getSession();
        
        // Clear timeout if we get a response
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        if (error) {
          console.error('❌ Session check error:', error);
          if (mounted) {
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
          return;
        }

        if (session?.user) {
          console.log('✅ Session found for user:', session.user.id);
          
          // Get user data including onboarding status
          const userData = await fetchUserData(session.user.id);

          if (!mounted) return;

          const user: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: userData?.name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuario',
            onboardingData: userData?.onboarding_data || null,
            hasOnboarded: userData?.has_onboarded ?? false, // Explicit fallback to false
          };

          console.log('👤 User authenticated:', {
            email: user.email,
            hasOnboarded: user.hasOnboarded,
            hasOnboardingData: !!user.onboardingData
          });

          setStoredUser(user);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          console.log('ℹ️ No session found');
          if (storedUser) {
            console.log('🧹 Clearing stored user');
            setStoredUser(null);
          }
          
          if (mounted) {
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (mounted) {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;
        
        if (session?.user) {
          const userData = await fetchUserData(session.user.id);

          if (!mounted) return;

          const user: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: userData?.name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuario',
            onboardingData: userData?.onboarding_data || null,
            hasOnboarded: userData?.has_onboarded ?? false, // Explicit fallback to false
          };

          console.log('👤 Auth state change - user logged in:', {
            email: user.email,
            hasOnboarded: user.hasOnboarded,
            hasOnboardingData: !!user.onboardingData
          });

          setStoredUser(user);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          console.log('🚪 Auth state change - user logged out');
          setStoredUser(null);
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      }
    );

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      subscription.unsubscribe();
    };
  }, [setStoredUser]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      console.log('🔐 Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Login error:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
        
        if (error.message.includes('Invalid login credentials')) {
          return { 
            success: false, 
            error: 'Email o contraseña incorrectos. Verifica tus datos o crea una cuenta nueva.' 
          };
        } else if (error.message.includes('Email not confirmed')) {
          return { 
            success: false, 
            error: 'Por favor confirma tu email antes de iniciar sesión.' 
          };
        } else if (error.message.includes('Too many requests')) {
          return { 
            success: false, 
            error: 'Demasiados intentos. Espera unos minutos antes de intentar de nuevo.' 
          };
        } else {
          return { 
            success: false, 
            error: 'Error de conexión. Verifica tu internet e inténtalo de nuevo.' 
          };
        }
      }

      if (data.user) {
        console.log('✅ Login successful for user:', data.user.id);
        return { success: true };
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { 
          success: false, 
          error: 'Error inesperado. Inténtalo de nuevo.' 
        };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { 
        success: false, 
        error: 'Error de conexión. Verifica tu internet e inténtalo de nuevo.' 
      };
    }
  };

  const register = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      console.log('📝 Attempting registration for:', email);
      
      const name = email.split('@')[0];

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        }
      });

      if (error) {
        console.error('❌ Registration error:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
        
        if (error.message.includes('User already registered')) {
          return { 
            success: false, 
            error: 'Ya existe una cuenta con este email. Intenta iniciar sesión.' 
          };
        } else if (error.message.includes('Password should be at least')) {
          return { 
            success: false, 
            error: 'La contraseña debe tener al menos 6 caracteres.' 
          };
        } else if ((error.message.includes('email') && error.message.includes('invalid')) || error.message.includes('email_address_invalid')) {
          return { 
            success: false, 
            error: 'El formato del email no es válido.' 
          };
        } else if (error.message.includes('Signup is disabled')) {
          return { 
            success: false, 
            error: 'El registro está temporalmente deshabilitado. Intenta más tarde.' 
          };
        } else {
          return { 
            success: false, 
            error: 'Error al crear la cuenta. Inténtalo de nuevo.' 
          };
        }
      }

      if (data.user) {
        console.log('✅ Registration successful for user:', data.user.id);
        
        if (data.session) {
          return { success: true };
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
          return { 
            success: false, 
            error: 'Cuenta creada exitosamente. Ahora puedes iniciar sesión.' 
          };
        }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { 
          success: false, 
          error: 'Error al crear la cuenta.' 
        };
      }
    } catch (error) {
      console.error('❌ Register error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { 
        success: false, 
        error: 'Error de conexión. Verifica tu internet e inténtalo de nuevo.' 
      };
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logging out user...');
      
      // Clear local state first
      setStoredUser(null);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Supabase logout error:', error);
        // Don't throw error, we already cleared local state
      } else {
        console.log('✅ Supabase logout successful');
      }
      
      // Clear any other local storage items if needed
      localStorage.removeItem('lefi-user');
      
      console.log('✅ Logout completed successfully');
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Force logout even if there's an error
      setStoredUser(null);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      localStorage.removeItem('lefi-user');
    }
  };

  const refreshUser = async () => {
    if (!authState.user) {
      console.log('ℹ️ No user to refresh');
      return;
    }

    try {
      console.log('🔄 Refreshing user data for:', authState.user.id);
      
      const userData = await fetchUserData(authState.user.id);

      if (userData) {
        const updatedUser: User = {
          ...authState.user,
          name: userData.name || authState.user.name,
          onboardingData: userData?.onboarding_data || null,
          hasOnboarded: userData?.has_onboarded ?? false,
        };

        console.log('✅ User data refreshed:', {
          hasOnboarded: updatedUser.hasOnboarded,
          hasOnboardingData: !!updatedUser.onboardingData
        });

        setStoredUser(updatedUser);
        setAuthState(prev => ({
          ...prev,
          user: updatedUser,
        }));
      }
    } catch (error) {
      console.error('❌ Error refreshing user:', error);
    }
  };

  return {
    ...authState,
    login,
    register,
    logout,
    refreshUser,
    createTestAccount,
    markOnboardingComplete,
  };
}