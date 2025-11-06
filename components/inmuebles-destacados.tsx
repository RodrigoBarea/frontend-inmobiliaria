"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BedDouble, Bath, Ruler, CarFront } from "lucide-react";

interface Inmueble {
  id: number;
  attributes: {
    inmuebleName: string;
    slug: string;
    precio: number;
    Direccion: string;
    dormitorios: number;
    banos: number;
    terreno: number;
    estacionamientos: number;
    isFeatured: boolean;
    tipo: string; // Añadido el campo tipo
    imagenes: {
      data: {
        attributes: {
          url: string;
          formats: {
            medium?: { url: string };
            large?: { url: string };
          };
        };
      }[]; 
    };
    categoria?: {
      data?: {
        attributes?: {
          nombreCategoria: string;
        };
      };
    };
  };
}

// Función para mezclar aleatoriamente
function shuffleArray(array: Inmueble[]) {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

const InmueblesDestacados = () => {
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/api/inmuebles?populate=*&filters[isFeatured][$eq]=true&filters[active][$eq]=true`
        );
        const json = await res.json();
        const shuffled = shuffleArray(json.data);
        setInmuebles(shuffled);
      } catch (error) {
        console.error("Error al cargar inmuebles:", error);
      }
    };

    fetchData();
  }, [baseUrl]);

  // Detección de dispositivos móviles
  const isMobile = window.innerWidth <= 768;

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      className="relative z-10 -mt-14 bg-white rounded-t-3xl shadow-xl py-20"
      style={{
        // Desactivar animación en móviles
        animation: isMobile ? "none" : "", 
      }}
    >
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Encabezado */}
        <div className="text-left">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#001E6C]">
            Propiedades destacadas
          </h2>
          <p className="text-gray-600 mt-2">
            Descubre algunas de nuestras mejores casas, departamentos y más.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {inmuebles.slice(0, 9).map((inmueble) => {
            const {
              inmuebleName,
              slug,
              precio,
              Direccion,
              dormitorios,
              banos,
              terreno,
              estacionamientos,
              imagenes,
              categoria,
              tipo // Obtenemos el tipo del inmueble
            } = inmueble.attributes;

            // Modificación para obtener la URL completa de la imagen desde Cloudinary
            const imagenUrl =
              imagenes?.data?.[0]?.attributes?.formats?.large?.url ||
              imagenes?.data?.[0]?.attributes?.url ||
              "";

            const fullImageUrl =
              imagenUrl.startsWith("https://res.cloudinary.com")
                ? imagenUrl
                : `${baseUrl}${imagenUrl}`;

            const nombreCategoria =
              categoria?.data?.attributes?.nombreCategoria || "EN VENTA";

            return (
              <motion.div
                key={inmueble.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white border rounded-xl shadow hover:shadow-lg overflow-hidden transition"
              >
                {/* Imagen */}
                <div className="relative h-[220px] w-full">
                  <Image
                    src={fullImageUrl} // Usamos la URL completa desde Cloudinary
                    alt={inmuebleName}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-white text-[#001E6C] text-xs font-bold px-3 py-1 rounded-full shadow">
                    {nombreCategoria.toUpperCase()}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-[#001E6C] font-bold text-base">
                      ${precio.toLocaleString()}
                    </h3>
                    {/* Mostramos el tipo de inmueble */}
                    {tipo && (
                      <span className="bg-[#1c39bb] text-white text-xs font-bold px-2 py-1 rounded-md">
                        {tipo}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                    {Direccion}
                  </p>

                  {/* Características */}
                  <div className="flex flex-wrap gap-x-4 text-xs font-semibold text-gray-600 mt-2">
                    {dormitorios > 0 && (
                      <div className="flex items-center gap-1">
                        <BedDouble className="w-4 h-4" /> {dormitorios} dorm.
                      </div>
                    )}
                    {banos > 0 && (
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4" /> {banos} baños
                      </div>
                    )}
                    {terreno > 0 && (
                      <div className="flex items-center gap-1">
                        <Ruler className="w-4 h-4" /> {terreno} m²
                      </div>
                    )}
                    {estacionamientos > 0 && (
                      <div className="flex items-center gap-1">
                        <CarFront className="w-4 h-4" /> {estacionamientos} estac.
                      </div>
                    )}
                  </div>

                  {/* Ver detalles con animación */}
                  <motion.div
                    whileHover="hover"
                    initial="rest"
                    animate="rest"
                    className="relative w-fit mt-2"
                  >
                    <Link
                      href={`/inmueble/${slug}`}
                      className="text-sm text-[#1c39bb] font-semibold tracking-wide"
                    >
                      Ver detalles →
                    </Link>
                    <motion.span
                      variants={{
                        rest: { width: 0 },
                        hover: { width: "100%" },
                      }}
                      transition={{ duration: 0.3 }}
                      className="absolute left-0 -bottom-[2px] h-[2px] bg-[#1c39bb]"
                    />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Botón Ver más */}
        {inmuebles.length > 9 && (
          <div className="text-center pt-6">
            <Link
              href="/destacados/page/1"
              className="inline-block bg-[#1c39bb] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#12267a] transition"
            >
              Ver más propiedades destacadas
            </Link>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default InmueblesDestacados;
