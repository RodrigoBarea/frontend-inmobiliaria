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
  loading: () => <p>Cargando mapa...</p>,
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
        const res = await fetch(
          `${baseUrl}/api/inmuebles?filters[active][$eq]=true&populate=imagenes,categoria,ubicacion`,
        );
        const json = await res.json();
        const datos: Inmueble[] = json.data || [];

        setInmuebles(datos);
        setFiltered(datos);

        const cats = Array.from(
          new Set(
            datos
              .map((i) => i.attributes.categoria?.data?.attributes.nombreCategoria)
              .filter(Boolean) as string[],
          ),
        );
        setCategories(cats);

        const tiposUnicos = Array.from(
          new Set(datos.map((i) => i.attributes.tipo).filter(Boolean) as string[]),
        );
        setTypes(tiposUnicos);

        const ciudadesUnicas = Array.from(
          new Set(datos.map((i) => i.attributes.ciudad).filter(Boolean) as string[]),
        );
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
        attributes.ciudad.toLowerCase().includes(q),
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
        selectedRooms === 5 ? attributes.dormitorios >= 5 : attributes.dormitorios === selectedRooms,
      );
    }

    if (selectedBathrooms !== 'Any') {
      lista = lista.filter(({ attributes }) =>
        selectedBathrooms === 5 ? attributes.banos >= 5 : attributes.banos === selectedBathrooms,
      );
    }

    if (selectedType !== 'Todos') {
      lista = lista.filter(({ attributes }) => attributes.tipo === selectedType);
    }

    if (selectedCategory !== 'Todos') {
      lista = lista.filter(
        ({ attributes }) => attributes.categoria?.data?.attributes.nombreCategoria === selectedCategory,
      );
    }

    setFiltered(lista);
  }, [
    query,
    inmuebles,
    minPrice,
    maxPrice,
    selectedRooms,
    selectedBathrooms,
    selectedType,
    selectedCategory,
    selectedCity,
  ]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
  }, []);

  return (
    // En mobile: columna; en desktop: fila con altura de pantalla
    <div className="flex flex-col md:flex-row md:h-screen">
      {/* Sidebar: full width en mobile; 1/2 en desktop */}
      <aside className="w-full md:w-1/2 bg-gray-50 md:overflow-y-auto">
        {/* Header sticky con buscador/ciudad/filtros */}
        <div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur supports-[backdrop-filter]:bg-gray-50/80 border-b border-gray-200">
          <div className="p-4 space-y-3 md:space-y-0 md:flex md:items-center md:justify-between md:gap-3">
            <form onSubmit={handleSearch} className="flex items-center flex-1">
              <Search className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Ciudad, barrio, código postal..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none"
              />
            </form>

            <div className="grid grid-cols-2 gap-2 md:flex md:items-center md:gap-3 md:w-auto">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="Todos">Todas las ciudades</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowFilters((f) => !f)}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center"
              >
                <Filter className="w-5 h-5 mr-1" /> Filtros
              </button>
            </div>
          </div>

          {/* Contenedor de filtros (visible al abrir) */}
          {showFilters && (
            <div className="bg-white p-4 space-y-4 border-t border-gray-200">
              <div>
                <label className="font-semibold">Categoría</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full mt-2 px-2 py-1 border rounded"
                >
                  <option value="Todos">Todos</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold">Tipo de inmueble</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full mt-2 px-2 py-1 border rounded"
                >
                  <option value="Todos">Todos</option>
                  {types.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold">Precio (USD)</label>
                <div className="flex gap-2 mt-2">
                  <input
                    type="number"
                    placeholder="Mínimo"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-1/2 px-2 py-1 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Máximo"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-1/2 px-2 py-1 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold">Dormitorios</label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {['Any', 1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setSelectedRooms(val === 'Any' ? 'Any' : Number(val))}
                      className={`px-3 py-1 border rounded ${
                        selectedRooms === (val === 'Any' ? 'Any' : Number(val))
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100'
                      }`}
                    >
                      {val === 'Any' ? 'Cualquiera' : val === '5' ? '5+' : val}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold">Baños</label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {['Any', 1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setSelectedBathrooms(val === 'Any' ? 'Any' : Number(val))}
                      className={`px-3 py-1 border rounded ${
                        selectedBathrooms === (val === 'Any' ? 'Any' : Number(val))
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100'
                      }`}
                    >
                      {val === 'Any' ? 'Cualquiera' : val === '5' ? '5+' : val}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="mt-2 w-full py-2 bg-blue-600 text-white rounded"
              >
                Aplicar filtros
              </button>
            </div>
          )}
        </div>

        {/* Lista de resultados */}
        <div className="p-4 grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          {filtered.map(({ id, attributes }) => {
            const imgUrl =
              attributes.imagenes?.data?.[0]?.attributes?.formats?.large?.url ||
              attributes.imagenes?.data?.[0]?.attributes?.url ||
              '';
            const catLabel = attributes.categoria?.data?.attributes.nombreCategoria || '';

            return (
              <motion.div
                key={id}
                className="bg-white rounded-xl shadow hover:shadow-xl overflow-hidden"
                whileHover={{ scale: 1.02 }}
              >
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
                    <h3 className="text-blue-800 font-bold text-lg">
                      ${attributes.precio.toLocaleString()}
                    </h3>
                    {attributes.tipo && (
                      <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {attributes.tipo}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-700">{attributes.Direccion}</p>
                  <p className="text-xs text-gray-500">{attributes.ciudad}</p>
                  <div className="flex gap-2 text-xs text-gray-600 mt-1">
                    {attributes.dormitorios > 0 && (
                      <div className="flex items-center gap-1">
                        <BedDouble className="w-4 h-4" />
                        {attributes.dormitorios}
                      </div>
                    )}
                    {attributes.banos > 0 && (
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        {attributes.banos}
                      </div>
                    )}
                    {(attributes.terreno || 0) > 0 && (
                      <div className="flex items-center gap-1">
                        <Ruler className="w-4 h-4" />
                        {attributes.terreno} m²
                      </div>
                    )}
                    {(attributes.estacionamientos || 0) > 0 && (
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

      {/* Mapa: ocupa 50vh en mobile y pantalla completa en desktop */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative">
        <MapaResultados
          inmuebles={filtered}
          ciudadSeleccionada={selectedCity !== 'Todos' ? selectedCity : null}
        />
      </div>
    </div>
  );
}
