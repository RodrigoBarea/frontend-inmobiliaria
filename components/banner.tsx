"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const BannerPrincipal = () => {
  const router = useRouter();

  return (
    <section className="relative w-full h-[700px] overflow-hidden">
      {/* Imagen de fondo */}
      <Image
        src="/banner-principal.jpg"
        alt="Fachada de inmueble moderno en Tarija al atardecer"
        fill
        style={{ objectFit: "cover", objectPosition: "center" }}
        priority
      />

      {/* Overlay degradado */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Contenido centrado */}
      <div className="absolute inset-0 flex flex-col justify-center items-center px-6 md:px-12 lg:px-24 text-white text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold max-w-3xl leading-relaxed drop-shadow"
        >
          Tenemos el inmueble ideal para ti.
        </motion.h1>

        {/* Botón estilo buscador con menor separación */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => router.push("/busqueda")}
          aria-label="Buscar propiedades"
          className={
            "mt-8 sm:mt-10 md:mt-12 lg:mt-16 " +
            "flex items-center justify-between " +
            "w-full max-w-2xl h-14 px-6 " +
            "bg-white rounded-full shadow-lg " +
            "cursor-pointer hover:shadow-xl transition-all " +
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          }
        >
          <span className="text-gray-400 text-sm sm:text-base">
            Busca propiedades en Tarija y Bolivia…
          </span>
          <div className="flex items-center justify-center w-10 h-10 bg-[#001E6C] rounded-full">
            <Search className="text-white w-5 h-5" />
          </div>
        </motion.button>
      </div>
    </section>
  );
};

export default BannerPrincipal;