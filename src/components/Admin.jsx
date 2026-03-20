import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Admin = () => {
  const [subiendo, setSubiendo] = useState(false);
  const [edificiosExistentes, setEdificiosExistentes] = useState([]);
  const [videosExistentes, setVideosExistentes] = useState([]);

  // Estados Formulario Edificios
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [esVoluntario, setEsVoluntario] = useState(false);
  const [miniaturaEdificio, setMiniaturaEdificio] = useState(null);
  const [archivosOrdenados, setArchivosOrdenados] = useState([]);
  
  // Estados Edición
  const [editandoId, setEditandoId] = useState(null);
  const [urlsExistentes, setUrlsExistentes] = useState([]);
  const [miniaturaExistente, setMiniaturaExistente] = useState('');

  // Estados Videos
  const [tituloVideo, setTituloVideo] = useState('');
  const [urlYoutube, setUrlYoutube] = useState('');
  const [miniaturaVideo, setMiniaturaVideo] = useState(null);
  const [editandoVideoId, setEditandoVideoId] = useState(null);
  const [videoThumbExistente, setVideoThumbExistente] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // 1. Cargamos Edificios
      const { data: edif, error: errEdif } = await supabase
        .from('edificios')
        .select('*')
        .order('created_at', { ascending: false });

      if (errEdif) {
        console.error("❌ Error Supabase (Tablas):", errEdif.message);
      } else {
        console.log("✅ Datos de Edificios recibidos:", edif);
        setEdificiosExistentes(edif || []);
      }

      // 2. Cargamos Videos
      const { data: vids, error: errVids } = await supabase
        .from('videos_proyectos')
        .select('*');
      
      if (errVids) console.error("❌ Error Supabase (Videos):", errVids.message);
      else setVideosExistentes(vids || []);

    } catch (err) {
      console.error("❌ Error Crítico de Conexión:", err);
    }
  };

  const cleanName = (n) => n.replace(/[^a-zA-Z0-9.]/g, '_');

  const manejarSubidaEdificio = async (e) => {
    e.preventDefault();
    setSubiendo(true);
    try {
      let urlFinalMin = miniaturaExistente;
      if (miniaturaEdificio) {
        const nameMin = `edif_min_${Date.now()}_${cleanName(miniaturaEdificio.name)}`;
        const { error: upErr } = await supabase.storage.from('galeria').upload(nameMin, miniaturaEdificio);
        if (upErr) throw upErr;
        const { data } = supabase.storage.from('galeria').getPublicUrl(nameMin);
        urlFinalMin = data.publicUrl;
      }

      const nuevasUrls = [];
      for (const foto of archivosOrdenados) {
        const nameInfo = `info_${Date.now()}_${cleanName(foto.name)}`;
        await supabase.storage.from('galeria').upload(nameInfo, foto);
        const { data } = supabase.storage.from('galeria').getPublicUrl(nameInfo);
        nuevasUrls.push(data.publicUrl);
      }

      const payload = {
        nombre,
        descripcion,
        es_voluntario: esVoluntario,
        miniatura_url: urlFinalMin,
        infografias: [...urlsExistentes, ...nuevasUrls]
      };

      if (editandoId) {
        await supabase.from('edificios').update(payload).eq('id', editandoId);
      } else {
        await supabase.from('edificios').insert([payload]);
      }

      alert("¡Sincronizado con éxito!");
      setEditandoId(null);
      setNombre(''); setDescripcion(''); setEsVoluntario(false);
      setMiniaturaEdificio(null); setArchivosOrdenados([]); setUrlsExistentes([]);
      cargarDatos();
    } catch (err) {
      alert("Error al subir: " + err.message);
    } finally {
      setSubiendo(false);
    }
  };

  // --- RENDERIZADO ---
  return (
    <div className="min-h-screen bg-slate-100 p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* FORMULARIO */}
        <div className="lg:col-span-7 space-y-6">
          <header className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-black uppercase italic text-blue-900 tracking-tighter">Admin Central</h1>
            {editandoId && <button onClick={() => setEditandoId(null)} className="text-[10px] bg-red-500 text-white px-3 py-1 rounded-full uppercase font-bold">Cancelar Edición</button>}
          </header>

          <form onSubmit={manejarSubidaEdificio} className="bg-white p-8 rounded-3xl shadow-xl border-t-4 border-blue-600 space-y-4">
            <input type="text" placeholder="NOMBRE PROYECTO" className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500" value={nombre} onChange={e => setNombre(e.target.value)} required />
            <textarea placeholder="DESCRIPCIÓN" className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500" rows="3" value={descripcion} onChange={e => setDescripcion(e.target.value)} required />
            
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
              <input type="checkbox" id="v" className="w-5 h-5 accent-blue-600" checked={esVoluntario} onChange={e => setEsVoluntario(e.target.checked)} />
              <label htmlFor="v" className="text-xs font-bold uppercase cursor-pointer">Anteproyecto Voluntario (Aviso Legal)</label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase">Miniatura</p>
                <input type="file" className="text-[10px]" onChange={e => setMiniaturaEdificio(e.target.files[0])} />
              </div>
              <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase">Añadir Fotos</p>
                <input type="file" multiple className="text-[10px]" onChange={e => setArchivosOrdenados(Array.from(e.target.files))} />
              </div>
            </div>

            {urlsExistentes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {urlsExistentes.map((url, i) => (
                  <div key={i} className="relative w-12 h-12">
                    <img src={url} className="w-full h-full object-cover rounded-lg" />
                    <button type="button" onClick={() => setUrlsExistentes(urlsExistentes.filter((_, idx) => idx !== i))} className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 text-[8px]">X</button>
                  </div>
                ))}
              </div>
            )}

            <button disabled={subiendo} className="w-full p-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              {subiendo ? "CONECTANDO..." : editandoId ? "GUARDAR CAMBIOS" : "PUBLICAR PROYECTO"}
            </button>
          </form>
        </div>

        {/* LISTADO LATERAL */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest border-b border-slate-200 pb-2">Proyectos Activos</h2>
          <div className="space-y-3">
            {edificiosExistentes.length > 0 ? (
              edificiosExistentes.map(edif => (
                <div key={edif.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between group border border-transparent hover:border-blue-200 transition-all">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img src={edif.miniatura_url} className="w-10 h-10 object-cover rounded-lg shadow-inner" />
                    <span className="truncate font-bold text-xs uppercase text-slate-600">{edif.nombre}</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => setEditandoId(edif.id) || setNombre(edif.nombre) || setUrlsExistentes(edif.infografias || []) || setMiniaturaExistente(edif.miniatura_url) || setDescripcion(edif.descripcion)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg font-bold text-[10px]">EDITAR</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs italic text-slate-400">No se encontraron datos en Supabase.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Admin;