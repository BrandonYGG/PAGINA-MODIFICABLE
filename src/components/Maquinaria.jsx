import React from 'react';

const Maquinaria = () => {
  const equipos = [
    {
      id: 1,
      nombre: "Vibrocompactador",
      imagen: "/img-maquinaria/vibro.jpg",
      precios: { dia: "Disponible", semana: "Disponible", mes: "Disponible" }
    },
    {
      id: 2,
      nombre: "Motoconformadora",
      imagen: "/img-maquinaria/moto.jpg",
      precios: { dia: "Disponible", semana: "Disponible", mes: "Disponible" }
    },
    {
      id: 3,
      nombre: "Retroexcavadora",
      imagen: "/img-maquinaria/retro.jpg",
      precios: { dia: "Disponible", semana: "Disponible", mes: "Disponible" }
    },
    {
      id: 4,
      nombre: "Renta de Andamios",
      imagen: "/img-maquinaria/andamio.jpg",
      nota: "Renta por semana (Máximo 1 mes)",
      precios: { semana: "Disponible", mes: "Máx. 30 días" }
    }
  ];

  return (
    <section id="maquinaria" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter">
            Renta de <span className="text-yellow-500">Maquinaria y Equipo</span>
          </h2>
          <div className="w-24 h-2 bg-yellow-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {equipos.map((item) => (
            <div key={item.id} className="bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col">
              <div className="aspect-video w-full overflow-hidden bg-slate-700">
                <img 
                  src={item.imagen} 
                  alt={item.nombre} 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=Subir+Imagen"; }}
                />
              </div>
              
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-black text-yellow-500 uppercase mb-4">{item.nombre}</h3>
                
                <div className="space-y-2 text-sm">
                  {item.precios.dia && (
                    <div className="flex justify-between border-b border-slate-700 pb-1">
                      <span className="text-slate-400">Por Día:</span>
                      <span className="text-white font-bold">{item.precios.dia}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-slate-700 pb-1">
                    <span className="text-slate-400">Por Semana:</span>
                    <span className="text-white font-bold">{item.precios.semana}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-700 pb-1">
                    <span className="text-slate-400">Por Mes:</span>
                    <span className="text-white font-bold">{item.precios.mes}</span>
                  </div>
                </div>

                {item.nota && (
                  <p className="mt-4 text-[10px] text-yellow-500/70 font-bold uppercase italic">
                    * {item.nota}
                  </p>
                )}
              </div>

              <button className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase transition-colors">
                Cotizar Ahora
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Maquinaria;