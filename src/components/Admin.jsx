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

  // --- LÓGICA PARA PUBLICAR EDIFICIO (CON INFOGRAFÍAS) ---
  const manejarSubidaEdificio = async (e) => {
    e.preventDefault();
    if (!miniaturaEdificio || infografias.length === 0) return alert("Sube la miniatura y al menos una infografía");

    try {
      setSubiendo(true);
      // 1. Miniatura
      const nameMin = `edif_min_${Date.now()}_${miniaturaEdificio.name}`;
      await supabase.storage.from('galeria').upload(nameMin, miniaturaEdificio);
      const { data: urlMin } = supabase.storage.from('galeria').getPublicUrl(nameMin);

      // 2. Infografías
      const urlsInfografias = [];
      for (const foto of infografias) {
        const nameInfo = `info_${Date.now()}_${foto.name}`;
        await supabase.storage.from('galeria').upload(nameInfo, foto);
        const { data: urlInfo } = supabase.storage.from('galeria').getPublicUrl(nameInfo);
        urlsInfografias.push(urlInfo.publicUrl);
      }

      // 3. Guardar en DB
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

  // --- LÓGICA PARA PUBLICAR VIDEO ---
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
    <div className="min-h-screen bg-slate-100 p-6 md:p-10 space-y-12">
      <h1 className="text-4xl font-black text-blue-600 text-center">Panel de Control General</h1>

      {/* --- FORMULARIO 1: EDIFICIOS --- */}
      <section className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-xl border-t-8 border-blue-500">
        <h2 className="text-2xl font-bold mb-6">Añadir Nuevo Edificio (Fotos)</h2>
        <form onSubmit={manejarSubidaEdificio} className="space-y-4">
          <input type="text" placeholder="Nombre del Edificio" className="w-full p-3 border rounded-xl" value={nombre} onChange={e => setNombre(e.target.value)} required />
          <textarea placeholder="Descripción" className="w-full p-3 border rounded-xl" rows="3" value={descripcion} onChange={e => setDescripcion(e.target.value)} required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block text-sm font-bold">Miniatura: <input type="file" accept="image/*" onChange={e => setMiniaturaEdificio(e.target.files[0])} /></label>
            <label className="block text-sm font-bold">Infografías (Carrusel): <input type="file" accept="image/*" multiple onChange={e => setInfografias(Array.from(e.target.files))} /></label>
          </div>
          <button disabled={subiendo} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-all">
            {subiendo ? "Subiendo..." : "PUBLICAR EDIFICIO"}
          </button>
        </form>
      </section>

      {/* --- FORMULARIO 2: VIDEOS --- */}
      <section className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-xl border-t-8 border-red-500">
        <h2 className="text-2xl font-bold mb-6 text-red-600">Añadir Video de YouTube</h2>
        <form onSubmit={manejarSubidaVideo} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Título del Video" className="p-3 border rounded-xl" value={tituloVideo} onChange={e => setTituloVideo(e.target.value)} required />
            <input type="url" placeholder="URL de YouTube" className="p-3 border rounded-xl" value={urlYoutube} onChange={e => setUrlYoutube(e.target.value)} required />
          </div>
          <label className="block text-sm font-bold">Miniatura del Video: <input type="file" accept="image/*" onChange={e => setMiniaturaVideo(e.target.files[0])} /></label>
          <button disabled={subiendo} className="w-full bg-red-600 text-white p-4 rounded-xl font-bold hover:bg-red-700 transition-all">
            {subiendo ? "Subiendo..." : "PUBLICAR VIDEO DE YOUTUBE"}
          </button>
        </form>
      </section>

      {/* --- LISTADO DE GESTIÓN --- */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-bold mb-4">Edificios Activos</h3>
          {edificiosExistentes.map(e => (
            <div key={e.id} className="bg-white p-3 rounded-xl shadow flex items-center justify-between mb-2">
              <span className="truncate w-40 font-medium">{e.nombre}</span>
              <button onClick={() => borrarItem('edificios', e.id)} className="text-red-500 text-sm font-bold">Borrar</button>
            </div>
          ))}
        </div>
        <div>
          <h3 className="font-bold mb-4 text-red-600">Videos Activos</h3>
          {videosExistentes.map(v => (
            <div key={v.id} className="bg-white p-3 rounded-xl shadow flex items-center justify-between mb-2">
              <span className="truncate w-40 font-medium">{v.titulo}</span>
              <button onClick={() => borrarItem('videos_proyectos', v.id)} className="text-red-500 text-sm font-bold">Borrar</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Admin;