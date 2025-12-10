import React, { useState } from "react";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

export default function Footer() {
  const [hoverIndex, setHoverIndex] = useState(null);

  const socialLinks = [
    { icon: FaFacebookF, href: "https://www.facebook.com/profile.php?id=61565370276770", name: "Facebook", color: "#1877F2", style: { color: "#fff" }, bgHover: "from-blue-600 to-blue-500" },
    { icon: FaInstagram, href: "https://www.instagram.com/edifyconstcruzruiz?igsh=b3plMmhkaTFkOXkz", name: "Instagram", color: "#E4405F", style: { background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }, bgHover: "from-pink-600 to-purple-600" },
    { icon: FaTiktok, href: "https://www.tiktok.com/@edif.y.const.cruz?_t=ZS-8zQSdVfQj2t&_r=1", name: "TikTok", color: "#000000", style: { color: "#fff", textShadow: "2px 2px 0 #25F4EE, -2px -2px 0 #FE2C55" }, bgHover: "from-gray-800 to-gray-900" },
    { icon: SiGmail, href: "mailto:koh_construcciones@hotmail.com", name: "Gmail", color: "#D44638", style: { color: "#fff" }, bgHover: "from-red-600 to-red-500" },
    { icon: FaYoutube, href: "https://youtube.com/@edificacionesyconstruccionescr?si=FpgXwz1TC0lC6Uvw", name: "YouTube", color: "#FF0000", style: { color: "#fff" }, bgHover: "from-red-600 to-red-500" },
    { icon: FaWhatsapp, href: "https://wa.me/5215581536176", name: "WhatsApp", color: "#25D366", style: { color: "#fff" }, bgHover: "from-green-600 to-green-500" }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 
                     dark:from-black dark:via-slate-900 dark:to-blue-900/80
                     text-slate-200 py-16 lg:py-20 overflow-hidden">
      
      {/* Fondo decorativo */}
      <div className="absolute top-0 left-0 w-40 h-40 sm:w-48 sm:h-48 
                    bg-gradient-to-r from-blue-500/20 to-blue-400/20 rounded-full blur-3xl
                    animate-float opacity-30 dark:opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-40 sm:h-40 
                    bg-gradient-to-r from-amber-500/20 to-amber-400/20 rounded-full blur-2xl
                    animate-pulse opacity-25 dark:opacity-40"></div>
      
      <div className="relative z-10 text-center max-w-7xl mx-auto px-4 sm:px-6">
        {/* Título principal */}
        <h3 className="mb-8 sm:mb-12 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black 
                     animate-fadeIn text-white drop-shadow-lg
                     bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
          ¡Síguenos en nuestras redes sociales!
        </h3>

        {/* Iconos de redes sociales */}
        <div className="flex justify-center flex-wrap gap-6 sm:gap-8 mb-8 sm:mb-12 animate-slideUp">
          {socialLinks.map(({ icon: Icon, href, name, color, style, bgHover }, index) => (
            <a
              key={index}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Seguir en ${name}`}
              className={`relative p-4 sm:p-5 rounded-2xl border-2 backdrop-blur-sm 
                        transform transition-all duration-400 hover:scale-125 hover:shadow-2xl
                        group overflow-hidden
                        ${hoverIndex === index 
                          ? `bg-gradient-to-r ${bgHover} border-white/50 shadow-2xl` 
                          : `bg-slate-700/50 dark:bg-slate-800/50 border-slate-600/50 dark:border-slate-700/50 hover:border-white/30
                             shadow-xl shadow-slate-900/30 dark:shadow-black/50`}`}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <Icon
                size={window.innerWidth < 640 ? 28 : 32}
                className="relative z-10 transition-all duration-300 filter drop-shadow-lg"
                style={hoverIndex === index ? style : { color: "#fff" }} 
              />
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300
                            bg-slate-800/90 dark:bg-black/80 text-white text-xs px-3 py-1 rounded-lg
                            pointer-events-none whitespace-nowrap backdrop-blur-sm">
                {name}
              </div>
            </a>
          ))}
        </div>

        {/* Línea divisoria */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-8"></div>

        {/* Información de la empresa */}
        <div className="bg-gradient-to-br from-slate-800/60 via-slate-700/50 to-blue-800/40 
                      dark:from-slate-800/80 dark:via-slate-900/60 dark:to-blue-900/50
                      rounded-3xl p-6 sm:p-8 border-2 border-slate-600/60 dark:border-slate-700
                      backdrop-blur-sm animate-fadeIn card-shadow hover:shadow-2xl hover:shadow-blue-500/20
                      dark:hover:shadow-blue-400/20
                      transform hover:scale-[1.02] transition-all duration-500">
          
          <p className="text-white text-lg sm:text-xl lg:text-2xl mb-3 font-bold
                       bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent
                       drop-shadow-sm">
            &copy; 2025 Edificaciones y Construcciones Cruz Ruiz
          </p>
          <p className="text-slate-300 text-sm sm:text-base lg:text-lg font-medium
                       leading-relaxed">
            Construyendo el futuro con calidad y responsabilidad
          </p>
        </div>

        {/* Marca de agua */}
        <div className="mt-6 text-xs text-slate-500 font-medium">
          Diseño moderno • Experiencia profesional • Calidad garantizada
        </div>
      </div>
    </footer>
  );
}
