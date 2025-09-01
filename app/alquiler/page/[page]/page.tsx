'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  BedDouble,
  Bath,
  Ruler,
  CarFront,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Asesoramiento from '@/components/asesoramiento';

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
    tipo?: string | null;
    imagenes: {
      data: {
        attributes: {
          url: string;
          formats: {
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

// TitleCase limpio
const toTitleCase = (s?: string | null) =>
  (s ?? '')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

// Pluralización sencilla en ES (no perfecta, pero cubre casos comunes)
const pluralizeEs = (s: string) => {
  const lower = s.toLowerCase();
  if (lower === 'otros') return 'Otros';
  if (/[aeiou]$/i.test(s)) return s + 's';
  if (/z$/i.test(s)) return s.slice(0, -1) + 'ces';
  return s + 'es';
};

const PAGE_SIZE_SECTION = 3;

const AlquilerPage = () => {
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageBySection, setPageBySection] = useState<Record<string, number>>({});
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${baseUrl}/api/inmuebles?populate=*&filters[categoria][nombreCategoria][$eq]=En alquiler&filters[active][$eq]=true&pagination[page]=1&pagination[pageSize]=200&sort=createdAt:desc`
        );
        const json = await res.json();
        setInmuebles(json.data || []);
      } catch (error) {
        console.error('Error al cargar inmuebles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseUrl]);

  // Agrupar por tipo
  const grupos = useMemo(() => {
    const map = new Map<string, Inmueble[]>();
    for (const item of inmuebles) {
      const rawTipo = item.attributes.tipo?.trim();
      const key = rawTipo && rawTipo.length > 0 ? toTitleCase(rawTipo) : 'Otros';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries()).sort((a, b) =>
      a[0].localeCompare(b[0], 'es', { sensitivity: 'base' })
    );
  }, [inmuebles]);

  // helpers navegación por sección
  const nextPage = (section: string, total: number) => {
    setPageBySection((prev) => {
      const current = prev[section] ?? 0;
      const totalPages = Math.ceil(total / PAGE_SIZE_SECTION);
      return { ...prev, [section]: (current + 1) % totalPages };
    });
  };

  const prevPage = (section: string, total: number) => {
    setPageBySection((prev) => {
      const current = prev[section] ?? 0;
      const totalPages = Math.ceil(total / PAGE_SIZE_SECTION);
      return { ...prev, [section]: (current - 1 + totalPages) % totalPages };
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.3 }}
      className="relative z-10 -mt-14"
    >
      {/* Banner */}
      <div className="relative h-[60vh] w-full bg-gradient-to-br from-[#001E6C] via-[#0038a2] to-[#0057b7] flex items-center justify-center text-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-white text-4xl sm:text-5xl font-extrabold drop-shadow-lg leading-tight">
            Alquileres hechos para ti
          </h1>
          <p className="mt-4 text-white text-lg drop-shadow-md max-w-2xl mx-auto">
            Explora inmuebles en alquiler ideales para vivir, trabajar o emprender. Encuentra tu espacio ideal en Tarija.
          </p>
        </motion.div>
      </div>

      {/* Contenido */}
      <div className="relative bg-white rounded-t-[2rem] shadow-xl -mt-12 z-10">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 space-y-12">
          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1c39bb]" />
            </div>
          )}

          {/* Vacío */}
          {!loading && grupos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">No hay inmuebles disponibles en alquiler por el momento.</p>
            </div>
          )}

          {/* Secciones */}
          {!loading &&
            grupos.map(([tipoSeccionRaw, lista]) => {
              const tipoSeccion = toTitleCase(tipoSeccionRaw);
              const tituloPlural = pluralizeEs(tipoSeccion);
              const total = lista.length;
              const sectionPage = pageBySection[tipoSeccion] ?? 0;
              const start = sectionPage * PAGE_SIZE_SECTION;
              const items = total > PAGE_SIZE_SECTION ? lista.slice(start, start + PAGE_SIZE_SECTION) : lista;
              const showNav = total > PAGE_SIZE_SECTION;

              return (
                <div key={tipoSeccion} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-[#001E6C]">{tituloPlural}</h2>
                      <span className="text-sm text-gray-500">
                        {total} {total === 1 ? 'propiedad' : 'propiedades'}
                      </span>
                    </div>

                    {showNav && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => prevPage(tipoSeccion, total)}
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                          aria-label="Anterior"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => nextPage(tipoSeccion, total)}
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                          aria-label="Siguiente"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {items.map(({ id, attributes }) => {
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
                        tipo,
                      } = attributes;

                      const imagenUrl =
                        imagenes?.data?.[0]?.attributes?.formats?.large?.url ||
                        imagenes?.data?.[0]?.attributes?.url ||
                        '';

                      return (
                        <motion.div
                          key={id}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white border rounded-xl shadow hover:shadow-xl overflow-hidden transition"
                        >
                          <div className="relative h-[220px] w-full">
                            <Image
                              src={`${baseUrl}${imagenUrl}`}
                              alt={inmuebleName}
                              fill
                              className="object-cover"
                            />
                            <span className="absolute top-3 left-3 bg-white text-[#001E6C] text-xs font-bold px-3 py-1 rounded-full shadow">
                              {categoria?.data?.attributes?.nombreCategoria?.toUpperCase() || 'ALQUILER'}
                            </span>
                          </div>

                          <div className="p-4 space-y-2">
                            <div className="flex justify-between items-start">
                              <h3 className="text-[#001E6C] font-bold text-lg">
                                ${precio.toLocaleString('es-ES')}
                              </h3>
                              {tipo && (
                                <span className="bg-[#1c39bb] text-white text-xs font-bold px-2 py-1 rounded-md">
                                  {toTitleCase(tipo)}
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-semibold text-gray-800 line-clamp-2">{Direccion}</p>

                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-gray-600 mt-3">
                              {dormitorios > 0 && (
                                <div className="flex items-center gap-1">
                                  <BedDouble className="w-4 h-4" /> {dormitorios}
                                </div>
                              )}
                              {banos > 0 && (
                                <div className="flex items-center gap-1">
                                  <Bath className="w-4 h-4" /> {banos}
                                </div>
                              )}
                              {terreno > 0 && (
                                <div className="flex items-center gap-1">
                                  <Ruler className="w-4 h-4" /> {terreno}m²
                                </div>
                              )}
                              {estacionamientos > 0 && (
                                <div className="flex items-center gap-1">
                                  <CarFront className="w-4 h-4" /> {estacionamientos}
                                </div>
                              )}
                            </div>

                            <motion.div whileHover="hover" initial="rest" animate="rest" className="relative w-fit mt-4">
                              <Link href={`/inmueble/${slug}`} className="text-sm text-[#1c39bb] font-semibold tracking-wide px-1 py-1">
                                Ver detalles →
                              </Link>
                              <motion.span
                                variants={{ rest: { width: 0 }, hover: { width: '100%' } }}
                                transition={{ duration: 0.3 }}
                                className="absolute left-0 bottom-0 h-[2px] bg-[#1c39bb]"
                              />
                            </motion.div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Asesoramiento */}
        <div className="mt-24">
          <Asesoramiento />
        </div>
      </div>
    </motion.section>
  );
};

export default AlquilerPage;
