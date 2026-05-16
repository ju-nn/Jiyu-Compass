import { useState, useEffect } from 'react';
import { safeGetLocalStorage, safeSetLocalStorage } from '../utils/storage';

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first, then system preference
    const saved = safeGetLocalStorage('darkMode', null);
    if (saved !== null) return saved;
    
    // Check system preference
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    safeSetLocalStorage('darkMode', isDark);
  }, [isDark]);

  const toggle = () => setIsDark(!isDark);

  return { isDark, toggle };
};