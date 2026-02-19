import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Admin = () => {
  // --- ESTADOS COMPARTIDOS Y LISTAS ---
  const [subiendo, setSubiendo] = useState(false);
  const [edificiosExistentes, setEdificiosExistentes] = useState([]);
  const [videosExistentes, setVideosExistentes] = useState([]);

  // --- ESTADOS FORMULARIO EDIFICIOS ---
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [miniaturaEdificio, setMiniaturaEdificio] = useState(null);
  const [infografias, setInfografias] = useState([]);

  // --- ESTADOS FORMULARIO VIDEOS ---
  const [tituloVideo, setTituloVideo] = useState('');
  const [urlYoutube, setUrlYoutube] = useState('');
  const [miniaturaVideo, setMiniaturaVideo] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const { data: edif } = await supabase.from('edificios').select('*').order('created_at', { ascending: false });
    const { data: vids } = await supabase.from('videos_proyectos').select('*').order('created_at', { ascending: false });
    if (edif) setEdificiosExistentes(edif);
    if (vids) setVideosExistentes(vids);
  };

  const manejarSubidaEdificio = async (e) => {
    e.preventDefault();
    if (!miniaturaEdificio || infografias.length === 0) return alert("Sube la miniatura y al menos una infografía");

    try {
      setSubiendo(true);
      const nameMin = `edif_min_${Date.now()}_${miniaturaEdificio.name}`;
      await supabase.storage.from('galeria').upload(nameMin, miniaturaEdificio);
      const { data: urlMin } = supabase.storage.from('galeria').getPublicUrl(nameMin);

      const urlsInfografias = [];
      for (const foto of infografias) {
        const nameInfo = `info_${Date.now()}_${foto.name}`;
        await supabase.storage.from('galeria').upload(nameInfo, foto);
        const { data: urlInfo } = supabase.storage.from('galeria').getPublicUrl(nameInfo);
        urlsInfografias.push(urlInfo.publicUrl);
      }

      const { error } = await supabase.from('edificios').insert([{
        nombre,
        descripcion,
        miniatura_url: urlMin.publicUrl,
        infografias: urlsInfografias 
      }]);

      if (error) throw error;
      alert("¡Edificio publicado!");
      setNombre(''); setDescripcion(''); setMiniaturaEdificio(null); setInfografias([]);
      cargarDatos();
    } catch (err) { alert("Error: " + err.message); } 
    finally { setSubiendo(false); }
  };

  const manejarSubidaVideo = async (e) => {
    e.preventDefault();
    if (!miniaturaVideo) return alert("Sube una miniatura para el video");

    try {
      setSubiendo(true);
      const fileName = `vid_min_${Date.now()}_${miniaturaVideo.name}`;
      await supabase.storage.from('galeria').upload(fileName, miniaturaVideo);
      const { data: urlData } = supabase.storage.from('galeria').getPublicUrl(fileName);

      const { error } = await supabase.from('videos_proyectos').insert([{
        titulo: tituloVideo,
        youtube_url: urlYoutube,
        url_miniatura: urlData.publicUrl
      }]);

      if (error) throw error;
      alert("¡Video de YouTube publicado!");
      setTituloVideo(''); setUrlYoutube(''); setMiniaturaVideo(null);
      cargarDatos();
    } catch (err) { alert("Error: " + err.message); } 
    finally { setSubiendo(false); }
  };

  const borrarItem = async (tabla, id) => {
    if (window.confirm("¿Seguro que quieres borrar este elemento?")) {
      const { error } = await supabase.from(tabla).delete().eq('id', id);
      if (!error) cargarDatos();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 space-y-12">
      <h1 className="text-4xl font-black text-blue-800 text-center uppercase tracking-tighter">Panel de Control General</h1>

      {/* --- FORMULARIO 1: EDIFICIOS --- */}
      <section className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-2xl border-t-8 border-blue-600">
        <h2 className="text-2xl font-black mb-6 text-slate-700">Añadir Nuevo Edificio (Fotos)</h2>
        <form onSubmit={manejarSubidaEdificio} className="space-y-4">
          <input type="text" placeholder="Nombre del Edificio" className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none text-slate-800 font-medium placeholder:text-slate-400" value={nombre} onChange={e => setNombre(e.target.value)} required />
          <textarea placeholder="Descripción del proyecto..." className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none text-slate-800 font-medium placeholder:text-slate-400" rows="3" value={descripcion} onChange={e => setDescripcion(e.target.value)} required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-black text-slate-600 uppercase">Miniatura Principal</label>
              <input type="file" accept="image/*" className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" onChange={e => setMiniaturaEdificio(e.target.files[0])} />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-black text-slate-600 uppercase">Infografías (Múltiples)</label>
              <input type="file" accept="image/*" multiple className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" onChange={e => setInfografias(Array.from(e.target.files))} />
            </div>
          </div>
          <button disabled={subiendo} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-2xl font-black text-lg transition-all shadow-lg shadow-blue-200 active:scale-[0.98]">
            {subiendo ? "Subiendo..." : "PUBLICAR EDIFICIO"}
          </button>
        </form>
      </section>

      {/* --- FORMULARIO 2: VIDEOS --- */}
      <section className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-2xl border-t-8 border-red-600">
        <h2 className="text-2xl font-black mb-6 text-slate-700">Añadir Video de YouTube</h2>
        <form onSubmit={manejarSubidaVideo} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Título del Video" className="p-4 border-2 border-slate-200 rounded-xl focus:border-red-500 outline-none text-slate-800 font-medium placeholder:text-slate-400" value={tituloVideo} onChange={e => setTituloVideo(e.target.value)} required />
            <input type="url" placeholder="Link de YouTube (https://...)" className="p-4 border-2 border-slate-200 rounded-xl focus:border-red-500 outline-none text-slate-800 font-medium placeholder:text-slate-400" value={urlYoutube} onChange={e => setUrlYoutube(e.target.value)} required />
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col space-y-2">
            <label className="text-sm font-black text-slate-600 uppercase">Miniatura del Video</label>
            <input type="file" accept="image/*" className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer" onChange={e => setMiniaturaVideo(e.target.files[0])} />
          </div>
          <button disabled={subiendo} className="w-full bg-red-600 hover:bg-red-700 text-white p-5 rounded-2xl font-black text-lg transition-all shadow-lg shadow-red-200 active:scale-[0.98]">
            {subiendo ? "Subiendo..." : "PUBLICAR VIDEO DE YOUTUBE"}
          </button>
        </form>
      </section>

      {/* --- LISTADO DE GESTIÓN --- */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
        <div className="space-y-4">
          <h3 className="text-xl font-black text-blue-800 uppercase pl-2">Edificios Activos</h3>
          <div className="space-y-2">
            {edificiosExistentes.map(e => (
              <div key={e.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow">
                <span className="truncate font-bold text-slate-700">{e.nombre}</span>
                <button onClick={() => borrarItem('edificios', e.id)} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-red-600 hover:text-white transition-all uppercase">Borrar</button>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-black text-red-800 uppercase pl-2">Videos Activos</h3>
          <div className="space-y-2">
            {videosExistentes.map(v => (
              <div key={v.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow">
                <span className="truncate font-bold text-slate-700">{v.titulo}</span>
                <button onClick={() => borrarItem('videos_proyectos', v.id)} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-red-600 hover:text-white transition-all uppercase">Borrar</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admin;