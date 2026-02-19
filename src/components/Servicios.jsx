import React from 'react';

const Servicios = () => {
  const categorias = [
    {
      titulo: "Desarrollo Industrial",
      items: ["Almacenes de suministros", "Plantas industriales", "Bodegas de logística"]
    },
    {
      titulo: "Vivienda & Corporativos",
      items: ["Edificios departamentales", "Oficinas de alto nivel", "Complejos residenciales"]
    },
    {
      titulo: "Infraestructura Urbana",
      items: ["Vialidades y pavimentación", "Redes hidráulicas", "Alumbrado y parques"]
    }
  ];

  const tecnicos = [
    {
      nombre: "Ingeniería de Sitio",
      desc: "Levantamientos topográficos y arquitectónicos de alta precisión para cualquier inmueble."
    },
    {
      nombre: "Visualización Inmersiva",
      desc: "Modelado 3D y Realidad Virtual (VR). Incluimos análisis de costo por m² y 3 visualizaciones fotorrealistas."
    },
    {
      nombre: "Dirección de Obra",
      desc: "Construcción integral con bonificación del 40% en el diseño al contratar la ejecución con nosotros."
    },
    {
      nombre: "Gestión Técnica",
      desc: "Elaboración de presupuestos, catálogos de conceptos, licitaciones y generadores de obra."
    }
  ];

  return (
    <section id="servicios" className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            Nuestras <span className="text-blue-600">Especialidades</span>
          </h2>
          <div className="w-24 h-2 bg-blue-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Tarjetas de Sectores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {categorias.map((cat, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border-b-4 border-blue-600">
              <h3 className="text-xl font-black mb-4 text-blue-600 uppercase italic">{cat.titulo}</h3>
              <ul className="space-y-2">
                {cat.items.map((item, idx) => (
                  <li key={idx} className="text-slate-600 dark:text-slate-400 flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Listado Técnico */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tecnicos.map((t, i) => (
            <div key={i} className="flex gap-6 p-6 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
              <div className="text-blue-600 font-black text-3xl">0{i + 1}</div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase mb-1">{t.nombre}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Servicios;