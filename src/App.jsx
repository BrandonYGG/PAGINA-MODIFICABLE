import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Nosotros from "./components/Nosotros";
import Gallery from "./components/Gallery";
import VideoGallery from "./components/VideoGallery"; // <-- 1. IMPORTAMOS LA NUEVA SECCIÓN
import Footer from "./components/Footer";
import Detalle from "./pages/Detalle"; 
import Admin from "./components/Admin"; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Página principal (Home) */}
        <Route
          path="/"
          element={
            <div id="home" className="App min-h-screen">
              <Navbar />
              <Hero />
              <Nosotros />
              <Gallery />
              {/* 2. INSERTAMOS LA GALERÍA DE VIDEOS AQUÍ */}
              <VideoGallery /> 
              <Footer />
            </div>
          }
        />

        {/* Ruta de administración para el cliente */}
        <Route path="/admin-proyectos-secret" element={<Admin />} />

        {/* Ruta de detalle actualizada para aceptar un ID de infografía */}
        <Route path="/detalle/:infoId" element={<Detalle />} />
        
        {/* Redirección para la ruta antigua /detalle a una por defecto */}
        <Route path="/detalle" element={<Navigate to="/detalle/Info1" replace />} />
      </Routes>
    </Router>
  );
}

export default App;