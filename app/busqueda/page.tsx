'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BedDouble, Bath, Ruler, CarFront, Search, Filter } from 'lucide-react';
import dynamic from 'next/dynamic';

const MapaResultados = dynamic(() => import('@/components/MapaResultados'), { ssr: false });

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
    tipo: string;
    ubicacion: {
      center: [number, number];
    };
    categoria?: { data?: { attributes: { nombreCategoria: string } } };
    imagenes: { data: { attributes: { url: string; formats: { large?: { url: string } } } }[] };
  };
}
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
  const [types, setTypes] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;

  useEffect(() => {
   fetch(`${baseUrl}/api/inmuebles?filters[active][$eq]=true&populate=imagenes,categoria,ubicacion`)
      .then(res => res.json())
      .then(json => {
        const datos: Inmueble[] = json.data || [];
        setInmuebles(datos);
        setFiltered(datos);

        const cats = Array.from(
          new Set(
            datos.map(i => i.attributes.categoria?.data?.attributes.nombreCategoria).filter((c): c is string => Boolean(c))
          )
        );
        setCategories(cats);

        const tiposUnicos = Array.from(new Set(datos.map(i => i.attributes.tipo).filter(t => !!t)));
        setTypes(tiposUnicos);
      })
      .catch(console.error);
  }, [baseUrl]);

  useEffect(() => {
    let lista = inmuebles;

    if (query) {
      const q = query.toLowerCase();
      lista = lista.filter(({ attributes }) =>
        attributes.Direccion.toLowerCase().includes(q) || attributes.inmuebleName.toLowerCase().includes(q)
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
        selectedRooms === 5 ? attributes.dormitorios >= 5 : attributes.dormitorios === selectedRooms
      );
    }

    if (selectedBathrooms !== 'Any') {
      lista = lista.filter(({ attributes }) =>
        selectedBathrooms === 5 ? attributes.banos >= 5 : attributes.banos === selectedBathrooms
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
  }, [query, inmuebles, minPrice, maxPrice, selectedRooms, selectedBathrooms, selectedType, selectedCategory]);

  const handleSearch = useCallback((e: React.FormEvent) => e.preventDefault(), []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Listado */}
      <aside className="w-1/2 overflow-y-auto bg-gray-50 p-4">
        <div className="flex items-center justify-between mb-4">
          <form onSubmit={handleSearch} className="flex items-center flex-grow">
            <Search className="w-5 h-5 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Ciudad, barrio, código postal..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-grow px-3 py-2 border rounded-lg focus:outline-none"
            />
          </form>
          <button
            onClick={() => setShowFilters(f => !f)}
            className="ml-4 p-2 bg-blue-600 text-white rounded-lg flex items-center"
          >
            <Filter className="w-5 h-5 mr-1" /> Filtros
          </button>
        </div>

        {/* Filtros */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow space-y-4 mb-4">
            {/* Precio */}
            <div>
              <label className="font-semibold">Precio (USD)</label>
              <div className="flex gap-2 mt-2">
                <input type="number" placeholder="Min" value={minPrice}
                  onChange={e => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-1/2 px-2 py-1 border rounded" />
                <input type="number" placeholder="Max" value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-1/2 px-2 py-1 border rounded" />
              </div>
            </div>

            {/* Dormitorios */}
            <div>
              <label className="font-semibold">Dormitorios</label>
              <div className="flex gap-2 mt-2">
                {['Any', 1, 2, 3, 4, 5].map(val => (
                  <button key={val} onClick={() => setSelectedRooms(val as any)}
                    className={`px-3 py-1 border rounded ${selectedRooms === val ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                    {val === 'Any' ? 'Cualquiera' : val === 5 ? '5+' : val}
                  </button>
                ))}
              </div>
            </div>

            {/* Baños */}
            <div>
              <label className="font-semibold">Baños</label>
              <div className="flex gap-2 mt-2">
                {['Any', 1, 2, 3, 4, 5].map(val => (
                  <button key={val} onClick={() => setSelectedBathrooms(val as any)}
                    className={`px-3 py-1 border rounded ${selectedBathrooms === val ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                    {val === 'Any' ? 'Cualquiera' : val === 5 ? '5+' : val}
                  </button>
                ))}
              </div>
            </div>

            {/* Tipo */}
            <div>
              <label className="font-semibold">Tipo de inmueble</label>
              <select value={selectedType} onChange={e => setSelectedType(e.target.value)}
                className="w-full mt-2 px-2 py-1 border rounded">
                <option>Todos</option>
                {types.map(t => (<option key={t} value={t}>{t}</option>))}
              </select>
            </div>

            {/* Categoría */}
            <div>
              <label className="font-semibold">Categoría</label>
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                className="w-full mt-2 px-2 py-1 border rounded">
                <option>Todos</option>
                {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
              </select>
            </div>

            <button onClick={() => setShowFilters(false)}
              className="mt-4 w-full py-2 bg-blue-600 text-white rounded">
              Aplicar filtros
            </button>
          </div>
        )}

        {/* Listado de inmuebles */}
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          {filtered.map(({ id, attributes }) => {
            const { inmuebleName, slug, precio, Direccion, dormitorios, banos, terreno, estacionamientos, imagenes, categoria } = attributes;
            const imgUrl = imagenes.data[0]?.attributes.formats.large?.url || imagenes.data[0]?.attributes.url;
            const catLabel = categoria?.data?.attributes.nombreCategoria || '';

            return (
              <motion.div key={id} className="bg-white rounded-xl shadow hover:shadow-xl overflow-hidden" whileHover={{ scale: 1.02 }}>
                <div className="relative h-40 w-full">
                  <Image src={`${baseUrl}${imgUrl}`} alt={inmuebleName} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                  <span className="absolute top-2 left-2 bg-white text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">
                    {catLabel.toUpperCase()}
                  </span>
                </div>
                <div className="p-3 space-y-1">
                  <h3 className="text-blue-800 font-bold text-lg">${precio.toLocaleString()}</h3>
                  <p className="text-sm font-semibold text-gray-700">{Direccion}</p>
                  <div className="flex gap-2 text-xs text-gray-600 mt-1">
                    {dormitorios > 0 && <div className="flex items-center gap-1"><BedDouble className="w-4 h-4" />{dormitorios}</div>}
                    {banos > 0 && <div className="flex items-center gap-1"><Bath className="w-4 h-4" />{banos}</div>}
                    {terreno > 0 && <div className="flex items-center gap-1"><Ruler className="w-4 h-4" />{terreno} m²</div>}
                    {estacionamientos > 0 && <div className="flex items-center gap-1"><CarFront className="w-4 h-4" />{estacionamientos}</div>}
                  </div>
                  <Link href={`/inmueble/${slug}`} className="text-sm text-blue-600 font-semibold">Ver detalle →</Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </aside>

      {/* Mapa */}
<div className="w-1/2 h-screen relative overflow-hidden">

  <MapaResultados inmuebles={filtered} />
</div>
    </div>
  );
}
