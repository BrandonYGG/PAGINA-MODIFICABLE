import React from 'react';

const Maquinaria = () => {
  const equipos = [
    {
      id: 1,
      nombre: "Vibrocompactador",
      imagen: "/img-maquinaria/vibro.jpg",
      detalle: "Renta por día, semana o mes"
    },
    {
      id: 2,
      nombre: "Motoconformadora",
      imagen: "/img-maquinaria/moto.jpg",
      detalle: "Renta por día, semana o mes"
    },
    {
      id: 3,
      nombre: "Retroexcavadora",
      imagen: "/img-maquinaria/retro.jpg",
      detalle: "Renta por día, semana o mes"
    },
    {
      id: 4,
      nombre: "Renta de Andamios",
      imagen: "/img-maquinaria/andamio.jpg",
      detalle: "Renta por semana (Máximo 1 mes)"
    }
  ];

  return (
    <section id="maquinaria" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter">
            RENTA DE <span className="text-yellow-500">Maquinaria Pesada</span>
          </h2>
          <div className="w-24 h-2 bg-yellow-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {equipos.map((item) => (
            <div key={item.id} className="group bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 shadow-xl transition-all hover:border-yellow-500/50">
              {/* Contenedor de Imagen */}
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-700">
                <img 
                  src={item.imagen} 
                  alt={item.nombre} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=Imagen+No+Encontrada"; }}
                />
              </div>
              
              {/* Información de Presentación */}
              <div className="p-6 text-center">
                <h3 className="text-lg font-black text-white uppercase mb-2 group-hover:text-yellow-500 transition-colors">
                  {item.nombre}
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                  {item.detalle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Maquinaria;