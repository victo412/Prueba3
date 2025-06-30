import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useDarkMode() {
  const [storedTheme, setStoredTheme] = useLocalStorage<'light' | 'dark' | 'system'>('lefi-theme', 'system');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      if (storedTheme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(systemPrefersDark);
        document.documentElement.classList.toggle('dark', systemPrefersDark);
      } else {
        const isDarkMode = storedTheme === 'dark';
        setIsDark(isDarkMode);
        document.documentElement.classList.toggle('dark', isDarkMode);
      }
    };

    updateTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (storedTheme === 'system') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [storedTheme]);

  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    setStoredTheme(theme);
  };

  const toggleDarkMode = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return {
    isDark,
    theme: storedTheme,
    setTheme,
    toggleDarkMode,
  };
}