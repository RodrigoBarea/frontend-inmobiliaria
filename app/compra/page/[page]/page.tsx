'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BedDouble,
  Bath,
  Ruler,
  CarFront,
  ChevronLeft,
  ChevronRight,
  Filter,
  X
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
    tipo: string;
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

const ITEMS_PER_PAGE = 9;

const CompraPage = () => {
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [tiposInmuebles, setTiposInmuebles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(params?.page as string) || 1;
  const currentFilter = searchParams.get('tipo') || '';

  const fetchTiposUnicos = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/inmuebles?fields[0]=tipo&pagination[pageSize]=100`);
      const data = await res.json();
      
      if (!data || !data.data || !Array.isArray(data.data)) {
        console.error("Estructura de datos inesperada:", data);
        return;
      }

      const tipos: string[] = data.data
        .map((inmueble: any) => {
          const tipo = inmueble.attributes?.tipo;
          return typeof tipo === 'string' ? tipo.trim() : null;
        })
        .filter((tipo: string | null): tipo is string => tipo !== null && tipo !== '');

      const tiposUnicos: string[] = [];
      const tiposVistos = new Set<string>();
      
      tipos.forEach((tipo: string) => {
        const lowerCaseTipo = tipo.toLowerCase();
        if (!tiposVistos.has(lowerCaseTipo)) {
          tiposVistos.add(lowerCaseTipo);
          tiposUnicos.push(tipo);
        }
      });

      tiposUnicos.sort((a, b) => a.localeCompare(b));
      setTiposInmuebles(tiposUnicos);
    } catch (error) {
      console.error("Error al cargar tipos de inmuebles:", error);
      setTiposInmuebles([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchTiposUnicos();
        
        const filterQuery = currentFilter ? `&filters[tipo][$eqi]=${encodeURIComponent(currentFilter)}` : '';
        const res = await fetch(
          `${baseUrl}/api/inmuebles?populate=*&filters[categoria][nombreCategoria][$eq]=En Venta${filterQuery}&pagination[page]=${page}&pagination[pageSize]=${ITEMS_PER_PAGE}`
        );
        const json = await res.json();
        
        setInmuebles(json.data || []);
        setTotalItems(json.meta?.pagination?.total || 0);
      } catch (error) {
        console.error('Error al cargar inmuebles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseUrl, page, currentFilter]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const handleFilterChange = async (tipo: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tipo', tipo);
    
    await router.replace(`/compra/page/1?${params.toString()}`, {
      scroll: false
    });
    
    // Hace scroll suave hasta la sección de inmuebles
    document.getElementById('inmuebles-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const clearFilters = async () => {
    await router.replace('/compra/page/1', {
      scroll: false
    });
    
    document.getElementById('inmuebles-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const getPaginatedUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `/compra/page/${pageNumber}?${params.toString()}`;
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.3 }}
      className="relative z-10 -mt-14"
    >
      {/* Banner con texto fijo */}
      <div className="relative h-[60vh] w-full">
        <Image
          src="/banner-compra.jpg"
          alt="Banner compra"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-white text-4xl sm:text-5xl font-extrabold drop-shadow-lg leading-tight">
              Inmuebles en venta
            </h1>
            <p className="mt-4 text-white text-lg drop-shadow-md max-w-2xl mx-auto">
              Tenemos el inmueble ideal para ti
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contenido principal con ID para scroll */}
      <div 
        id="inmuebles-section"
        className="relative bg-white rounded-t-[2rem] shadow-xl -mt-12 z-10"
      >
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 space-y-12">
          {/* Sección de filtros */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Filtrar por tipo de propiedad:
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  !currentFilter
                    ? 'bg-[#1c39bb] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={clearFilters}
              >
                Todos
              </button>
              
              {tiposInmuebles.map((tipo) => (
                <button
                  key={tipo}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    currentFilter.toLowerCase() === tipo.toLowerCase()
                      ? 'bg-[#1c39bb] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => handleFilterChange(tipo)}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1c39bb]"></div>
            </div>
          )}

          {/* Grid de propiedades */}
          {!loading && (
            <>
              {inmuebles.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {inmuebles.map(({ id, attributes }) => {
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
                      tipo
                    } = attributes;

                    const imagenUrl = imagenes?.data?.[0]?.attributes?.formats?.large?.url || 
                                     imagenes?.data?.[0]?.attributes?.url || '';

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
                            {categoria?.data?.attributes?.nombreCategoria?.toUpperCase() || 'EN VENTA'}
                          </span>
                        </div>

                        <div className="p-4 space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className="text-[#001E6C] font-bold text-lg">
                              ${precio.toLocaleString('es-ES')}
                            </h3>
                            {tipo && (
                              <span className="bg-[#1c39bb] text-white text-xs font-bold px-2 py-1 rounded-md">
                                {tipo}
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                            {Direccion}
                          </p>

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

                          {/* Botón Ver detalles con efecto */}
                          <motion.div
                            whileHover="hover"
                            initial="rest"
                            animate="rest"
                            className="relative w-fit mt-4"
                          >
                            <Link
                              href={`/inmueble/${slug}`}
                              className="text-sm text-[#1c39bb] font-semibold tracking-wide px-1 py-1"
                            >
                              Ver detalles →
                            </Link>
                            <motion.span
                              variants={{
                                rest: { width: 0 },
                                hover: { width: '100%' },
                              }}
                              transition={{ duration: 0.3 }}
                              className="absolute left-0 bottom-0 h-[2px] bg-[#1c39bb]"
                            />
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-600">
                    No encontramos propiedades con los filtros seleccionados
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 bg-[#1c39bb] text-white rounded-lg hover:bg-[#142a7a] transition"
                  >
                    Mostrar todas las propiedades
                  </button>
                </div>
              )}

              {/* Paginación */}
              {inmuebles.length > 0 && totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-10">
                  {page > 1 ? (
                    <Link
                      href={getPaginatedUrl(page - 1)}
                      className="px-3 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Link>
                  ) : (
                    <button disabled className="px-3 py-2 rounded-full text-sm font-semibold bg-gray-200 text-gray-400 cursor-not-allowed">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => (
                    <Link
                      key={i + 1}
                      href={getPaginatedUrl(i + 1)}
                      className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition ${
                        i + 1 === page
                          ? 'bg-[#1c39bb] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {i + 1}
                    </Link>
                  ))}

                  {page < totalPages ? (
                    <Link
                      href={getPaginatedUrl(page + 1)}
                      className="px-3 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  ) : (
                    <button disabled className="px-3 py-2 rounded-full text-sm font-semibold bg-gray-200 text-gray-400 cursor-not-allowed">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Sección de asesoramiento */}
        <div className="mt-24">
          <Asesoramiento />
        </div>
      </div>
    </motion.section>
  );
};

export default CompraPage;