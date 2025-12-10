import React from "react";

const Hero = () => {
  return (
    <section id="home" className="pt-36 sm:pt-44 lg:pt-48 pb-20 lg:pb-24 text-center relative overflow-hidden section-bg-1">
      {/* Fondo y elementos decorativos adaptados a dark mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-slate-100/50 dark:from-slate-900 dark:via-slate-900/80 dark:to-black"></div>
      
      <div className="absolute top-24 left-4 sm:left-10 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 
                    decoration-corporate-1 rounded-full blur-xl animate-pulse
                    opacity-60 dark:opacity-40"></div>
      <div className="absolute top-36 sm:top-44 right-4 sm:right-20 w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48
                    decoration-corporate-2 rounded-full blur-2xl animate-float
                    opacity-50 dark:opacity-30"></div>
      <div className="absolute bottom-24 left-1/4 w-20 h-20 sm:w-24 sm:h-24 
                    decoration-corporate-3 rounded-full blur-lg animate-pulse delay-1000
                    opacity-40 dark:opacity-20"></div>

      <div className="group max-w-6xl mx-auto glass-effect 
                    text-slate-800 dark:text-slate-200
                    p-8 sm:p-10 lg:p-12 rounded-3xl modern-shadow 
                    border-slate-200/60 dark:border-slate-700/80
                    relative z-10 mx-4 sm:mx-6 lg:mx-auto
                    transform transition-all duration-700 ease-out 
                    hover:scale-[1.02] hover:shadow-2xl animate-fadeIn hover:rotate-1
                    bg-white/90 dark:bg-slate-900/80 overflow-hidden
                    shadow-2xl shadow-blue-500/10 dark:shadow-black/50">

        {/* Título principal */}
        <h3 className="group-hover:-translate-y-3 transition-all duration-500 
                     text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mb-8 sm:mb-10 text-center 
                     gradient-text-corporate
                     border-b-2 border-slate-200/60 dark:border-slate-700 pb-6 relative
                     drop-shadow-sm">
          ¿Qué ofrecemos?
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 sm:w-28 lg:w-32 h-1.5 
                        bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 rounded-full
                        shadow-lg shadow-blue-500/30 dark:shadow-blue-400/20"></div>
        </h3>

        {/* Contenido principal */}
        <div className="relative p-6 sm:p-8 rounded-2xl 
                      bg-gradient-to-br from-slate-50/80 via-white/60 to-blue-50/40 
                      dark:from-slate-800/60 dark:via-slate-800/40 dark:to-blue-900/30
                      border border-slate-200/50 dark:border-slate-700
                      backdrop-blur-sm shadow-inner shadow-slate-500/5 dark:shadow-black/20">
          
          <p className="group-hover:-translate-y-2 transition-all duration-500 
                       text-justify leading-relaxed 
                       px-2 sm:px-4 lg:px-8 text-base sm:text-lg lg:text-xl xl:text-2xl 
                       text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100
                       transition-colors duration-300 font-medium">
            En nuestra empresa ofrecemos <span className="font-bold text-blue-700 dark:text-blue-400 relative">
              soluciones integrales
              <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-blue-600"></span>
            </span> en el sector de la construcción, 
            garantizando proyectos que cumplen con altos estándares de <span className="font-bold text-blue-600 dark:text-blue-500 relative">
              calidad, seguridad y eficiencia
              <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gradient-to-r from-blue-300 to-blue-500"></span>
            </span>. 
            Nos especializamos en la ejecución de obras residenciales e industriales, con un enfoque en 
            <span className="font-bold text-blue-500 dark:text-blue-600 relative"> innovación y responsabilidad social
              <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gradient-to-r from-blue-200 to-blue-400"></span>
            </span>.
          </p>
          
          <div className="absolute -left-3 sm:-left-4 top-0 w-1.5 sm:w-2 h-full 
                        bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300 rounded-full
                        shadow-lg shadow-blue-500/30 dark:shadow-blue-400/20"></div>
          <div className="absolute -right-3 sm:-right-4 top-0 w-1.5 sm:w-2 h-full 
                        bg-gradient-to-b from-blue-300 via-slate-300 to-slate-200 rounded-full
                        dark:from-blue-800 dark:via-slate-700 dark:to-slate-600
                        shadow-lg shadow-slate-500/20 dark:shadow-black/20"></div>
        </div>

        {/* Botón call-to-action */}
        <button className="mt-8 sm:mt-10 px-8 sm:px-10 py-4 sm:py-4.5 
                         bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 
                         hover:from-blue-700 hover:via-blue-600 hover:to-blue-700
                         text-white font-bold rounded-full shadow-xl
                         transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
                         active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300/50
                         dark:focus:ring-blue-800/50
                         text-base sm:text-lg lg:text-xl
                         relative overflow-hidden group
                         border-2 border-white/30 dark:border-blue-500/30
                         shadow-blue-500/30 dark:shadow-blue-500/40"
              onClick={() => document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' })}>
          
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                         transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                         transition-transform duration-700"></span>
          
          <span className="relative z-10 mr-3 font-semibold tracking-wide">Ver Nuestros Proyectos</span>
          <span className="relative z-10 inline-block transform transition-transform group-hover:translate-x-2 
                         text-xl">→</span>
        </button>
      </div>
    </section>
  );
};

export default Hero;
