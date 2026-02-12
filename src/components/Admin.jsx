import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Admin = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [miniatura, setMiniatura] = useState(null);
  const [infografias, setInfografias] = useState([]);
  const [subiendo, setSubiendo] = useState(false);
  const [proyectosExistentes, setProyectosExistentes] = useState([]);

  // Cargar la lista de proyectos al entrar
  const cargarProyectos = async () => {
    const { data, error } = await supabase
      .from('edificios')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) setProyectosExistentes(data);
  };

  useEffect(() => {
    cargarProyectos();
  }, []);

  // Función para BORRAR proyectos (Texto + Archivos físicos)
  const borrarProyecto = async (proyecto) => {
    const confirmar = window.confirm(`¿Estás seguro de que quieres borrar "${proyecto.nombre}"? Se eliminarán también todas sus imágenes de la nube.`);
    
    if (confirmar) {
      try {
        // 1. Extraer los nombres de los archivos de las URLs
        // Las URLs tienen el formato: .../storage/v1/object/public/galeria/nombre_archivo.jpg
        const extraerNombre = (url) => url.split('/').pop();

        const nombreMiniatura = extraerNombre(proyecto.miniatura_url);
        const nombresInfografias = proyecto.infografias.map(url => extraerNombre(url));
        
        const todosLosArchivos = [nombreMiniatura, ...nombresInfografias];

        // 2. Borrar archivos físicos del Storage
        const { error: errorStorage } = await supabase
          .storage
          .from('galeria') 
          .remove(todosLosArchivos);

        if (errorStorage) {
          console.warn("Aviso: Algunos archivos no se pudieron borrar del Storage:", errorStorage.message);
        }

        // 3. Borrar la fila de la base de datos
        const { error: errorDB } = await supabase
          .from('edificios')
          .delete()
          .eq('id', proyecto.id);

        if (errorDB) throw errorDB;

        alert("Proyecto y archivos eliminados con éxito");
        cargarProyectos(); // Recargar la lista automáticamente

      } catch (error) {
        alert("Error al eliminar: " + error.message);
      }
    }
  };

  const manejarSubida = async (e) => {
    e.preventDefault();
    if (!miniatura || infografias.length === 0) return alert("Sube la miniatura y al menos una infografía");

    try {
      setSubiendo(true);

      // 1. Subir Miniatura
      const nameMin = `min_${Date.now()}_${miniatura.name}`;
      await supabase.storage.from('galeria').upload(nameMin, miniatura);
      const { data: urlMin } = supabase.storage.from('galeria').getPublicUrl(nameMin);

      // 2. Subir Infografías (Múltiples)
      const urlsInfografias = [];
      for (const foto of infografias) {
        const nameInfo = `info_${Date.now()}_${foto.name}`;
        await supabase.storage.from('galeria').upload(nameInfo, foto);
        const { data: urlInfo } = supabase.storage.from('galeria').getPublicUrl(nameInfo);
        urlsInfografias.push(urlInfo.publicUrl);
      }

      // 3. Guardar en Tabla de base de datos
      const { error } = await supabase.from('edificios').insert([{
        nombre,
        descripcion,
        miniatura_url: urlMin.publicUrl,
        infografias: urlsInfografias 
      }]);

      if (error) throw error;
      
      alert("¡Proyecto publicado con éxito!");
      // Limpiar formulario y recargar lista
      setNombre('');
      setDescripcion('');
      setMiniatura(null);
      setInfografias([]);
      cargarProyectos();

    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-6 md:p-10">
      {/* FORMULARIO DE SUBIDA */}
      <form onSubmit={manejarSubida} className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
        <h1 className="text-3xl font-black text-blue-600">Panel Administrador</h1>
        
        <div>
          <label className="block font-bold mb-2 dark:text-white">Nombre del Proyecto</label>
          <input type="text" className="w-full p-3 rounded-xl border dark:bg-slate-700 dark:text-white" value={nombre} onChange={e => setNombre(e.target.value)} required />
        </div>

        <div>
          <label className="block font-bold mb-2 dark:text-white">Descripción</label>
          <textarea className="w-full p-3 rounded-xl border dark:bg-slate-700 dark:text-white" rows="4" value={descripcion} onChange={e => setDescripcion(e.target.value)} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-bold mb-2 dark:text-white">Miniatura (Principal)</label>
            <input type="file" accept="image/*" onChange={e => setMiniatura(e.target.files[0])} className="text-sm dark:text-slate-300" />
          </div>
          <div>
            <label className="block font-bold mb-2 dark:text-white">Infografías (Carrusel)</label>
            <input type="file" accept="image/*" multiple onChange={e => setInfografias(Array.from(e.target.files))} className="text-sm dark:text-slate-300" />
          </div>
        </div>

        <button type="submit" disabled={subiendo} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-xl hover:bg-blue-700 transition-all disabled:opacity-50">
          {subiendo ? "Subiendo Archivos..." : "PUBLICAR PROYECTO"}
        </button>
      </form>

      {/* LISTA DE PROYECTOS PARA BORRAR */}
      <div className="max-w-2xl mx-auto mt-12 space-y-6">
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">Gestión de Proyectos Existentes</h2>
        <div className="grid grid-cols-1 gap-4">
          {proyectosExistentes.length > 0 ? (
            proyectosExistentes.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-md border dark:border-slate-700">
                <div className="flex items-center space-x-4">
                  <img src={p.miniatura_url} alt="" className="w-16 h-16 rounded-lg object-cover border dark:border-slate-600" />
                  <div>
                    <h3 className="font-bold dark:text-white">{p.nombre}</h3>
                    <p className="text-xs text-slate-500">Subido el {new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                {/* Enviamos el objeto 'p' completo para poder extraer las URLs de las fotos al borrar */}
                <button 
                  onClick={() => borrarProyecto(p)}
                  className="bg-red-100 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all text-sm"
                >
                  Borrar
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-500 py-10">No hay proyectos en la nube aún.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;