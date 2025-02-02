import React, { createContext, useContext, useState, useEffect } from 'react';
import { themeV1, themeV2, themeV3 } from '../styles/themes';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [themeVersion, setThemeVersion] = useState(1);
  const [mode, setMode] = useState('dark');

  const themes = {
    1: themeV1,
    2: themeV2,
    3: themeV3
  };

  const toggleMode = () => {
    setMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const changeTheme = (version) => {
    setThemeVersion(version);
  };

  useEffect(() => {
    // Get user's preferred color scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setMode(prefersDark ? 'dark' : 'light');

    // Add listener for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setMode(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const currentTheme = themes[themeVersion][mode];
    
    // Apply theme to document root
    const root = document.documentElement;
    
    // Set CSS variables
    Object.entries(currentTheme).forEach(([category, values]) => {
      Object.entries(values).forEach(([key, value]) => {
        root.style.setProperty(`--${category}-${key}`, value);
      });
    });

    // Set data attributes for theme version and mode
    root.setAttribute('data-theme-version', themeVersion);
    root.setAttribute('data-theme-mode', mode);
    
  }, [themeVersion, mode]);

  const value = {
    mode,
    themeVersion,
    toggleMode,
    changeTheme,
    theme: themes[themeVersion][mode]
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 
