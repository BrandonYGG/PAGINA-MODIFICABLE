import React from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import "./animations.css";

import renderProyecto1 from "../assets/proyecto1.jpg";
import renderProyecto2 from "../assets/proyecto2.jpg";
import renderProyecto3 from "../assets/proyecto3.jpg";
import renderProyecto4 from "../assets/proyecto4.jpg";
import renderProyecto5 from "../assets/proyecto5.jpg";
import renderProyecto6 from "../assets/proyecto6.jpg";
import renderProyecto7 from "../assets/proyecto7.jpg";
import renderProyecto8 from "../assets/proyecto8.jpg";
import renderProyecto9 from "../assets/proyecto9.jpg";

const ProyectoCard = ({ titulo, descripcion, delay = 0, imagen, navigate, infoId }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`group flex-shrink-0 w-80 sm:w-88 lg:w-96 rounded-3xl 
      bg-gradient-to-br from-white via-blue-50/30 to-slate-50 
      dark:from-slate-800 dark:via-slate-800/70 dark:to-slate-900
      border-2 border-slate-200/60 hover:border-blue-300/80
      dark:border-slate-700 dark:hover:border-blue-600/80
      modern-shadow backdrop-blur-sm relative overflow-hidden
      transform transition-all duration-700 ease-out
      hover:scale-105 hover:shadow-2xl hover:-rotate-1 m-4
      ${inView ? 'animate-bounceIn' : 'opacity-0 translate-y-6'}
      shadow-xl shadow-slate-500/10 hover:shadow-blue-500/20
      dark:shadow-black/30 dark:hover:shadow-blue-500/20`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {imagen && (
        <div className="relative overflow-hidden rounded-t-3xl">
          <div className="absolute inset-0 bg-gradient-to-t 
          from-black/20 via-transparent to-transparent opacity-0 
          group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

          <img
            src={imagen}
            alt={titulo}
            className="w-full h-48 sm:h-52 lg:h-60 object-cover transform 
            transition-transform duration-700 group-hover:scale-110 
            group-hover:rotate-1 filter brightness-100 group-hover:brightness-110 
            contrast-100 group-hover:contrast-105 dark:brightness-90 
            dark:group-hover:brightness-100"
          />
        </div>
      )}

      <div className="flex flex-col items-center justify-between w-full p-6 sm:p-7 relative z-10">
        <h3 className="font-black text-xl sm:text-2xl lg:text-3xl mt-2 text-center mb-4
        transition-all duration-500 group-hover:-translate-y-1
        text-slate-800 dark:text-slate-100 group-hover:text-blue-800 
        dark:group-hover:text-blue-400 leading-tight tracking-tight drop-shadow-sm">
          {titulo}
        </h3>

        <p className="text-center text-sm sm:text-base lg:text-lg 
        text-slate-600 dark:text-slate-400 group-hover:text-slate-700 
        dark:group-hover:text-slate-300 px-2 mb-6 line-clamp-3 
        leading-relaxed transition-all duration-300 font-medium">
          {descripcion}
        </p>

        <button
          className="relative px-6 sm:px-8 py-3.5 sm:py-4 
          bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 
          hover:from-blue-700 hover:via-blue-600 hover:to-blue-700
          text-white rounded-full font-bold shadow-xl
          transform transition-all duration-300 hover:scale-110 hover:shadow-2xl
          active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300/50
          dark:focus:ring-blue-800/50 text-sm sm:text-base lg:text-lg
          overflow-hidden group/btn border-2 border-white/30 
          dark:border-blue-500/30 shadow-blue-500/30 dark:shadow-blue-500/40"
          onClick={() => navigate(`/detalle/${infoId}`)}
        >
          <span className="relative z-10 mr-2 tracking-wide">Ver Detalles</span>
          <span className="relative z-10 inline-block transform transition-transform 
          group-hover/btn:translate-x-1 text-lg">→</span>
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 
      bg-gradient-to-r from-transparent via-blue-400/50 to-transparent
      dark:via-blue-500/50 transform scale-x-0 group-hover:scale-x-100 
      transition-transform duration-500"></div>
    </div>
  );
};

