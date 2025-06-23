'use client';

import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { BedDouble, Bath, Ruler, CarFront, Phone, Mail, Briefcase, MessageCircle, Camera } from 'lucide-react';

const MapaDetalle = dynamic(() => import('@/components/MapaDetalle'), { ssr: false });

export default function InmueblePage({ params }: { params: { slug: string } }) {
  const [inmueble, setInmueble] = useState<any>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inmuebles?filters[slug][$eq]=${params.slug}&populate=imagenes,categoria,ubicacion,agente.fotoPrincipal`)
      .then(res => res.json())
      .then(json => {
        if (!json.data?.length) return notFound();
        setInmueble(json.data[0]);
      });
  }, [params.slug]);

  const renderDescripcion = (blocks: any[]) => {
    return blocks.map((block, index) => {
      if (block.type === 'paragraph') {
        return (
          <p key={index} className="text-base leading-relaxed">
            {block.children?.map((child: any) => child.text).join(' ')}
          </p>
        );
      }
      if (block.type === 'heading') {
        return (
          <h3 key={index} className="font-bold text-lg mt-4">
            {block.children?.map((child: any) => child.text).join(' ')}
          </h3>
        );
      }
      return null;
    });
  };

  if (!inmueble) return <div className="p-8">Cargando inmueble...</div>;

  const {
    inmuebleName,
    precio,
    Direccion,
    dormitorios,
    banos,
    terreno,
    estacionamientos,
    tipo,
    descripcion,
    construccion,
    imagenes,
    categoria,
    ubicacion,
    agente
  } = inmueble.attributes;

  const imageList: string[] = imagenes.data.map((img: any) => `${process.env.NEXT_PUBLIC_BACKEND_URL}${img.attributes.formats?.large?.url || img.attributes.url}`);
  const lightboxSlides = imageList.map((url) => ({ src: url }));
  const agenteInfo = agente?.data?.attributes;
  const fotoAgente = agenteInfo?.fotoPrincipal?.data?.attributes?.url;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Galería optimizada */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative h-[500px] rounded-lg overflow-hidden cursor-pointer" onClick={() => setLightboxOpen(true)}>
          <Image src={imageList[0]} alt={inmuebleName} fill className="object-cover transition-transform duration-300 hover:scale-105" />
        </div>
        <div className="space-y-2">
          {imageList.slice(1, 4).map((url: string, i: number) => (
            <div key={i} className="relative h-[120px] rounded-lg overflow-hidden cursor-pointer" onClick={() => setLightboxOpen(true)}>
              <Image src={url} alt={`img-${i}`} fill className="object-cover transition-transform duration-300 hover:scale-105" />
            </div>
          ))}
          {imageList.length > 4 && (
            <div className="relative h-[120px] rounded-lg overflow-hidden bg-black cursor-pointer group" onClick={() => setLightboxOpen(true)}>
              <Image src={imageList[4]} alt="Ver todas" fill className="object-cover opacity-60 group-hover:opacity-80" />
              <div className="absolute inset-0 flex items-center justify-center text-white font-semibold text-lg">Ver todas</div>
            </div>
          )}
        </div>
      </div>

      <Lightbox open={lightboxOpen} close={() => setLightboxOpen(false)} slides={lightboxSlides} />

      {/* Título y precio */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{inmuebleName}</h1>
        <p className="text-lg text-gray-600">{Direccion}</p>
        <div className="text-4xl font-extrabold text-blue-800 mt-2">${precio.toLocaleString()}</div>
      </div>

      {/* Características */}
      <div className="flex flex-wrap gap-6 text-base text-gray-700 border-b pb-4">
        {dormitorios > 0 && <div className="flex items-center gap-2"><BedDouble className="w-5 h-5" />{dormitorios} Dorm</div>}
        {banos > 0 && <div className="flex items-center gap-2"><Bath className="w-5 h-5" />{banos} Baños</div>}
        {terreno > 0 && <div className="flex items-center gap-2"><Ruler className="w-5 h-5" />{terreno} m²</div>}
        {estacionamientos > 0 && <div className="flex items-center gap-2"><CarFront className="w-5 h-5" />{estacionamientos} Parqueos</div>}
      </div>

      {/* Ficha técnica */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-100 p-4 rounded-lg text-center text-base">
        <div><span className="block text-gray-500">Tipo</span>{tipo}</div>
        <div><span className="block text-gray-500">Categoría</span>{categoria?.data?.attributes.nombreCategoria}</div>
        <div><span className="block text-gray-500">Construcción</span>{construccion || 'N/D'} m²</div>
        <div><span className="block text-gray-500">Terreno</span>{terreno || 'N/D'} m²</div>
      </div>

      {/* Descripción + Tarjeta del agente */}
      {descripcion && (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="prose max-w-none flex-1">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Descripción</h2>
            {Array.isArray(descripcion) ? renderDescripcion(descripcion) : <p>{descripcion}</p>}
          </div>

          {agenteInfo && (
            <div className="bg-white shadow-md border rounded-lg p-4 w-full lg:w-80 flex flex-col items-center text-center animate-fade-in">
              {fotoAgente && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${fotoAgente}`}
                  alt="Agente"
                  width={80}
                  height={80}
                  className="rounded-full mb-3 object-cover"
                />
              )}
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{agenteInfo.agentName}</h3>
              <p className="text-gray-600 text-sm mb-1 flex items-center gap-1"><Briefcase className="w-4 h-4" />{agenteInfo.cargo}</p>
              <p className="text-gray-600 text-sm mb-1 flex items-center gap-1"><Phone className="w-4 h-4" />{agenteInfo.telefono}</p>
              <p className="text-gray-600 text-sm mb-4 flex items-center gap-1"><Mail className="w-4 h-4" />{agenteInfo.correo}</p>
              <a
                href={`https://wa.me/${agenteInfo.telefono.replace(/[^\d]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm w-full"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          )}
        </div>
      )}

      {/* Mapa */}
      <div className="rounded-lg overflow-hidden h-[500px] shadow-md">
        <MapaDetalle center={ubicacion.center} />
      </div>
    </div>
  );
}
