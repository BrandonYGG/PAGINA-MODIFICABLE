import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logocruzruiz from "../assets/logocruzruiz.jpg";
import ThemeToggle from "./ThemeToggle"; // Componente para cambiar tema
import { useTheme } from "../context/ThemeContext"; // Hook para acceder al tema

const sections = ["home", "gallery"];

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useTheme(); // Obtener el tema actual (light/dark)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrolled(scrollTop > 50);
      
      let current = "home";
      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 80) current = id;
        }
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`
      ${scrolled 
        ? 'glass-effect modern-shadow border-slate-200/40 bg-white/95 dark:bg-slate-900/80 dark:border-slate-700' 
        : 'bg-white/90 dark:bg-slate-900/70'
      } 
      px-4 sm:px-6 lg:px-12 text-slate-800 dark:text-slate-200
      flex flex-col lg:flex-row items-center justify-between
      fixed w-full z-50 py-3 transition-all duration-500 ease-out
      backdrop-blur-xl animate-fadeIn
      ${scrolled ? 'shadow-2xl shadow-blue-500/10 dark:shadow-blue-400/10' : 'shadow-lg shadow-slate-500/5 dark:shadow-black/20'}
    `}>
      {/* Logo y título */}
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-3 lg:mb-0 animate-slideDown delay-200">
        <div className="relative group">
          <Link to="/">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
            <img
              src={logocruzruiz}
              alt="Logo Cruz Ruiz"
              className="relative h-12 sm:h-14 lg:h-16 w-auto max-w-[90px] sm:max-w-[110px] lg:max-w-[130px]
                       transition-all duration-500 transform hover:scale-110 hover:rotate-3
                       rounded-full border-3 border-blue-200/60 dark:border-blue-800/60
                       shadow-xl group-hover:shadow-2xl group-hover:border-blue-400
                       ring-2 ring-blue-100/50 group-hover:ring-blue-300/80
                       dark:ring-blue-900/50 dark:group-hover:ring-blue-700/80"
            />
          </Link>
        </div>

        <Link
          to="/"
          className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-black tracking-tight text-center sm:text-left
                     max-w-[300px] lg:max-w-none transition-all duration-500 transform hover:scale-105
                     gradient-text-corporate drop-shadow-sm
                     leading-tight"
        >
          Edificaciones y Construcciones Cruz Ruiz
        </Link>
      </div>

      {/* Navegación y Toggle de Tema */}
      <div className="flex items-center space-x-4 lg:space-x-6">
        <div className="flex justify-center space-x-3 sm:space-x-4 lg:space-x-6 animate-slideDown delay-100">
          {sections.map((section) => (
            <a
              key={section}
              href={`#${section}`}
              className={`
                relative px-5 py-3 lg:px-7 lg:py-3.5 rounded-full transition-all duration-400 
                font-semibold text-xs sm:text-sm lg:text-base
                hover:scale-105 hover:shadow-xl 
                border border-transparent focus:outline-none focus:ring-3 focus:ring-blue-500/50
                overflow-hidden group
                ${activeSection === section
                  ? `bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white shadow-xl
                     shadow-blue-500/30 dark:shadow-blue-500/40 ring-2 ring-blue-300/50 dark:ring-blue-500/50
                     after:block after:absolute after:-bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 
                     after:w-2 after:h-2 after:bg-white after:rounded-full after:animate-pulse`
                  : `text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white
                     bg-gradient-to-r from-slate-100/80 via-white/90 to-slate-100/80
                     dark:from-slate-800/80 dark:via-slate-700/90 dark:to-slate-800/80
                     hover:from-blue-50/90 hover:via-white hover:to-blue-50/90
                     dark:hover:from-blue-900/90 dark:hover:via-slate-800 dark:hover:to-blue-900/90
                     hover:border-blue-200 dark:hover:border-blue-700 shadow-md hover:shadow-lg
                     hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20`
                }
              `}
            >
              <span className="relative z-10">
                {section === "home" ? "Inicio" : "Trabajos y Contacto"}
              </span>
            </a>
          ))}
        </div>
        
        {/* Contenedor para el Toggle de Tema con texto dinámico. */}
        <div className="flex items-center space-x-2 animate-slideDown delay-300">
          {/* El texto cambia según el tema activo. Se añade un ancho fijo y alineación para evitar saltos de layout. */}
          <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 transition-colors duration-300 w-24 text-right">
            {theme === 'light' ? 'Modo Claro' : 'Modo Oscuro'}
          </span>
          <ThemeToggle />
        </div>
      </div>

      {/* Línea decorativa */}
      <div className="absolute bottom-0 left-0 right-0 h-px 
                    bg-gradient-to-r from-transparent via-blue-200/50 to-transparent
                    dark:via-blue-800/50"></div>
    </nav>
  );
};

export default Navbar;
