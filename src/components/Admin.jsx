import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../supabaseClient';
import imageCompression from 'browser-image-compression';
import { Trash2, Edit2, X, Video, Image as ImageIcon, CheckCircle, AlertCircle, GripVertical, HardDrive, RefreshCw } from 'lucide-react';

// --- COMPRESIÓN ---
const comprimirImagen = async (file) => {
  return await imageCompression(file, {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  });
};

// --- TOAST CENTRADO ---
function ToastCenter({ toasts, onRemove }) {
  if (toasts.length === 0) return null;
  const t = toasts[toasts.length - 1];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className={`pointer-events-auto flex flex-col items-center gap-4 px-10 py-8 rounded-2xl shadow-2xl border
        ${t.type === 'success' ? 'bg-white border-blue-500' : 'bg-white border-red-500'}`}>
        {t.type === 'success'
          ? <CheckCircle size={48} className="text-blue-500" />
          : <AlertCircle size={48} className="text-red-400" />}
        <p className={`text-sm font-black uppercase tracking-widest text-center ${t.type === 'success' ? 'text-blue-600' : 'text-red-500'}`}>
          {t.message}
        </p>
        <button onClick={() => onRemove(t.id)} className="mt-2 text-[10px] text-slate-400 hover:text-slate-800 uppercase font-bold border border-slate-300 px-4 py-1 rounded transition-colors">
          Cerrar
        </button>
      </div>
    </div>
  );
}

// --- MODAL CONFIRMACIÓN BORRADO ---
function ModalConfirmar({ visible, mensaje, onConfirmar, onCancelar }) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-red-200 p-8 flex flex-col items-center gap-5 max-w-sm w-full mx-4">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
          <Trash2 size={28} className="text-red-500" />
        </div>
        <p className="text-sm font-black uppercase tracking-widest text-slate-800 text-center">{mensaje}</p>
        <p className="text-[11px] text-slate-400 text-center">Esta acción no se puede deshacer. Se borrarán los archivos del servidor.</p>
        <div className="flex gap-3 w-full">
          <button onClick={onCancelar} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs uppercase hover:bg-slate-50 transition-colors">
            Cancelar
          </button>
          <button onClick={onConfirmar} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs uppercase transition-colors">
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

