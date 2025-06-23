'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
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
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const params = useParams();
  const page = parseInt(params?.page as string) || 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/api/inmuebles?populate=*&filters[categoria][nombreCategoria][$eq]=En Venta&filters[active][$eq]=true&pagination[page]=${page}&pagination[pageSize]=${ITEMS_PER_PAGE}`
        );
        const json = await res.json();
        setInmuebles(json.data || []);
        setTotalItems(json.meta?.pagination?.total || 0);
      } catch (error) {
        console.error('Error al cargar inmuebles en venta:', error);
      }
    };

    fetchData();
  }, [baseUrl, page]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.3 }}
      className="relative z-10 -mt-14"
    >
      {/* Banner con overlay oscuro y texto llamativo */}
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
              Tenemos el inmueble perfecto <br /> para ti en Tarija
            </h1>
            <p className="mt-4 text-white text-lg drop-shadow-md max-w-2xl mx-auto">
              Explora casas, departamentos y terrenos en venta cuidadosamente seleccionados para ti.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contenido principal con curvatura superior */}
      <div className="relative bg-white rounded-t-[2rem] shadow-xl -mt-12 z-10">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 space-y-12">
          <div className="text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#001E6C]">
              Propiedades en venta
            </h2>
          </div>

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
              } = attributes;

              const imagenUrl =
                imagenes?.data?.[0]?.attributes?.formats?.large?.url ||
                imagenes?.data?.[0]?.attributes?.url || '';

              const nombreCategoria =
                categoria?.data?.attributes?.nombreCategoria || 'EN VENTA';

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
                      {nombreCategoria.toUpperCase()}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="text-[#001E6C] font-bold text-base">
                      ${precio.toLocaleString()}
                    </h3>
                    <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                      {Direccion}
                    </p>

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

                    <motion.div
                      whileHover="hover"
                      initial="rest"
                      animate="rest"
                      className="relative w-fit mt-2"
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

          {/* Paginación corregida */}
          <div className="flex justify-center items-center gap-2 pt-10">
            {/* Anterior */}
            {page <= 1 ? (
              <button
                disabled
                className="px-3 py-2 rounded-full text-sm font-semibold bg-gray-200 text-gray-400 cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            ) : (
              <Link
                href={`/compra/page/${page - 1}`}
                className="px-3 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
            )}

            {Array.from({ length: totalPages }, (_, i) => (
              <Link
                key={i + 1}
                href={`/compra/page/${i + 1}`}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold ${
                  i + 1 === page
                    ? 'bg-[#1c39bb] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {i + 1}
              </Link>
            ))}

            {/* Siguiente */}
            {page >= totalPages ? (
              <button
                disabled
                className="px-3 py-2 rounded-full text-sm font-semibold bg-gray-200 text-gray-400 cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <Link
                href={`/compra/page/${page + 1}`}
                className="px-3 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <ChevronRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>

        {/* Asesoramiento */}
        <div className="mt-24">
          <Asesoramiento />
        </div>
      </div>
    </motion.section>
  );
};

export default CompraPage;


