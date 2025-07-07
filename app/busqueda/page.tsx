'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BedDouble, Bath, Ruler, CarFront, Search, Filter } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Inmueble } from '@/types/inmueble';

const MapaResultados = dynamic(() => import('@/components/MapaResultados'), {
  ssr: false,
  loading: () => <p>Cargando mapa...</p>
});

export default function PaginaResultados() {
  const [query, setQuery] = useState('');
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const [filtered, setFiltered] = useState<Inmueble[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [selectedRooms, setSelectedRooms] = useState<number | 'Any'>('Any');
  const [selectedBathrooms, setSelectedBathrooms] = useState<number | 'Any'>('Any');
  const [selectedType, setSelectedType] = useState<string>('Todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedCity, setSelectedCity] = useState<string>('Todos');
  const [types, setTypes] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';

  useEffect(() => {
    const fetchInmuebles = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/inmuebles?filters[active][$eq]=true&populate=imagenes,categoria,ubicacion`);
        const json = await res.json();
        const datos: Inmueble[] = json.data || [];

        setInmuebles(datos);
        setFiltered(datos);

        const cats = Array.from(
          new Set(
            datos.map(i => i.attributes.categoria?.data?.attributes.nombreCategoria).filter(Boolean) as string[]
          )
        );
        setCategories(cats);

        const tiposUnicos = Array.from(new Set(datos.map(i => i.attributes.tipo).filter(Boolean) as string[]));
        setTypes(tiposUnicos);

        const ciudadesUnicas = Array.from(new Set(datos.map(i => i.attributes.ciudad).filter(Boolean) as string[]));
        setCities(ciudadesUnicas);
      } catch (error) {
        console.error('Error fetching inmuebles:', error);
      }
    };

    fetchInmuebles();
  }, [baseUrl]);

  useEffect(() => {
    let lista = inmuebles;

    if (selectedCity !== 'Todos') {
      lista = lista.filter(({ attributes }) => attributes.ciudad === selectedCity);
    }

    if (query) {
      const q = query.toLowerCase();
      lista = lista.filter(({ attributes }) =>
        attributes.Direccion.toLowerCase().includes(q) ||
        attributes.inmuebleName.toLowerCase().includes(q) ||
        attributes.ciudad.toLowerCase().includes(q)
      );
    }

    if (minPrice !== '' || maxPrice !== '') {
      lista = lista.filter(({ attributes }) => {
        const p = attributes.precio;
        return (minPrice === '' || p >= minPrice) && (maxPrice === '' || p <= maxPrice);
      });
    }

    if (selectedRooms !== 'Any') {
      lista = lista.filter(({ attributes }) =>
        selectedRooms === 5 ? attributes.dormitorios! >= 5 : attributes.dormitorios === selectedRooms
      );
    }

    if (selectedBathrooms !== 'Any') {
      lista = lista.filter(({ attributes }) =>
        selectedBathrooms === 5 ? attributes.banos! >= 5 : attributes.banos === selectedBathrooms
      );
    }

    if (selectedType !== 'Todos') {
      lista = lista.filter(({ attributes }) => attributes.tipo === selectedType);
    }

    if (selectedCategory !== 'Todos') {
      lista = lista.filter(
        ({ attributes }) => attributes.categoria?.data?.attributes.nombreCategoria === selectedCategory
      );
    }

    setFiltered(lista);
  }, [query, inmuebles, minPrice, maxPrice, selectedRooms, selectedBathrooms, selectedType, selectedCategory, selectedCity]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-1/2 overflow-y-auto bg-gray-50 p-4">
        {/* Filtros y buscador se mantienen como estaban, ver código original completo */}

        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          {filtered.map(({ id, attributes }) => {
            const imgUrl = attributes.imagenes?.data?.[0]?.attributes.formats?.large?.url ||
              attributes.imagenes?.data?.[0]?.attributes.url || '';
            const catLabel = attributes.categoria?.data?.attributes.nombreCategoria || '';

            return (
              <motion.div key={id} className="bg-white rounded-xl shadow hover:shadow-xl overflow-hidden" whileHover={{ scale: 1.02 }}>
                <div className="relative h-40 w-full">
                  <Image
                    src={`${baseUrl}${imgUrl}`}
                    alt={attributes.inmuebleName}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="bg-white text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">
                      {catLabel.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-blue-800 font-bold text-lg">${attributes.precio.toLocaleString()}</h3>
                    {attributes.tipo && (
                      <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {attributes.tipo}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-700">{attributes.Direccion}</p>
                  <p className="text-xs text-gray-500">{attributes.ciudad}</p>
                  <div className="flex gap-2 text-xs text-gray-600 mt-1">
                    {attributes.dormitorios && (
                      <div className="flex items-center gap-1">
                        <BedDouble className="w-4 h-4" />
                        {attributes.dormitorios}
                      </div>
                    )}
                    {attributes.banos && (
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        {attributes.banos}
                      </div>
                    )}
                    {attributes.terreno && (
                      <div className="flex items-center gap-1">
                        <Ruler className="w-4 h-4" />
                        {attributes.terreno} m²
                      </div>
                    )}
                    {attributes.estacionamientos && (
                      <div className="flex items-center gap-1">
                        <CarFront className="w-4 h-4" />
                        {attributes.estacionamientos}
                      </div>
                    )}
                  </div>
                  <motion.div whileHover="hover" initial="rest" animate="rest" className="relative w-fit mt-2">
                    <Link href={`/inmueble/${attributes.slug}`} className="text-sm text-blue-600 font-semibold">
                      Ver detalles →
                    </Link>
                    <motion.span
                      variants={{ rest: { width: 0 }, hover: { width: '100%' } }}
                      transition={{ duration: 0.3 }}
                      className="absolute left-0 bottom-0 h-[2px] bg-blue-600"
                    />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </aside>

      <div className="w-1/2 h-screen relative overflow-hidden">
        <MapaResultados
          inmuebles={filtered}
          ciudadSeleccionada={selectedCity !== 'Todos' ? selectedCity : null}
        />
      </div>
    </div>
  );
}