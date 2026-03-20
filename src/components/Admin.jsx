import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Trash2, Edit2, X, Video, Image as ImageIcon, Plus } from 'lucide-react';

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

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    const { data: edif } = await supabase.from('edificios').select('*').order('created_at', { ascending: false });
    const { data: vids } = await supabase.from('videos_proyectos').select('*').order('created_at', { ascending: false });
    if (edif) setEdificiosExistentes(edif);
    if (vids) setVideosExistentes(vids);
  };

  const cleanName = (n) => n.replace(/[^a-zA-Z0-9.]/g, '_');

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

      const payload = { nombre, descripcion, es_voluntario: esVoluntario, miniatura_url: urlMin, infografias: [...urlsExistentes, ...nuevasUrls] };
      
      const { error } = editandoId 
        ? await supabase.from('edificios').update(payload).eq('id', editandoId)
        : await supabase.from('edificios').insert([payload]);

      if (error) throw error;
      alert("¡Éxito!");
      setEditandoId(null); setNombre(''); setDescripcion(''); setUrlsExistentes([]); setArchivosOrdenados([]);
      cargarDatos();
    } catch (err) { alert(err.message); } finally { setSubiendo(false); }
  };

  const manejarSubidaVideo = async (e) => {
    e.preventDefault();
    setSubiendo(true);
    try {
      const name = `vmin_${Date.now()}_${cleanName(miniaturaVideo.name)}`;
      await supabase.storage.from('galeria').upload(name, miniaturaVideo);
      const urlMin = supabase.storage.from('galeria').getPublicUrl(name).data.publicUrl;

      await supabase.from('videos_proyectos').insert([{ titulo: tituloVideo, youtube_url: urlYoutube, url_miniatura: urlMin }]);
      alert("Video subido");
      setTituloVideo(''); setUrlYoutube(''); setMiniaturaVideo(null);
      cargarDatos();
    } catch (err) { alert(err.message); } finally { setSubiendo(false); }
  };

  const borrarItem = async (tabla, id, urlMin, urlsGaleria = []) => {
    if (!confirm("¿Eliminar permanentemente?")) return;
    const files = [urlMin?.split('/').pop(), ...urlsGaleria.map(u => u.split('/').pop())].filter(Boolean);
    await supabase.storage.from('galeria').remove(files);
    await supabase.from(tabla).delete().eq('id', id);
    cargarDatos();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMNA IZQUIERDA: FORMULARIOS */}
        <div className="lg:col-span-7 space-y-8">
          <h1 className="text-3xl font-black text-blue-900 uppercase italic tracking-tighter">Panel Maestro</h1>
          
          {/* FORM EDIFICIOS */}
          <section className="bg-white p-6 rounded-3xl shadow-xl border-t-4 border-blue-600 space-y-4">
            <h2 className="font-bold flex items-center gap-2 text-blue-600 uppercase text-sm"><ImageIcon size={18}/> {editandoId ? 'Editando Proyecto' : 'Nuevo Edificio'}</h2>
            <form onSubmit={manejarSubidaEdificio} className="space-y-4">
              <input type="text" placeholder="NOMBRE" className="w-full p-3 bg-slate-50 rounded-xl outline-none" value={nombre} onChange={e => setNombre(e.target.value)} required />
              <textarea placeholder="DESCRIPCIÓN" className="w-full p-3 bg-slate-50 rounded-xl outline-none" rows="2" value={descripcion} onChange={e => setDescripcion(e.target.value)} required />
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
                <input type="checkbox" checked={esVoluntario} onChange={e => setEsVoluntario(e.target.checked)} />
                <label className="text-[10px] font-bold uppercase cursor-pointer">Anteproyecto Voluntario (Becarios)</label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="file" onChange={e => setMiniaturaEdificio(e.target.files[0])} className="text-[10px]" />
                <input type="file" multiple onChange={e => setArchivosOrdenados(Array.from(e.target.files))} className="text-[10px]" />
              </div>
              {urlsExistentes.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 bg-slate-100 rounded-lg">
                  {urlsExistentes.map((url, i) => (
                    <div key={i} className="relative w-10 h-10 group">
                      <img src={url} className="w-full h-full object-cover rounded opacity-50 group-hover:opacity-100" />
                      <button type="button" onClick={() => setUrlsExistentes(urlsExistentes.filter((_, idx) => idx !== i))} className="absolute inset-0 flex items-center justify-center text-red-600"><X size={14}/></button>
                    </div>
                  ))}
                </div>
              )}
              <button disabled={subiendo} className="w-full p-3 bg-blue-600 text-white rounded-xl font-bold uppercase text-xs">{subiendo ? 'Subiendo...' : 'Guardar Proyecto'}</button>
            </form>
          </section>

          {/* FORM VIDEOS */}
          <section className="bg-white p-6 rounded-3xl shadow-xl border-t-4 border-red-600 space-y-4">
            <h2 className="font-bold flex items-center gap-2 text-red-600 uppercase text-sm"><Video size={18}/> Nuevo Video</h2>
            <form onSubmit={manejarSubidaVideo} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="TÍTULO" className="p-3 bg-slate-50 rounded-xl outline-none" value={tituloVideo} onChange={e => setTituloVideo(e.target.value)} required />
                <input type="url" placeholder="LINK YOUTUBE" className="p-3 bg-slate-50 rounded-xl outline-none" value={urlYoutube} onChange={e => setUrlYoutube(e.target.value)} required />
              </div>
              <input type="file" onChange={e => setMiniaturaVideo(e.target.files[0])} className="text-[10px]" required />
              <button disabled={subiendo} className="w-full p-3 bg-red-600 text-white rounded-xl font-bold uppercase text-xs">{subiendo ? 'Subiendo...' : 'Publicar Video'}</button>
            </form>
          </section>
        </div>

        {/* COLUMNA DERECHA: LISTADOS */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Gestión Activa</h2>
          <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
            {edificiosExistentes.map(e => (
              <div key={e.id} className="bg-white p-3 rounded-2xl flex items-center justify-between shadow-sm group">
                <div className="flex items-center gap-3 overflow-hidden">
                  <img src={e.miniatura_url} className="w-8 h-8 object-cover rounded shadow" />
                  <span className="text-[10px] font-bold uppercase truncate w-32">{e.nombre}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditandoId(e.id); setNombre(e.nombre); setDescripcion(e.descripcion); setUrlsExistentes(e.infografias || []); setMiniaturaExistente(e.miniatura_url); setEsVoluntario(e.es_voluntario); window.scrollTo(0,0); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={14}/></button>
                  <button onClick={() => borrarItem('edificios', e.id, e.miniatura_url, e.infografias)} className="p-2 text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
            {videosExistentes.map(v => (
              <div key={v.id} className="bg-white p-3 rounded-2xl flex items-center justify-between shadow-sm border-l-4 border-red-500">
                <span className="text-[10px] font-bold uppercase truncate w-40">{v.titulo}</span>
                <button onClick={() => borrarItem('videos_proyectos', v.id, v.url_miniatura)} className="p-2 text-red-400"><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Admin;