const Gallery = () => {
  const navigate = useNavigate();

  const proyectos = [
    { titulo: "Plaza Atlautla Tepecoculco", descripcion: "Transformación de un espacio público en un centro de vida comunitario.", imagen: renderProyecto1, delay: 200, infoId: "Info1" },
    { titulo: "Parque Lineal Urbano en Ayapango", descripcion: "Integración cultural del centro del municipio mediante arcos de piedra.", imagen: renderProyecto2, delay: 300, infoId: "Info2" },
    { titulo: "Almacén Industrial (Tienda 3B)", descripcion: "Construcción en una zona en proceso de urbanización en Santiago Zula.", imagen: renderProyecto3, delay: 400, infoId: "Info3" },
    { titulo: "Unidad Deportiva Santiago Tepopula", descripcion: "Espacio multifuncional para deporte y recreación comunitaria.", imagen: renderProyecto4, delay: 500, infoId: "Info4" },
    { titulo: "Plaza Cívica de Santiago Tepopula", descripcion: "Espacio público para convivencia social y actividades culturales.", imagen: renderProyecto5, delay: 600, infoId: "Info5" },
    { titulo: "Plaza San Juan Tehuixtitlan", descripcion: "Área de 2152 ㎡ para recreación y comercio familiar.", imagen: renderProyecto6, delay: 700, infoId: "Info6" },
    { titulo: "Pavimentación Calle Matamoros", descripcion: "Mejora de la movilidad y seguridad vial.", imagen: renderProyecto7, delay: 800, infoId: "Info7" },
    { titulo: "Pavimentación Calle 20 de Noviembre", descripcion: "Mejora de infraestructura urbana.", imagen: renderProyecto8, delay: 900, infoId: "Info8" },
    { titulo: 'Cancha de fútbol "La Playa"', descripcion: "Espacio deportivo comunitario.", imagen: renderProyecto9, delay: 1000, infoId: "Info9" }
  ];

  return (
    <section id="gallery" className="py-20 sm:py-24 lg:py-28 px-4 relative overflow-hidden section-bg-2">
      <div className="absolute top-10 left-10 w-40 h-40 decoration-corporate-1 rounded-full blur-3xl opacity-30 dark:opacity-20"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 decoration-corporate-2 rounded-full blur-2xl opacity-25 dark:opacity-15"></div>

      <div className="relative z-10 text-center mb-8 sm:mb-10">
        <h2 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 animate-fadeIn cursor-pointer 
        transition-all duration-500 hover:scale-105 gradient-text-corporate
        drop-shadow-lg tracking-tight relative">
          Nuestros Proyectos
        </h2>

        <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-400 font-medium max-w-3xl mx-auto
        leading-relaxed animate-fadeIn delay-200">
          Descubre la calidad y dedicación en cada uno de nuestros trabajos realizados
        </p>

        <div className="mt-6 flex justify-center">
          <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 rounded-full
          shadow-lg shadow-blue-500/30 dark:shadow-blue-400/20"></div>
        </div>
      </div>

      <div className="relative z-10 text-center mb-8 animate-fadeIn delay-400">
        <p className="inline-flex items-center justify-center text-sm sm:text-base text-slate-500 dark:text-slate-400 font-semibold tracking-wider
        bg-slate-200/50 dark:bg-slate-800/50 px-4 py-2 rounded-full border border-slate-300/50 dark:border-slate-700/50
        animate-nudge">
          <span className="mr-3 text-lg animate-pulse">←</span>
          Desliza para ver nuestros proyectos
          <span className="ml-3 text-lg animate-pulse">→</span>
        </p>
      </div>

      <div className="relative flex overflow-x-auto snap-x snap-mandatory scrollbar-hide 
      py-8 sm:py-10 space-x-6 sm:space-x-8 px-6 sm:px-8 scrollbar-modern">
        {proyectos.map((proyecto, index) => (
          <ProyectoCard
            key={index}
            titulo={proyecto.titulo}
            descripcion={proyecto.descripcion}
            imagen={proyecto.imagen}
            delay={proyecto.delay}
            navigate={navigate}
            infoId={proyecto.infoId}
          />
        ))}
      </div>

      <div className="absolute left-0 top-0 bottom-0 w-20 
      bg-gradient-to-r from-slate-100 to-transparent pointer-events-none z-20 dark:from-slate-900"></div>

      <div className="absolute right-0 top-0 bottom-0 w-20 
      bg-gradient-to-l from-slate-100 to-transparent pointer-events-none z-20 dark:from-slate-900"></div>
    </section>
  );
};

export default Gallery;
