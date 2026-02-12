import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./animations.css";

// Tus imágenes locales
import renderProyecto1 from "../assets/proyecto1.jpg";
import renderProyecto2 from "../assets/proyecto2.jpg";
import renderProyecto3 from "../assets/proyecto3.jpg";
import renderProyecto4 from "../assets/proyecto4.jpg";
import renderProyecto5 from "../assets/proyecto5.jpg";
import renderProyecto6 from "../assets/proyecto6.jpg";
import renderProyecto7 from "../assets/proyecto7.jpg";
import renderProyecto8 from "../assets/proyecto8.jpg";
import renderProyecto9 from "../assets/proyecto9.jpg";

const ProyectoCard = ({ titulo, descripcion, imagen, delay, navigate, infoId }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`group flex-shrink-0 w-80 sm:w-88 lg:w-96 rounded-3xl bg-gradient-to-br from-white via-blue-50/30 to-slate-50 dark:from-slate-800 dark:via-slate-800/70 dark:to-slate-900 border-2 border-slate-200/60 hover:border-blue-300/80 dark:border-slate-700 dark:hover:border-blue-600/80 modern-shadow backdrop-blur-sm relative overflow-hidden transform transition-all duration-700 ease-out hover:scale-105 hover:shadow-2xl m-4 ${inView ? 'animate-bounceIn' : 'opacity-0 translate-y-6'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative overflow-hidden rounded-t-3xl">
        <img src={imagen} alt={titulo} className="w-full h-48 sm:h-52 lg:h-60 object-cover transform transition-transform duration-700 group-hover:scale-110" />
      </div>
      <div className="flex flex-col items-center justify-between w-full p-6 sm:p-7 relative z-10">
        <h3 className="font-black text-xl sm:text-2xl lg:text-3xl mt-2 text-center mb-4 text-slate-800 dark:text-slate-100 group-hover:text-blue-800 dark:group-hover:text-blue-400">
          {titulo}
        </h3>
        <p className="text-center text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 leading-relaxed">
          {descripcion}
        </p>
        <button
          className="relative px-6 py-3.5 bg-blue-600 text-white rounded-full font-bold shadow-xl hover:scale-110 transition-all active:scale-95"
          onClick={() => navigate(`/detalle/${infoId}`)}
        >
          Ver Detalles →
        </button>
      </div>
    </div>
  );
};

const Gallery = () => {
  const navigate = useNavigate();
  const [proyectosNuevos, setProyectosNuevos] = useState([]);

  // 1. Proyectos que ya tienes
  const proyectosEstaticos = [
    { titulo: "Plaza Atlautla Tepecoculco", descripcion: "Transformación de un espacio público...", imagen: renderProyecto1, infoId: "Info1" },
    { titulo: "Parque Lineal Urbano en Ayapango", descripcion: "Integración cultural mediante arcos...", imagen: renderProyecto2, infoId: "Info2" },
    { titulo: "Almacén Industrial (Tienda 3B)", descripcion: "Construcción en Santiago Zula...", imagen: renderProyecto3, infoId: "Info3" },
    { titulo: "Unidad Deportiva Santiago Tepopula", descripcion: "Espacio multifuncional recreativo...", imagen: renderProyecto4, infoId: "Info4" },
    { titulo: "Plaza Cívica de Santiago Tepopula", descripcion: "Espacio para convivencia social...", imagen: renderProyecto5, infoId: "Info5" },
    { titulo: "Plaza San Juan Tehuixtitlan", descripcion: "Área de 2152 ㎡ para recreación...", imagen: renderProyecto6, infoId: "Info6" },
    { titulo: "Pavimentación Calle Matamoros", descripcion: "Mejora de la movilidad...", imagen: renderProyecto7, infoId: "Info7" },
    { titulo: "Pavimentación Calle 20 de Noviembre", descripcion: "Mejora de infraestructura...", imagen: renderProyecto8, infoId: "Info8" },
    { titulo: 'Cancha de fútbol "La Playa"', descripcion: "Espacio deportivo comunitario.", imagen: renderProyecto9, infoId: "Info9" }
  ];

  useEffect(() => {
    const fetchNuevos = async () => {
      const { data, error } = await supabase.from('edificios').select('*').order('created_at', { ascending: false });
      if (!error && data) setProyectosNuevos(data);
    };
    fetchNuevos();
  }, []);

  return (
    <section id="gallery" className="py-20 px-4 relative overflow-hidden section-bg-2">
      <div className="relative z-10 text-center mb-10">
        <h2 className="text-5xl lg:text-7xl font-black gradient-text-corporate">Nuestros Proyectos</h2>
      </div>

      <div className="relative flex overflow-x-auto py-8 space-x-6 px-6 scrollbar-hide scrollbar-modern">
        {/* Renderizamos los estáticos */}
        {proyectosEstaticos.map((p, i) => (
          <ProyectoCard key={`static-${i}`} {...p} delay={(i + 1) * 100} navigate={navigate} />
        ))}
        {/* Renderizamos los de Supabase */}
        {proyectosNuevos.map((p, i) => (
          <ProyectoCard 
            key={p.id} 
            titulo={p.nombre} 
            descripcion={p.descripcion} 
            imagen={p.miniatura_url} 
            infoId={p.id} 
            delay={(proyectosEstaticos.length + i + 1) * 100} 
            navigate={navigate} 
          />
        ))}
      </div>
    </section>
  );
};

export default Gallery;