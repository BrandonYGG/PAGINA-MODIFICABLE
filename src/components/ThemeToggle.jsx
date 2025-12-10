import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Cambiar tema"
      className="relative w-14 h-8 rounded-full flex items-center justify-center
                 bg-gradient-to-r from-slate-200 to-slate-300
                 dark:from-slate-700 dark:to-slate-800
                 shadow-inner dark:shadow-inner-dark
                 transition-all duration-300
                 focus:outline-none focus:ring-2 focus:ring-offset-2 
                 focus:ring-blue-500 dark:focus:ring-offset-slate-900"
    >
      {/* Icono de sol */}
      <FaSun className={`absolute left-1.5 text-yellow-500 transition-all duration-300 transform
                        ${theme === 'light' ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}`} 
             size={18} />
      
      {/* Icono de luna */}
      <FaMoon className={`absolute right-1.5 text-blue-300 transition-all duration-300 transform
                         ${theme === 'dark' ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-90'}`} 
              size={18} />

      {/* Círculo deslizante */}
      <div
        className={`absolute w-6 h-6 rounded-full 
                    bg-white dark:bg-slate-900 
                    shadow-md transform transition-transform duration-300
                    ${theme === 'light' ? 'translate-x-[-12px]' : 'translate-x-[12px]'}`}
      ></div>
    </button>
  );
};

export default ThemeToggle;
