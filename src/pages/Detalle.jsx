import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient"; // Asegúrate de que la ruta sea correcta
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Detalle() {
  const navigate = useNavigate();
  const { infoId } = useParams();

  // ESTADOS PARA DATOS DINÁMICOS
  const [proyectoDinamico, setProyectoDinamico] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Imágenes adicionales por proyecto (Locales)
  const additionalImagesMap = {
    Info1: ["/infografias/Info1-1.png", "/infografias/Info1-2.png", "/infografias/Info1-3.png"],
    Info2: ["/infografias/Info2-1.png", "/infografias/Info2-2.png", "/infografias/Info2-3.png", "/infografias/Info2-4.png"],
    Info3: ["/infografias/Info3-1.png", "/infografias/Info3-2.png", "/infografias/Info3-3.png", "/infografias/Info3-4.png"],
  };

  // LÓGICA DE CARGA: Determina si busca en local o en Supabase
  useEffect(() => {
    const obtenerDatos = async () => {
      // Si NO es uno de los 3 IDs locales, buscamos en la base de datos
      if (!additionalImagesMap[infoId]) {
        try {
          const { data, error } = await supabase
            .from("edificios")
            .select("*")
            .eq("id", infoId)
            .single();

          if (error) throw error;
          if (data) setProyectoDinamico(data);
        } catch (err) {
          console.error("Error cargando proyecto:", err.message);
        }
      }
      setCargando(false);
    };

    obtenerDatos();
  }, [infoId]);

  // ASIGNACIÓN DE RECURSOS (Local vs Nube)
  const esLocal = !!additionalImagesMap[infoId];
  
  const mainImageSrc = esLocal 
    ? `/infografias/${infoId || "Info1"}.jpg` 
    : proyectoDinamico?.miniatura_url;

  const additionalImages = esLocal 
    ? (additionalImagesMap[infoId] || []) 
    : (proyectoDinamico?.infografias || []);

  const tituloProyecto = esLocal 
    ? "Detalles del Proyecto" 
    : proyectoDinamico?.nombre || "Cargando...";

  // ================================
  // VISOR PROFESIONAL FULLSCREEN
  // ================================
  const [imagenActiva, setImagenActiva] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const start = useRef({ x: 0, y: 0 });

  const resetView = () => { setZoom(1); setPos({ x: 0, y: 0 }); };

  const handleWheelZoom = (e) => {
    e.preventDefault();
    let newZoom = e.deltaY < 0 ? Math.min(zoom + 0.15, 4) : Math.max(zoom - 0.15, 1);
    setZoom(newZoom);
  };

  const handleDoubleClick = () => { zoom === 1 ? setZoom(2) : resetView(); };

  const handleMouseDown = (e) => {
    dragging.current = true;
    start.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };

  const handleMouseMove = (e) => {
    if (!dragging.current) return;
    setPos({ x: e.clientX - start.current.x, y: e.clientY - start.current.y });
  };

  const handleMouseUp = () => { dragging.current = false; };
  const abrirImagen = (src) => { setImagenActiva(src); resetView(); };

  if (cargando) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-bold">Cargando detalles...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-900 dark:to-black">
      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-center py-20 px-6 relative overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <h1
            className="text-5xl font-black mb-12 text-center text-blue-600 dark:text-blue-400 drop-shadow-lg cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate("/")}
          >
            {tituloProyecto}
          </h1>

          {/* Imagen principal */}
          <div className="mb-12 flex justify-center">
            <img
              src={mainImageSrc}
              alt="Infografía principal"
              onClick={() => abrirImagen(mainImageSrc)}
              className="w-full max-w-4xl rounded-3xl shadow-2xl cursor-pointer hover:scale-[1.01] transition"
            />
          </div>

          {/* Imágenes adicionales */}
          {additionalImages.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {additionalImages.map((imgSrc, index) => (
                <img
                  key={index}
                  src={imgSrc}
                  alt={`Detalle ${index + 1}`}
                  onClick={() => abrirImagen(imgSrc)}
                  className="w-full h-48 object-cover rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition"
                />
              ))}
            </div>
          )}

          {/* Botón volver */}
          <div className="text-center">
            <button
              className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-xl transition hover:scale-105"
              onClick={() => navigate("/")}
            >
              ← Volver a Proyectos
            </button>
          </div>
        </div>
      </main>

      <Footer />

      {/* MODAL FULLSCREEN (Se mantiene tu lógica intacta) */}
      {imagenActiva && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 overflow-hidden"
          onClick={() => setImagenActiva(null)}
        >
          <div className="absolute top-6 right-6 flex gap-3 z-50">
            <button onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.min(z + 0.2, 4)); }} className="px-4 py-2 bg-white/20 text-white rounded-xl hover:bg-white/40">+</button>
            <button onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.max(z - 0.2, 1)); }} className="px-4 py-2 bg-white/20 text-white rounded-xl hover:bg-white/40">−</button>
            <button onClick={(e) => { e.stopPropagation(); resetView(); }} className="px-4 py-2 bg-white/20 text-white rounded-xl hover:bg-white/40">Reset</button>
            <button onClick={(e) => { e.stopPropagation(); setImagenActiva(null); }} className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600">✕</button>
          </div>

          <img
            src={imagenActiva}
            alt="Vista ampliada"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheelZoom}
            onDoubleClick={handleDoubleClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{
              transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoom})`,
              transition: dragging.current ? "none" : "transform 0.15s ease",
              cursor: zoom > 1 ? "grab" : "zoom-in",
            }}
            className="max-h-[90vh] max-w-[95%] rounded-3xl shadow-2xl select-none"
            draggable={false}
          />
        </div>
      )}
    </div>
  );
}