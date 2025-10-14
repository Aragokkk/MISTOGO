import { useState, useEffect } from 'react';

export function useTheme() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Ініціалізація теми при завантаженні
  useEffect(() => {
    // Перевірити збережену тему або data-theme атрибут
    const savedTheme = localStorage.getItem('theme');
    const currentTheme = savedTheme || document.documentElement.getAttribute('data-theme') || 'light';
    
    setIsDarkTheme(currentTheme === 'dark');
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, []);

  // Слухати зміни теми з інших компонентів
  useEffect(() => {
    const handleThemeChange = (e) => {
      setIsDarkTheme(e.detail === 'dark');
    };

    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  // Функція перемикання теми
  const toggleTheme = () => {
    const newTheme = !isDarkTheme ? 'dark' : 'light';
    setIsDarkTheme(!isDarkTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    window.dispatchEvent(new CustomEvent('themeChange', { detail: newTheme }));
  };

  return { isDarkTheme, toggleTheme };
}