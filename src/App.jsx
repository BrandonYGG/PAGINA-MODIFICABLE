import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Componentes de la página principal
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Nosotros from "./components/Nosotros";
import Servicios from "./components/Servicios"; // <-- 1. IMPORTAMOS SERVICIOS
import Gallery from "./components/Gallery";
import VideoGallery from "./components/VideoGallery";
import Maquinaria from "./components/Maquinaria"; 
import Footer from "./components/Footer";

// Páginas secundarias
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
              {/* 2. INSERTAMOS SERVICIOS AQUÍ */}
              <Servicios /> 
              <Gallery />
              <VideoGallery /> 
              <Maquinaria /> 
              <Footer />
            </div>
          }
        />

        {/* Ruta de administración */}
        <Route path="/admin-proyectos-secret" element={<Admin />} />

        {/* Ruta de detalle */}
        <Route path="/detalle/:infoId" element={<Detalle />} />
        
        {/* Redirección por defecto para detalles */}
        <Route path="/detalle" element={<Navigate to="/detalle/Info1" replace />} />
      </Routes>
    </Router>
  );
}

export default App;