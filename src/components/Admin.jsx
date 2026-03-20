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
  const [esVoluntario, setEsVoluntario] = useState(false);
  const [miniaturaEdificio, setMiniaturaEdificio] = useState(null);
  const [archivosOrdenados, setArchivosOrdenados] = useState([]);
  
  // --- ESTADOS PARA EDICIÓN EDIFICIOS ---
  const [editandoId, setEditandoId] = useState(null);
  const [urlsExistentes, setUrlsExistentes] = useState([]);
  const [miniaturaExistente, setMiniaturaExistente] = useState('');

  // --- ESTADOS FORMULARIO VIDEOS ---
  const [tituloVideo, setTituloVideo] = useState('');
  const [urlYoutube, setUrlYoutube] = useState('');
  const [miniaturaVideo, setMiniaturaVideo] = useState(null);
  const [editandoVideoId, setEditandoVideoId] = useState(null);
  const [videoThumbExistente, setVideoThumbExistente] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const { data: edif } = await supabase.from('edificios').select('*').order('created_at', { ascending: false });
    const { data: vids } = await supabase.from('videos_proyectos').select('*').order('created_at', { ascending: false });
    if (edif) setEdificiosExistentes(edif);
    if (vids) setVideosExistentes(vids);
  };

  const extraerNombreArchivo = (url) => {
    if (!url) return null;
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart.split('?')[0]; 
  };

  const cleanName = (n) => n.replace(/[^a-zA-Z0-9.]/g, '_');

  // --- LÓGICA PREPARAR EDICIÓN ---
  const prepararEdicionEdificio = (edif) => {
    setEditandoId(edif.id);
    setNombre(edif.nombre);
    setDescripcion(edif.descripcion);
    setEsVoluntario(edif.es_voluntario || false);
    setMiniaturaExistente(edif.miniatura_url);
    setUrlsExistentes(edif.infografias || []);
    setArchivosOrdenados([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setNombre(''); setDescripcion(''); setEsVoluntario(false);
    setMiniaturaExistente(''); setUrlsExistentes([]); setArchivosOrdenados([]);
  };

  const prepararEdicionVideo = (vid) => {
    setEditandoVideoId(vid.id);
    setTituloVideo(vid.titulo);
    setUrlYoutube(vid.youtube_url);
    setVideoThumbExistente(vid.url_miniatura);
    setMiniaturaVideo(null);
  };

  const cancelarEdicionVideo = () => {
    setEditandoVideoId(null);
    setTituloVideo(''); setUrlYoutube(''); setVideoThumbExistente(''); setMiniaturaVideo(null);
  };

  const moverArchivo = (index, direccion) => {
    const nuevosArchivos = [...archivosOrdenados];
    const file = nuevosArchivos.splice(index, 1)[0];
    const nuevaPos = direccion === 'izq' ? index - 1 : index + 1;
    nuevosArchivos.splice(nuevaPos, 0, file);
    setArchivosOrdenados(nuevosArchivos);
  };

  // --- MANEJAR SUBIDA / ACTUALIZACIÓN EDIFICIO ---
  const manejarSubidaEdificio = async (e) => {
    e.preventDefault();
    try {
      setSubiendo(true);

      let urlFinalMin = miniaturaExistente;
      if (miniaturaEdificio) {
        const nameMin = `edif_min_${Date.now()}_${cleanName(miniaturaEdificio.name)}`;
        await supabase.storage.from('galeria').upload(nameMin, miniaturaEdificio);
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

      const infografiasFinales = [...urlsExistentes, ...nuevasUrls];

      const payload = {
        nombre,
        descripcion,
        es_voluntario: esVoluntario,
        miniatura_url: urlFinalMin,
        infografias: infografiasFinales 
      };

      if (editandoId) {
        await supabase.from('edificios').update(payload).eq('id', editandoId);
        alert("¡Edificio actualizado!");
      } else {
        if (!miniaturaEdificio) throw new Error("Sube la miniatura principal");
        await supabase.from('edificios').insert([payload]);
        alert("¡Edificio publicado!");
      }

      cancelarEdicion();
      cargarDatos();
    } catch (err) { alert("Error: " + err.message); } 
    finally { setSubiendo(false); }
  };

  // --- MANEJAR SUBIDA / ACTUALIZACIÓN VIDEO ---
  const manejarSubidaVideo = async (e) => {
    e.preventDefault();
    try {
      setSubiendo(true);
      let urlFinalThumb = videoThumbExistente;

      if (miniaturaVideo) {
        const fileName = `vid_min_${Date.now()}_${cleanName(miniaturaVideo.name)}`;
        await supabase.storage.from('galeria').upload(fileName, miniaturaVideo);
        const { data } = supabase.storage.from('galeria').getPublicUrl(fileName);
        urlFinalThumb = data.publicUrl;
      }

      const payload = {
        titulo: tituloVideo,
        youtube_url: urlYoutube,
        url_miniatura: urlFinalThumb
      };

      if (editandoVideoId) {
        await supabase.from('videos_proyectos').update(payload).eq('id', editandoVideoId);
        alert("¡Video actualizado!");
      } else {
        if (!miniaturaVideo) throw new Error("Sube una miniatura para el video");
        await supabase.from('videos_proyectos').insert([payload]);
        alert("¡Video publicado!");
      }

      cancelarEdicionVideo();
      cargarDatos();
    } catch (err) { alert("Error: " + err.message); } 
    finally { setSubiendo(false); }
  };

  // --- BORRADOS ---
  const borrarEdificio = async (id, miniaturaUrl, infografiasUrls) => {
    if (!window.confirm("¿Seguro que quieres borrar este edificio?")) return;
    try {
      setSubiendo(true);
      const filesToDelete = [extraerNombreArchivo(miniaturaUrl), ...(infografiasUrls?.map(extraerNombreArchivo) || [])].filter(Boolean);
      if (filesToDelete.length > 0) await supabase.storage.from('galeria').remove(filesToDelete);
      await supabase.from('edificios').delete().eq('id', id);
      cargarDatos();
    } catch (err) { alert("Error al borrar: " + err.message); } 
    finally { setSubiendo(false); }
  };

  const borrarVideo = async (id, thumbUrl) => {
    if (!window.confirm("¿Seguro que quieres borrar este video?")) return;
    try {
      setSubiendo(true);
      const fileName = extraerNombreArchivo(thumbUrl);
      if (fileName) await supabase.storage.from('galeria').remove([fileName]);
      await supabase.from('videos_proyectos').delete().eq('id', id);
      cargarDatos();
    } catch (err) { alert("Error al borrar: " + err.message); } 
    finally { setSubiendo(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 space-y-12 text-slate-900 font-sans">
      <header className="flex justify-between items-center max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-blue-800 uppercase tracking-tighter italic">Admin <span className="text-slate-500">KOH</span></h1>
        {editandoId && <button onClick={cancelarEdicion} className="bg-red-100 text-red-600 px-4 py-2 rounded-xl text-xs font-black uppercase">Cancelar Edición</button>}
      </header>

      {/* --- FORMULARIO 1: EDIFICIOS --- */}
      <section className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-2xl border-t-8 border-blue-600">
        <h2 className="text-2xl font-black mb-6 text-slate-700 uppercase tracking-tight">
            {editandoId ? `Modificando: ${nombre}` : "Añadir Nuevo Edificio"}
        </h2>
        <form onSubmit={manejarSubidaEdificio} className="space-y-4">
          <input type="text" placeholder="Nombre del Edificio" className="w-full p-4 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none font-medium bg-slate-50" value={nombre} onChange={e => setNombre(e.target.value)} required />
          <textarea placeholder="Descripción del proyecto..." className="w-full p-4 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none font-medium bg-slate-50" rows="3" value={descripcion} onChange={e => setDescripcion(e.target.value)} required />
          
          {/* CHECKBOX LEGAL */}
          <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
            <input type="checkbox" id="legal" className="w-5 h-5 accent-blue-600 cursor-pointer" checked={esVoluntario} onChange={e => setEsVoluntario(e.target.checked)} />
            <label htmlFor="legal" className="text-sm font-bold text-blue-800 cursor-pointer select-none uppercase tracking-tight">
                ¿Es anteproyecto voluntario / becarios? (Aviso Legal)
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase">Miniatura Principal</label>
              {miniaturaExistente && !miniaturaEdificio && <img src={miniaturaExistente} className="w-20 h-20 object-cover rounded-lg mb-2 border-2 border-white shadow-sm" />}
              <input type="file" accept="image/*" className="text-xs text-slate-500" onChange={e => setMiniaturaEdificio(e.target.files[0])} />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase">Añadir Infografías</label>
              <input type="file" accept="image/*" multiple className="text-xs text-slate-500" 
                onChange={e => { if (e.target.files) setArchivosOrdenados(Array.from(e.target.files)); }} />
            </div>
          </div>

          {/* IMAGENES EXISTENTES */}
          {urlsExistentes.length > 0 && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Imágenes actuales (Clic para quitar)</p>
                  <div className="flex flex-wrap gap-3">
                      {urlsExistentes.map((url, idx) => (
                          <div key={idx} className="relative group">
                              <img src={url} className="w-16 h-16 object-cover rounded-xl border-2 border-white shadow-sm" />
                              <button type="button" onClick={() => setUrlsExistentes(urlsExistentes.filter((_, i) => i !== idx))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">X</button>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          <button disabled={subiendo} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-2xl font-black text-lg transition-all active:scale-[0.98] shadow-xl shadow-blue-200 uppercase tracking-tighter">
            {subiendo ? "Sincronizando..." : editandoId ? "GUARDAR CAMBIOS" : "PUBLICAR EDIFICIO"}
          </button>
        </form>
      </section>

      {/* --- FORMULARIO 2: VIDEOS --- */}
      <section className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-2xl border-t-8 border-red-600">
        <h2 className="text-2xl font-black mb-6 text-slate-700 uppercase tracking-tight">
            {editandoVideoId ? `Editando Video: ${tituloVideo}` : "Añadir Video YouTube"}
        </h2>
        <form onSubmit={manejarSubidaVideo} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Título" className="p-4 border-2 border-slate-100 rounded-xl focus:border-red-500 outline-none font-medium bg-slate-50" value={tituloVideo} onChange={e => setTituloVideo(e.target.value)} required />
            <input type="url" placeholder="URL YouTube" className="p-4 border-2 border-slate-100 rounded-xl focus:border-red-500 outline-none font-medium bg-slate-50" value={urlYoutube} onChange={e => setUrlYoutube(e.target.value)} required />
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase">Miniatura</label>
            {videoThumbExistente && !miniaturaVideo && <img src={videoThumbExistente} className="w-32 h-20 object-cover rounded-xl mb-2" />}
            <input type="file" accept="image/*" className="text-xs text-slate-500" onChange={e => setMiniaturaVideo(e.target.files[0])} />
          </div>
          <button disabled={subiendo} className="w-full bg-red-600 hover:bg-red-800 text-white p-5 rounded-2xl font-black text-lg transition-all active:scale-[0.98] uppercase tracking-tighter">
            {subiendo ? "Sincronizando..." : editandoVideoId ? "GUARDAR CAMBIOS VIDEO" : "PUBLICAR VIDEO"}
          </button>
          {editandoVideoId && <button type="button" onClick={cancelarEdicionVideo} className="w-full text-slate-400 font-bold text-xs uppercase">Cancelar Edición Video</button>}
        </form>
      </section>

      {/* --- LISTADO DE GESTIÓN --- */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
        <div>
          <h3 className="text-xl font-black text-blue-800 uppercase pl-2 mb-4 tracking-tighter">Gestión de Edificios</h3>
          <div className="space-y-3">
            {edificiosExistentes.map(edif => (
              <div key={edif.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between group">
                <div className="flex items-center gap-3 overflow-hidden">
                    <img src={edif.miniatura_url} className="w-10 h-10 object-cover rounded-lg border border-slate-100" />
                    <span className="truncate font-bold text-slate-700 uppercase text-sm">{edif.nombre}</span>
                    {edif.es_voluntario && <span className="text-[9px] bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-black">VOL</span>}
                </div>
                <div className="flex gap-2">
                    <button onClick={() => prepararEdicionEdificio(edif)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-xl transition-all">Editar</button>
                    <button onClick={() => borrarEdificio(edif.id, edif.miniatura_url, edif.infografias)} className="text-red-400 hover:text-red-600 p-2 rounded-xl">Borrar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-black text-red-800 uppercase pl-2 mb-4 tracking-tighter">Gestión de Videos</h3>
          <div className="space-y-3">
            {videosExistentes.map(vid => (
              <div key={vid.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between group">
                <span className="truncate font-bold text-slate-700 uppercase text-sm">{vid.titulo}</span>
                <div className="flex gap-2">
                    <button onClick={() => prepararEdicionVideo(vid)} className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all">Editar</button>
                    <button onClick={() => borrarVideo(vid.id, vid.url_miniatura)} className="text-red-400 hover:text-red-600 p-2 rounded-xl">Borrar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admin;