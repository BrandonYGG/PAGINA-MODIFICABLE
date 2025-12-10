import React from "react";

export default function Nosotros() {
  return (
    <section className="mt-8 pt-16 pb-16 lg:pb-20 text-center font-sans relative overflow-hidden section-bg-2">
      {/* Fondo y elementos decorativos adaptados a dark mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 dark:from-black dark:via-slate-900 dark:to-slate-800"></div>
      
      <div className="absolute top-12 right-4 sm:right-10 w-28 h-28 sm:w-36 sm:h-36 
                    decoration-corporate-2 rounded-full blur-xl animate-pulse delay-500 opacity-40 dark:opacity-20"></div>
      <div className="absolute bottom-12 left-4 sm:left-10 w-36 h-36 sm:w-44 sm:h-44 
                    decoration-corporate-3 rounded-full blur-2xl animate-float delay-1000 opacity-30 dark:opacity-10"></div>

      <div className="group max-w-7xl mx-auto glass-effect 
                    text-slate-800 dark:text-slate-200
                    rounded-3xl p-8 sm:p-10 lg:p-12 modern-shadow 
                    border-slate-200/60 dark:border-slate-700/80
                    relative z-10 mx-4 sm:mx-6 lg:mx-auto
                    transform transition-all duration-700 ease-out 
                    hover:scale-[1.02] hover:shadow-2xl animate-fadeIn hover:-rotate-1
                    bg-white/90 dark:bg-slate-900/80 overflow-hidden
                    shadow-2xl shadow-slate-500/10 dark:shadow-black/50">

        {/* Título principal */}
        <div className="relative mb-8 sm:mb-10">
          <h3 className="group-hover:-translate-y-3 transition-all duration-500 
                       text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 tracking-tight 
                       gradient-text-corporate
                       relative drop-shadow-sm">
            Sobre Nosotros
          </h3>
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-28 sm:w-32 lg:w-36 h-2 
                        bg-gradient-to-r from-blue-500 via-blue-400 to-amber-400 rounded-full
                        shadow-lg shadow-blue-500/30 dark:shadow-blue-400/20"></div>
        </div>

        {/* Contenido principal */}
        <div className="space-y-6 sm:space-y-8">
          <div className="relative p-6 sm:p-8 rounded-2xl 
                        bg-gradient-to-br from-slate-50/90 via-white/80 to-blue-50/60 
                        dark:from-slate-800/70 dark:via-slate-800/50 dark:to-blue-900/40
                        border-2 border-slate-200/60 hover:border-blue-300/60
                        dark:border-slate-700 dark:hover:border-blue-600
                        backdrop-blur-sm group-hover:-translate-y-2 transition-all duration-500 card-shadow
                        hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20">
            
            <p className="text-justify text-base sm:text-lg lg:text-xl xl:text-2xl leading-relaxed 
                        text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100
                        transition-colors duration-300 font-medium">
              Somos una empresa dedicada a la industria de la construcción, enfocada en
              brindar un servicio <span className="font-bold text-blue-700 dark:text-blue-400 relative">
                eficiente, responsable
                <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-blue-600"></span>
              </span> y con altos estándares de calidad.
              Nuestro trabajo está guiado por la <span className="font-bold text-blue-600 dark:text-blue-500 relative">
                integridad
                <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gradient-to-r from-blue-300 to-blue-500"></span>
              </span> y la firme convicción de satisfacer
              las necesidades de nuestros clientes, siempre respetando el <span className="font-bold text-amber-700 dark:text-amber-500 relative">
                medio ambiente
                <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 to-amber-600"></span>
              </span>.
            </p>
          </div>

          <div className="relative p-6 sm:p-8 rounded-2xl 
                        bg-gradient-to-br from-blue-50/60 via-white/80 to-slate-50/90 
                        dark:from-blue-900/40 dark:via-slate-800/50 dark:to-slate-800/70
                        border-2 border-slate-200/60 hover:border-blue-300/60
                        dark:border-slate-700 dark:hover:border-blue-600
                        backdrop-blur-sm group-hover:-translate-y-2 transition-all duration-500 delay-100 card-shadow
                        hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20">
            
            <p className="text-justify text-base sm:text-lg lg:text-xl xl:text-2xl leading-relaxed 
                        text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100
                        transition-colors duration-300 font-medium">
              Nuestro objetivo es integrar estándares de <span className="font-bold text-amber-700 dark:text-amber-500 relative">
                calidad en cada proceso
                <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 to-amber-600"></span>
              </span>,
              asegurando resultados duraderos y funcionales que aporten valor a cada proyecto
              y <span className="font-bold text-blue-700 dark:text-blue-400 relative">
                confianza
                <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-blue-600"></span>
              </span> a quienes nos eligen.
            </p>
          </div>
          
          <div className="relative p-6 sm:p-8 rounded-2xl 
                        bg-gradient-to-br from-slate-50/90 via-white/80 to-blue-50/60 
                        dark:from-slate-800/70 dark:via-slate-800/50 dark:to-blue-900/40
                        border-2 border-slate-200/60 hover:border-blue-300/60
                        dark:border-slate-700 dark:hover:border-blue-600
                        backdrop-blur-sm group-hover:-translate-y-2 transition-all duration-500 delay-200 card-shadow
                        hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20">
            
            <div className="text-left text-base sm:text-lg lg:text-xl xl:text-2xl leading-relaxed">
              <p className="mb-6 font-black text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-center
                          gradient-text-corporate drop-shadow-sm">
                Nuestros valores nos definen:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
                {[
                  { text: "Compromiso", color: "blue", icon: "🤝" },
                  { text: "Responsabilidad", color: "amber", icon: "⚖️" },
                  { text: "Profesionalismo", color: "slate", icon: "🎯" }
                ].map((valor, index) => (
                  <div key={index} 
                       className="group/valor flex flex-col items-center space-y-4 p-6 sm:p-8 rounded-2xl 
                                bg-gradient-to-br from-white via-slate-50/80 to-white
                                dark:from-slate-800 dark:via-slate-700/80 dark:to-slate-800
                                border-2 border-slate-200/60 hover:border-blue-300/80
                                dark:border-slate-700 dark:hover:border-blue-600
                                hover:scale-105 transition-all duration-300 card-shadow
                                hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20
                                transform hover:-translate-y-2">
                    
                    <div className="text-4xl sm:text-5xl mb-2 transform group-hover/valor:scale-110 
                                  transition-transform duration-300">
                      {valor.icon}
                    </div>
                    
                    <div className={`w-6 h-6 bg-gradient-to-r from-${valor.color}-400 to-${valor.color}-500 
                                   rounded-full flex-shrink-0 shadow-lg shadow-${valor.color}-500/30
                                   group-hover/valor:animate-pulse`}></div>
                    
                    <span className="text-slate-700 dark:text-slate-200 text-base sm:text-lg lg:text-xl font-bold text-center
                                   group-hover/valor:text-blue-700 dark:group-hover/valor:text-blue-400 transition-colors duration-300">
                      {valor.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
