import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Admin = () => {
  // --- ESTADOS PARA EDIFICIOS ---
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [miniatura, setMiniatura] = useState(null);
  const [infografias, setInfografias] = useState([]);
  
  // --- ESTADOS PARA VIDEOS ---
  const [tituloVideo, setTituloVideo] = useState('');
  const [urlYoutube, setUrlYoutube] = useState('');
  const [miniaturaVideo, setMiniaturaVideo] = useState(null);

  const [subiendo, setSubiendo] = useState(false);
  const [proyectosExistentes, setProyectosExistentes] = useState([]);
  const [videosExistentes, setVideosExistentes] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const { data: edif } = await supabase.from('edificios').select('*').order('created_at', { ascending: false });
    const { data: vids } = await supabase.from('videos_proyectos').select('*').order('created_at', { ascending: false });
    if (edif) setProyectosExistentes(edif);
    if (vids) setVideosExistentes(vids);
  };

  // --- FUNCIÓN PARA SUBIR VIDEOS ---
  const manejarSubidaVideo = async (e) => {
    e.preventDefault();
    if (!miniaturaVideo || !tituloVideo || !urlYoutube) return alert("Completa todos los campos del video");

    try {
      setSubiendo(true);
      const fileName = `vid_${Date.now()}_${miniaturaVideo.name}`;
      await supabase.storage.from('galeria').upload(fileName, miniaturaVideo);
      const { data: urlData } = supabase.storage.from('galeria').getPublicUrl(fileName);

      const { error } = await supabase.from('videos_proyectos').insert([{
        titulo: tituloVideo,
        youtube_url: urlYoutube,
        url_miniatura: urlData.publicUrl
      }]);

      if (error) throw error;
      alert("¡Video publicado!");
      setTituloVideo(''); setUrlYoutube(''); setMiniaturaVideo(null);
      cargarDatos();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSubiendo(false);
    }
  };

  // --- FUNCIÓN PARA BORRAR (Genérica) ---
  const borrarItem = async (tabla, id) => {
    if (window.confirm("¿Seguro que quieres eliminar este elemento?")) {
      const { error } = await supabase.from(tabla).delete().eq('id', id);
      if (!error) cargarDatos();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 space-y-10">
      <h1 className="text-4xl font-black text-center text-blue-700">Panel de Control Edificios</h1>

      {/* SECCIÓN VIDEOS */}
      <section className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-red-600">Añadir Video de YouTube</h2>
        <form onSubmit={manejarSubidaVideo} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Título del Video" className="p-3 border rounded-xl" value={tituloVideo} onChange={e => setTituloVideo(e.target.value)} required />
          <input type="url" placeholder="URL de YouTube (https://...)" className="p-3 border rounded-xl" value={urlYoutube} onChange={e => setUrlYoutube(e.target.value)} required />
          <div className="md:col-span-2">
            <label className="block mb-2 font-bold">Miniatura del Video:</label>
            <input type="file" accept="image/*" onChange={e => setMiniaturaVideo(e.target.files[0])} required />
          </div>
          <button disabled={subiendo} className="md:col-span-2 bg-red-600 text-white p-4 rounded-xl font-bold hover:bg-red-700">
            {subiendo ? "Subiendo..." : "PUBLICAR VIDEO"}
          </button>
        </form>
      </section>

      {/* LISTA DE VIDEOS (Para borrar) */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {videosExistentes.map(vid => (
          <div key={vid.id} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow">
            <div className="flex items-center gap-4">
              <img src={vid.url_miniatura} className="w-20 h-12 object-cover rounded-lg" />
              <p className="font-bold truncate w-32">{vid.titulo}</p>
            </div>
            <button onClick={() => borrarItem('videos_proyectos', vid.id)} className="text-red-500 font-bold">Borrar</button>
          </div>
        ))}
      </div>
      
      <hr />
      {/* Aquí abajo seguiría tu formulario de edificios que ya tienes... */}
    </div>
  );
};

export default Admin;