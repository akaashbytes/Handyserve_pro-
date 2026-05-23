import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect,
  useCallback 
} from 'react';
const ThemeContext = createContext(null);
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('hs_theme') 
    || 'light';
  });

  useEffect(() => {
    document.documentElement
      .setAttribute('data-theme', theme);
    localStorage.setItem('hs_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => 
      t === 'light' ? 'dark' : 'light'
    );
  }, []);

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider 
      value={{ theme, toggleTheme, isDark }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error(
      'useTheme must be used inside ThemeProvider'
    );
  }
  return ctx;
};