// --- BARRA DE PROGRESO SUBIDA ---
function ProgressBar({ progreso, label }) {
  if (progreso === 0) return null;
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{label}</span>
        <span className="text-[10px] text-blue-600 font-black">{progreso}%</span>
      </div>
      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${progreso}%` }} />
      </div>
    </div>
  );
}

// --- CONTADOR DE ALMACENAMIENTO ---
const LIMITE_GB = 1; // Plan gratuito Supabase
const LIMITE_BYTES = LIMITE_GB * 1024 * 1024 * 1024;

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function StorageWidget({ refrescar }) {
  const [totalBytes, setTotalBytes] = useState(null);
  const [totalArchivos, setTotalArchivos] = useState(0);
  const [cargando, setCargando] = useState(true);

  const calcularStorage = useCallback(async () => {
    setCargando(true);
    try {
      // Supabase list() trae max 100 por página, hacemos paginación
      let offset = 0;
      let todosLosArchivos = [];
      while (true) {
        const { data, error } = await supabase.storage.from('galeria').list('', {
          limit: 100,
          offset,
          sortBy: { column: 'name', order: 'asc' },
        });
        if (error || !data || data.length === 0) break;
        todosLosArchivos = [...todosLosArchivos, ...data];
        if (data.length < 100) break;
        offset += 100;
      }
      const suma = todosLosArchivos.reduce((acc, f) => acc + (f.metadata?.size || 0), 0);
      setTotalBytes(suma);
      setTotalArchivos(todosLosArchivos.length);
    } catch (err) {
      console.error('Error calculando storage:', err);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { calcularStorage(); }, [calcularStorage, refrescar]);

  const porcentaje = totalBytes !== null ? Math.min((totalBytes / LIMITE_BYTES) * 100, 100) : 0;
  const color = porcentaje > 80 ? 'bg-red-500' : porcentaje > 50 ? 'bg-yellow-500' : 'bg-green-500';
  const textColor = porcentaje > 80 ? 'text-red-600' : porcentaje > 50 ? 'text-yellow-600' : 'text-green-600';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HardDrive size={16} className="text-slate-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Almacenamiento</span>
        </div>
        <button onClick={calcularStorage} className="text-slate-400 hover:text-blue-500 transition-colors" title="Refrescar">
          <RefreshCw size={13} className={cargando ? 'animate-spin' : ''} />
        </button>
      </div>

      {cargando ? (
        <div className="space-y-2">
          <div className="h-2 bg-slate-100 rounded-full animate-pulse" />
          <div className="h-3 w-1/2 bg-slate-100 rounded animate-pulse" />
        </div>
      ) : (
        <>
          {/* Barra de uso */}
          <div className="space-y-1.5">
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${color}`}
                style={{ width: `${porcentaje}%` }}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-black ${textColor}`}>
                {formatBytes(totalBytes)} usados
              </span>
              <span className="text-[10px] text-slate-400 font-bold">
                {LIMITE_GB} GB límite
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
            <div className="text-center">
              <p className={`text-base font-black ${textColor}`}>{porcentaje.toFixed(1)}%</p>
              <p className="text-[8px] text-slate-400 uppercase font-bold">Usado</p>
            </div>
            <div className="text-center border-x border-slate-100">
              <p className="text-base font-black text-slate-700">{totalArchivos}</p>
              <p className="text-[8px] text-slate-400 uppercase font-bold">Archivos</p>
            </div>
            <div className="text-center">
              <p className="text-base font-black text-slate-700">{formatBytes(LIMITE_BYTES - totalBytes)}</p>
              <p className="text-[8px] text-slate-400 uppercase font-bold">Libres</p>
            </div>
          </div>

          {porcentaje > 80 && (
            <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
              <AlertCircle size={13} className="text-red-500 shrink-0" />
              <p className="text-[9px] text-red-600 font-bold">Almacenamiento casi lleno. Considera eliminar archivos.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// --- DRAG & DROP SORTER ---
function LaminasSorter({ archivos, onChange }) {
  const dragIndex = useRef(null);
  const [dragOver, setDragOver] = useState(null);

  const handleDragStart = (idx) => { dragIndex.current = idx; };
  const handleDragOver = (e, idx) => { e.preventDefault(); setDragOver(idx); };
  const handleDrop = (idx) => {
    if (dragIndex.current === null || dragIndex.current === idx) { setDragOver(null); return; }
    const nuevos = [...archivos];
    const [item] = nuevos.splice(dragIndex.current, 1);
    nuevos.splice(idx, 0, item);
    onChange(nuevos);
    dragIndex.current = null;
    setDragOver(null);
  };
  const handleDragEnd = () => { dragIndex.current = null; setDragOver(null); };

  return (
    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
      <p className="text-[10px] font-black text-blue-600 uppercase mb-1 tracking-widest text-center">Organizar láminas</p>
      <p className="text-[9px] text-slate-400 text-center mb-5">Arrastra las imágenes para cambiar el orden</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {archivos.map((file, idx) => (
          <div
            key={idx}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={e => handleDragOver(e, idx)}
            onDrop={() => handleDrop(idx)}
            onDragEnd={handleDragEnd}
            className={`relative rounded-xl border-2 overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-200 select-none
              ${dragOver === idx ? 'border-blue-500 scale-105 shadow-lg' : 'border-slate-200'}`}
          >
            <img src={URL.createObjectURL(file)} className="w-full aspect-square object-cover" alt={`lámina ${idx + 1}`} draggable={false} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute top-2 left-2 bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center">
              <span className="text-[10px] font-black text-white">{idx + 1}</span>
            </div>
            <div className="absolute top-2 right-2 text-white/70"><GripVertical size={14} /></div>
            <p className="absolute bottom-2 left-0 right-0 text-center text-[8px] text-white truncate px-2">{file.name}</p>
            {dragOver === idx && <div className="absolute inset-0 border-2 border-blue-500 rounded-xl bg-blue-500/10" />}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL ---
const Admin = () => {
  const [subiendo, setSubiendo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [labelProgreso, setLabelProgreso] = useState('');
  const [toasts, setToasts] = useState([]);
  const [edificiosExistentes, setEdificiosExistentes] = useState([]);
  const [videosExistentes, setVideosExistentes] = useState([]);
  const [refrescarStorage, setRefrescarStorage] = useState(0);

  const [modalBorrar, setModalBorrar] = useState({ visible: false, mensaje: '', onConfirmar: null });

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [esVoluntario, setEsVoluntario] = useState(false);
  const [miniaturaEdificio, setMiniaturaEdificio] = useState(null);
  const [archivosOrdenados, setArchivosOrdenados] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [urlsExistentes, setUrlsExistentes] = useState([]);
  const [miniaturaExistente, setMiniaturaExistente] = useState('');

  const [tituloVideo, setTituloVideo] = useState('');
  const [urlYoutube, setUrlYoutube] = useState('');
  const [miniaturaVideo, setMiniaturaVideo] = useState(null);
  const [editandoVideoId, setEditandoVideoId] = useState(null);
  const [videoThumbExistente, setVideoThumbExistente] = useState('');

  const inputMiniaturaRef = useRef(null);
  const inputLaminasRef = useRef(null);
  const inputVideoThumbRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    if (type === 'success') setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const removeToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  const confirmarBorrado = (mensaje, accion) => setModalBorrar({ visible: true, mensaje, onConfirmar: accion });
  const cerrarModal = () => setModalBorrar({ visible: false, mensaje: '', onConfirmar: null });

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    const { data: edif } = await supabase.from('edificios').select('*').order('created_at', { ascending: false });
    const { data: vids } = await supabase.from('videos_proyectos').select('*').order('created_at', { ascending: false });
    if (edif) setEdificiosExistentes(edif);
    if (vids) setVideosExistentes(vids);
  };

  const cleanName = (n) => n.replace(/[^a-zA-Z0-9.]/g, '_');
  const extraerNombre = (url) => { if (!url) return null; return url.split('/').pop().split('?')[0]; };

  const resetInputsEdificio = () => {
    if (inputMiniaturaRef.current) inputMiniaturaRef.current.value = '';
    if (inputLaminasRef.current) inputLaminasRef.current.value = '';
  };
  const resetInputsVideo = () => { if (inputVideoThumbRef.current) inputVideoThumbRef.current.value = ''; };

  const prepararEdicionEdificio = (edif) => {
    setEditandoId(edif.id); setNombre(edif.nombre); setDescripcion(edif.descripcion);
    setUrlsExistentes(edif.infografias || []); setMiniaturaExistente(edif.miniatura_url);
    setEsVoluntario(edif.es_voluntario || false); setArchivosOrdenados([]);
    setMiniaturaEdificio(null); resetInputsEdificio();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setEditandoId(null); setNombre(''); setDescripcion(''); setUrlsExistentes([]);
    setArchivosOrdenados([]); setMiniaturaExistente(''); setEsVoluntario(false);
    setMiniaturaEdificio(null); setProgreso(0); resetInputsEdificio();
  };

  const prepararEdicionVideo = (v) => {
    setEditandoVideoId(v.id); setTituloVideo(v.titulo); setUrlYoutube(v.youtube_url);
    setVideoThumbExistente(v.url_miniatura); setMiniaturaVideo(null); resetInputsVideo();
  };

  const cancelarEdicionVideo = () => {
    setEditandoVideoId(null); setTituloVideo(''); setUrlYoutube('');
    setVideoThumbExistente(''); setMiniaturaVideo(null); setProgreso(0); resetInputsVideo();
  };

  const manejarSubidaEdificio = async (e) => {
    e.preventDefault();
    if (!nombre) return showToast('Nombre obligatorio', 'error');
    setSubiendo(true); setProgreso(0);
    try {
      const totalPasos = (miniaturaEdificio ? 1 : 0) + archivosOrdenados.length;
      let pasoActual = 0;
      const avanzar = () => { pasoActual++; setProgreso(Math.round((pasoActual / totalPasos) * 100)); };

      let urlMin = miniaturaExistente;
      if (miniaturaEdificio) {
        setLabelProgreso('Comprimiendo portada...');
        const comprimida = await comprimirImagen(miniaturaEdificio);
        setLabelProgreso('Subiendo portada...');
        const name = `min_${Date.now()}_${cleanName(comprimida.name)}`;
        await supabase.storage.from('galeria').upload(name, comprimida);
        urlMin = supabase.storage.from('galeria').getPublicUrl(name).data.publicUrl;
        avanzar();
      }

      const nuevasUrls = [];
      for (let i = 0; i < archivosOrdenados.length; i++) {
        const f = archivosOrdenados[i];
        setLabelProgreso(`Comprimiendo lámina ${i + 1} de ${archivosOrdenados.length}...`);
        const comprimida = await comprimirImagen(f);
        setLabelProgreso(`Subiendo lámina ${i + 1} de ${archivosOrdenados.length}...`);
        const name = `info_${Date.now()}_${cleanName(comprimida.name)}`;
        await supabase.storage.from('galeria').upload(name, comprimida);
        nuevasUrls.push(supabase.storage.from('galeria').getPublicUrl(name).data.publicUrl);
        avanzar();
      }

      const payload = { nombre, descripcion, es_voluntario: esVoluntario, miniatura_url: urlMin, infografias: [...urlsExistentes, ...nuevasUrls] };
      if (editandoId) await supabase.from('edificios').update(payload).eq('id', editandoId);
      else await supabase.from('edificios').insert([payload]);

      showToast('¡Edificio sincronizado con éxito!', 'success');
      cancelarEdicion(); cargarDatos();
      setRefrescarStorage(r => r + 1); // refresca el widget
    } catch (err) { showToast(err.message, 'error'); }
    finally { setSubiendo(false); setProgreso(0); setLabelProgreso(''); }
  };

  const manejarSubidaVideo = async (e) => {
    e.preventDefault();
    if (!tituloVideo || !urlYoutube) return showToast('Título y URL obligatorios', 'error');
    setSubiendo(true); setProgreso(0);
    try {
      let urlMin = videoThumbExistente;
      if (miniaturaVideo) {
        setLabelProgreso('Comprimiendo miniatura...'); setProgreso(30);
        const comprimida = await comprimirImagen(miniaturaVideo);
        setLabelProgreso('Subiendo miniatura...'); setProgreso(65);
        const name = `vmin_${Date.now()}_${cleanName(comprimida.name)}`;
        await supabase.storage.from('galeria').upload(name, comprimida);
        urlMin = supabase.storage.from('galeria').getPublicUrl(name).data.publicUrl;
        setProgreso(100);
      }
      const payload = { titulo: tituloVideo, youtube_url: urlYoutube, url_miniatura: urlMin };
      if (editandoVideoId) await supabase.from('videos_proyectos').update(payload).eq('id', editandoVideoId);
      else await supabase.from('videos_proyectos').insert([payload]);

      showToast('¡Video guardado con éxito!', 'success');
      cancelarEdicionVideo(); cargarDatos();
      setRefrescarStorage(r => r + 1);
    } catch (err) { showToast(err.message, 'error'); }
    finally { setSubiendo(false); setProgreso(0); setLabelProgreso(''); }
  };

  const borrarItem = async (tabla, id, urlMin, urlsGaleria = []) => {
    confirmarBorrado('¿Eliminar permanentemente?', async () => {
      cerrarModal();
      try {
        const files = [extraerNombre(urlMin), ...urlsGaleria.map(u => extraerNombre(u))].filter(Boolean);
        if (files.length > 0) await supabase.storage.from('galeria').remove(files);
        await supabase.from(tabla).delete().eq('id', id);
        showToast('Elemento eliminado', 'error');
        cargarDatos();
        setRefrescarStorage(r => r + 1);
      } catch (err) { showToast('Error al borrar: ' + err.message, 'error'); }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-slate-900">
      <ToastCenter toasts={toasts} onRemove={removeToast} />
      <ModalConfirmar
        visible={modalBorrar.visible}
        mensaje={modalBorrar.mensaje}
        onConfirmar={modalBorrar.onConfirmar}
        onCancelar={cerrarModal}
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-8">
          <div className="flex justify-between items-end">
            <h1 className="text-3xl font-black text-blue-900 uppercase italic">Admin Central Cruz Ruiz</h1>
            <p className="text-[10px] text-slate-400 font-mono">v3.1 — Storage</p>
          </div>

          {/* FORM EDIFICIOS */}
          <section className="bg-white p-6 rounded-3xl shadow-xl border-t-4 border-blue-600 space-y-4">
            <h2 className="font-bold flex items-center gap-2 text-blue-600 uppercase text-sm">
              <ImageIcon size={18} /> {editandoId ? 'Editando Edificio' : 'Nuevo Edificio'}
            </h2>
            <form onSubmit={manejarSubidaEdificio} className="space-y-4">
              <input type="text" placeholder="NOMBRE" className="w-full p-3 bg-slate-50 rounded-xl outline-none border border-slate-200 focus:border-blue-400" value={nombre} onChange={e => setNombre(e.target.value)} required />
              <textarea placeholder="DESCRIPCIÓN" className="w-full p-3 bg-slate-50 rounded-xl outline-none border border-slate-200 focus:border-blue-400" rows="2" value={descripcion} onChange={e => setDescripcion(e.target.value)} required />

              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <input type="checkbox" id="vol" checked={esVoluntario} onChange={e => setEsVoluntario(e.target.checked)} />
                <label htmlFor="vol" className="text-[10px] font-bold uppercase cursor-pointer">Anteproyecto Voluntario (Cláusula Legal)</label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase tracking-tighter">Miniatura (JPG/PNG)</label>
                  <p className="text-[8px] text-blue-500 mb-2">↓ Se comprime a &lt;500 KB automáticamente</p>
                  {miniaturaExistente && !miniaturaEdificio && <img src={miniaturaExistente} className="w-full h-16 object-cover mb-2 rounded border" />}
                  <input ref={inputMiniaturaRef} type="file" accept="image/png, image/jpeg" onChange={e => setMiniaturaEdificio(e.target.files[0])} className="text-[10px]" />
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase tracking-tighter">Galería (JPG/PNG)</label>
                  <p className="text-[8px] text-blue-500 mb-2">↓ Se comprimen a &lt;500 KB automáticamente</p>
                  <input ref={inputLaminasRef} type="file" accept="image/png, image/jpeg" multiple onChange={e => setArchivosOrdenados(Array.from(e.target.files))} className="text-[10px]" />
                </div>
              </div>

              {archivosOrdenados.length > 0 && (
                <LaminasSorter archivos={archivosOrdenados} onChange={setArchivosOrdenados} />
              )}

              {urlsExistentes.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-slate-100 rounded-xl border border-slate-200">
                  <p className="w-full text-[9px] text-slate-400 font-bold uppercase mb-1">Láminas actuales (X para quitar)</p>
                  {urlsExistentes.map((url, i) => (
                    <div key={i} className="relative w-14 h-14 group">
                      <img src={url} className="w-full h-full object-cover rounded-lg border border-white shadow" />
                      <button type="button" onClick={() => setUrlsExistentes(urlsExistentes.filter((_, idx) => idx !== i))} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 shadow"><X size={10} className="text-white" /></button>
                    </div>
                  ))}
                </div>
              )}

              {subiendo && <ProgressBar progreso={progreso} label={labelProgreso} />}

              <div className="flex gap-2">
                <button disabled={subiendo} className="flex-grow p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold uppercase text-xs transition-colors disabled:opacity-60">
                  {subiendo ? 'Procesando...' : editandoId ? 'Guardar Cambios' : 'Publicar Edificio'}
                </button>
                {editandoId && <button type="button" onClick={cancelarEdicion} className="p-3 bg-slate-200 hover:bg-slate-300 rounded-xl transition-colors"><X size={16} /></button>}
              </div>
            </form>
          </section>

          {/* FORM VIDEOS */}
          <section className="bg-white p-6 rounded-3xl shadow-xl border-t-4 border-red-500 space-y-4">
            <h2 className="font-bold flex items-center gap-2 text-red-500 uppercase text-sm">
              <Video size={18} /> {editandoVideoId ? 'Editando Video' : 'Nuevo Recorrido'}
            </h2>
            <form onSubmit={manejarSubidaVideo} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="TÍTULO" className="p-3 bg-slate-50 rounded-xl outline-none border border-slate-200 focus:border-red-400" value={tituloVideo} onChange={e => setTituloVideo(e.target.value)} required />
                <input type="url" placeholder="LINK YOUTUBE" className="p-3 bg-slate-50 rounded-xl outline-none border border-slate-200 focus:border-red-400" value={urlYoutube} onChange={e => setUrlYoutube(e.target.value)} required />
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase tracking-tighter">Miniatura del Video (JPG/PNG)</label>
                <p className="text-[8px] text-blue-500 mb-2">↓ Se comprime a &lt;500 KB automáticamente</p>
                {videoThumbExistente && !miniaturaVideo && <img src={videoThumbExistente} className="w-32 h-16 object-cover mb-2 rounded border" />}
                <input ref={inputVideoThumbRef} type="file" accept="image/png, image/jpeg" onChange={e => setMiniaturaVideo(e.target.files[0])} className="text-[10px]" />
              </div>

              {subiendo && <ProgressBar progreso={progreso} label={labelProgreso} />}

              <div className="flex gap-2">
                <button disabled={subiendo} className="flex-grow p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold uppercase text-xs transition-colors disabled:opacity-60">
                  {subiendo ? 'Procesando...' : editandoVideoId ? 'Guardar Cambios' : 'Publicar Video'}
                </button>
                {editandoVideoId && <button type="button" onClick={cancelarEdicionVideo} className="p-3 bg-slate-200 hover:bg-slate-300 rounded-xl transition-colors"><X size={16} /></button>}
              </div>
            </form>
          </section>
        </div>

        {/* LISTADO LATERAL */}
        <div className="lg:col-span-5 space-y-6 pt-16">

          {/* WIDGET STORAGE */}
          <StorageWidget refrescar={refrescarStorage} />

          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Inventario en la Nube</h2>
          <div className="space-y-3">
            {edificiosExistentes.map(e => (
              <div key={e.id} className="bg-white p-3 rounded-2xl flex items-center justify-between shadow-sm group border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 overflow-hidden">
                  <img src={e.miniatura_url} className="w-8 h-8 object-cover rounded shadow" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase truncate w-32">{e.nombre}</span>
                    {e.es_voluntario && <span className="text-[7px] text-blue-400 font-bold uppercase">Voluntario</span>}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => prepararEdicionEdificio(e)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={14} /></button>
                  <button onClick={() => borrarItem('edificios', e.id, e.miniatura_url, e.infografias)} className="p-2 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
            {videosExistentes.map(v => (
              <div key={v.id} className="bg-white p-3 rounded-2xl flex items-center justify-between shadow-sm border-l-4 border-red-500 group hover:shadow-md transition-shadow">
                <span className="text-[10px] font-bold uppercase truncate w-40">{v.titulo}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => prepararEdicionVideo(v)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Edit2 size={14} /></button>
                  <button onClick={() => borrarItem('videos_proyectos', v.id, v.url_miniatura)} className="p-2 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;