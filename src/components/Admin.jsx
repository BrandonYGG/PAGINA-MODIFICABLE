import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Trash2, Edit2, X, Video, Image as ImageIcon, Plus, Save } from 'lucide-react';

const Admin = () => {
  const [subiendo, setSubiendo] = useState(false);
  const [edificiosExistentes, setEdificiosExistentes] = useState([]);
  const [videosExistentes, setVideosExistentes] = useState([]);

  // Estados Edificios
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [esVoluntario, setEsVoluntario] = useState(false);
  const [miniaturaEdificio, setMiniaturaEdificio] = useState(null);
  const [archivosOrdenados, setArchivosOrdenados] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [urlsExistentes, setUrlsExistentes] = useState([]);
  const [miniaturaExistente, setMiniaturaExistente] = useState('');

  // Estados Videos
  const [tituloVideo, setTituloVideo] = useState('');
  const [urlYoutube, setUrlYoutube] = useState('');
  const [miniaturaVideo, setMiniaturaVideo] = useState(null);
  const [editandoVideoId, setEditandoVideoId] = useState(null);
  const [videoThumbExistente, setVideoThumbExistente] = useState('');

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    const { data: edif } = await supabase.from('edificios').select('*').order('created_at', { ascending: false });
    const { data: vids } = await supabase.from('videos_proyectos').select('*').order('created_at', { ascending: false });
    if (edif) setEdificiosExistentes(edif);
    if (vids) setVideosExistentes(vids);
  };

  const cleanName = (n) => n.replace(/[^a-zA-Z0-9.]/g, '_');

  // Extraer nombre real del archivo para borrar en Storage
  const extraerNombre = (url) => {
    if (!url) return null;
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart.split('?')[0]; 
  };

  const manejarSubidaEdificio = async (e) => {
    e.preventDefault();
    setSubiendo(true);
    try {
      let urlMin = miniaturaExistente;
      if (miniaturaEdificio) {
        const name = `min_${Date.now()}_${cleanName(miniaturaEdificio.name)}`;
        await supabase.storage.from('galeria').upload(name, miniaturaEdificio);
        urlMin = supabase.storage.from('galeria').getPublicUrl(name).data.publicUrl;
      }

      const nuevasUrls = [];
      for (const f of archivosOrdenados) {
        const name = `info_${Date.now()}_${cleanName(f.name)}`;
        await supabase.storage.from('galeria').upload(name, f);
        nuevasUrls.push(supabase.storage.from('galeria').getPublicUrl(name).data.publicUrl);
      }

      const payload = { 
        nombre, 
        descripcion, 
        es_voluntario: esVoluntario, 
        miniatura_url: urlMin, 
        infografias: [...urlsExistentes, ...nuevasUrls] 
      };
      
      if (editandoId) await supabase.from('edificios').update(payload).eq('id', editandoId);
      else await supabase.from('edificios').insert([payload]);

      alert("Sincronización completa");
      cancelarEdicion();
      cargarDatos();
    } catch (err) { alert(err.message); } finally { setSubiendo(false); }
  };

  const manejarSubidaVideo = async (e) => {
    e.preventDefault();
    setSubiendo(true);
    try {
      let urlMin = videoThumbExistente;
      if (miniaturaVideo) {
        const name = `vmin_${Date.now()}_${cleanName(miniaturaVideo.name)}`;
        await supabase.storage.from('galeria').upload(name, miniaturaVideo);
        urlMin = supabase.storage.from('galeria').getPublicUrl(name).data.publicUrl;
      }

      const payload = { titulo: tituloVideo, youtube_url: urlYoutube, url_miniatura: urlMin };
      
      if (editandoVideoId) await supabase.from('videos_proyectos').update(payload).eq('id', editandoVideoId);
      else await supabase.from('videos_proyectos').insert([payload]);

      alert("Video guardado");
      cancelarEdicionVideo();
      cargarDatos();
    } catch (err) { alert(err.message); } finally { setSubiendo(false); }
  };

  const borrarItem = async (tabla, id, urlMin, urlsGaleria = []) => {
    if (!confirm("¿Eliminar permanentemente? Se borrarán los archivos del servidor.")) return;
    try {
      const files = [extraerNombre(urlMin), ...urlsGaleria.map(u => extraerNombre(u))].filter(Boolean);
      if (files.length > 0) await supabase.storage.from('galeria').remove(files);
      await supabase.from(tabla).delete().eq('id', id);
      cargarDatos();
    } catch (err) { alert("Error al borrar: " + err.message); }
  };

  const cancelarEdicion = () => {
    setEditandoId(null); setNombre(''); setDescripcion(''); setUrlsExistentes([]); setArchivosOrdenados([]); setMiniaturaExistente(''); setEsVoluntario(false);
  };

  const cancelarEdicionVideo = () => {
    setEditandoVideoId(null); setTituloVideo(''); setUrlYoutube(''); setVideoThumbExistente(''); setMiniaturaVideo(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-7 space-y-8">
          <h1 className="text-3xl font-black text-blue-900 uppercase italic">Admin Central KOH</h1>
          
          {/* FORM EDIFICIOS */}
          <section className="bg-white p-6 rounded-3xl shadow-xl border-t-4 border-blue-600 space-y-4">
            <h2 className="font-bold flex items-center gap-2 text-blue-600 uppercase text-sm">
              <ImageIcon size={18}/> {editandoId ? 'Editando Edificio' : 'Nuevo Edificio'}
            </h2>
            <form onSubmit={manejarSubidaEdificio} className="space-y-4">
              <input type="text" placeholder="NOMBRE" className="w-full p-3 bg-slate-50 rounded-xl outline-none" value={nombre} onChange={e => setNombre(e.target.value)} required />
              <textarea placeholder="DESCRIPCIÓN" className="w-full p-3 bg-slate-50 rounded-xl outline-none" rows="2" value={descripcion} onChange={e => setDescripcion(e.target.value)} required />
              
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
                <input type="checkbox" id="vol" checked={esVoluntario} onChange={e => setEsVoluntario(e.target.checked)} />
                <label htmlFor="vol" className="text-[10px] font-bold uppercase cursor-pointer">Anteproyecto Voluntario (Cláusula Legal)</label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase tracking-tighter">Miniatura (JPG/PNG)</label>
                  <input type="file" accept="image/png, image/jpeg" onChange={e => setMiniaturaEdificio(e.target.files[0])} className="text-[10px]" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase tracking-tighter">Galería (JPG/PNG)</label>
                  <input type="file" accept="image/png, image/jpeg" multiple onChange={e => setArchivosOrdenados(Array.from(e.target.files))} className="text-[10px]" />
                </div>
              </div>

              {urlsExistentes.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 bg-slate-100 rounded-lg">
                  {urlsExistentes.map((url, i) => (
                    <div key={i} className="relative w-12 h-12 group">
                      <img src={url} className="w-full h-full object-cover rounded border border-white" />
                      <button type="button" onClick={() => setUrlsExistentes(urlsExistentes.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-600/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-600"><X size={16}/></button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <button disabled={subiendo} className="flex-grow p-3 bg-blue-600 text-white rounded-xl font-bold uppercase text-xs">
                  {subiendo ? 'Subiendo...' : editandoId ? 'Guardar Cambios' : 'Publicar Edificio'}
                </button>
                {editandoId && <button type="button" onClick={cancelarEdicion} className="p-3 bg-slate-200 rounded-xl"><X size={16}/></button>}
              </div>
            </form>
          </section>

          {/* FORM VIDEOS */}
          <section className="bg-white p-6 rounded-3xl shadow-xl border-t-4 border-red-600 space-y-4">
            <h2 className="font-bold flex items-center gap-2 text-red-600 uppercase text-sm">
                <Video size={18}/> {editandoVideoId ? 'Editando Video' : 'Nuevo Recorrido'}
            </h2>
            <form onSubmit={manejarSubidaVideo} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="TÍTULO" className="p-3 bg-slate-50 rounded-xl outline-none" value={tituloVideo} onChange={e => setTituloVideo(e.target.value)} required />
                <input type="url" placeholder="LINK YOUTUBE" className="p-3 bg-slate-50 rounded-xl outline-none" value={urlYoutube} onChange={e => setUrlYoutube(e.target.value)} required />
              </div>
              <div>
                 <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase tracking-tighter">Miniatura del Video (JPG/PNG)</label>
                 <input type="file" accept="image/png, image/jpeg" onChange={e => setMiniaturaVideo(e.target.files[0])} className="text-[10px]" />
              </div>
              <div className="flex gap-2">
                <button disabled={subiendo} className="flex-grow p-3 bg-red-600 text-white rounded-xl font-bold uppercase text-xs">
                  {subiendo ? 'Sincronizando...' : editandoVideoId ? 'Guardar Cambios' : 'Publicar Video'}
                </button>
                {editandoVideoId && <button type="button" onClick={cancelarEdicionVideo} className="p-3 bg-slate-200 rounded-xl"><X size={16}/></button>}
              </div>
            </form>
          </section>
        </div>

        {/* LISTADO LATERAL */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Inventario en la Nube</h2>
          <div className="space-y-3">
            {edificiosExistentes.map(e => (
              <div key={e.id} className="bg-white p-3 rounded-2xl flex items-center justify-between shadow-sm group border-l-4 border-blue-500">
                <div className="flex items-center gap-3 overflow-hidden">
                  <img src={e.miniatura_url} className="w-8 h-8 object-cover rounded shadow" />
                  <span className="text-[10px] font-bold uppercase truncate w-32">{e.nombre}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => prepararEdicionEdificio(e)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={14}/></button>
                  <button onClick={() => borrarItem('edificios', e.id, e.miniatura_url, e.infografias)} className="p-2 text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
            {videosExistentes.map(v => (
              <div key={v.id} className="bg-white p-3 rounded-2xl flex items-center justify-between shadow-sm border-l-4 border-red-500 group">
                <span className="text-[10px] font-bold uppercase truncate w-40">{v.titulo}</span>
                <div className="flex gap-1">
                    <button onClick={() => prepararEdicionVideo(v)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Edit2 size={14}/></button>
                    <button onClick={() => borrarItem('videos_proyectos', v.id, v.url_miniatura)} className="p-2 text-red-400"><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

// Función auxiliar para llenar el form de edición rápidamente
const prepararEdicionEdificio = (edif, setEditandoId, setNombre, setDescripcion, setUrlsExistentes, setMiniaturaExistente, setEsVoluntario) => {
    setEditandoId(edif.id);
    setNombre(edif.nombre);
    setDescripcion(edif.descripcion);
    setUrlsExistentes(edif.infografias || []);
    setMiniaturaExistente(edif.miniatura_url);
    setEsVoluntario(edif.es_voluntario || false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

export default Admin;