'use client';

import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { BedDouble, Bath, Ruler, CarFront, Phone, Mail, Briefcase, MessageCircle } from 'lucide-react';

const MapaDetalle = dynamic(() => import('@/components/MapaDetalle'), { ssr: false });

// Helper: convierte "en alquiler" -> "En Alquiler"
const toTitleCase = (str?: string | null) =>
  (str ?? '')
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

export default function InmueblePage({ params }: { params: { slug: string } }) {
  const [inmueble, setInmueble] = useState<any>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inmuebles?filters[slug][$eq]=${params.slug}&populate=imagenes,categoria,ubicacion,agente.fotoPrincipal`
    )
      .then((res) => res.json())
      .then((json) => {
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
    agente,
    frente,
  } = inmueble.attributes;

  // Corregir la URL de las imágenes de Cloudinary
  const imageList: string[] = imagenes.data.map(
    (img: any) => {
      const imagenUrl =
        img.attributes.formats?.large?.url ||
        img.attributes.url ||
        '';

      return imagenUrl.startsWith('https://res.cloudinary.com')
        ? imagenUrl
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}${imagenUrl}`;
    }
  );

  // Ahora generamos las imágenes para Lightbox
  const lightboxSlides = imageList.map((url) => ({ src: url }));
  const agenteInfo = agente?.data?.attributes;
  const fotoAgente = agenteInfo?.fotoPrincipal?.data?.attributes?.url;

  // Ficha técnica (aplicamos Title Case a la categoría)
  const fichaTecnica: Array<{ label: string; value?: string | number | null }> = [
    { label: 'Tipo', value: tipo },
    { label: 'Categoría', value: toTitleCase(categoria?.data?.attributes?.nombreCategoria) },
    { label: 'Construcción', value: construccion ? `${construccion} m²` : null },
    { label: 'Terreno', value: terreno ? `${terreno} m²` : null },
    { label: 'Frente', value: frente ? `${frente} m` : null },
  ].filter((item) => item.value);

  // Galería: 2 miniaturas + “Ver todas”
  const hasThumbs = imageList.length > 1;
  const thumbs = imageList.slice(1, 3);
  const showSeeAll = imageList.length > 3;
  const renderedRows = thumbs.length + (showSeeAll ? 1 : 0);

  // WhatsApp CTA (mensaje con título del inmueble + URL actual)
  const cleanPhone = String(agenteInfo?.telefono || '').replace(/[^\d]/g, '');
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const rawMsg = `Hola, necesito más información sobre este inmueble:\n${inmuebleName}\n${currentUrl}`;
  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(rawMsg)}`
    : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Galería */}
      <div className={`grid grid-cols-1 ${hasThumbs ? 'md:grid-cols-3' : 'md:grid-cols-1'} gap-4`}>
        <div
          className="md:col-span-2 relative h-[500px] rounded-lg overflow-hidden cursor-pointer"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={imageList[0]} // Usamos la URL de Cloudinary directamente
            alt={inmuebleName}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        {hasThumbs && (
          <div
            className="rounded-lg overflow-hidden h-[500px] grid gap-2"
            style={{ gridTemplateRows: `repeat(${renderedRows || 1}, 1fr)` }}
          >
            {thumbs.map((url: string, i: number) => (
              <div
                key={i}
                className="relative rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setLightboxOpen(true)}
              >
                <Image
                  src={url} // Usamos la URL de Cloudinary directamente
                  alt={`img-${i}`}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}

            {showSeeAll && (
              <div
                className="relative rounded-lg overflow-hidden bg-black cursor-pointer group"
                onClick={() => setLightboxOpen(true)}
              >
                <Image
                  src={imageList[3]}
                  alt="Ver todas"
                  fill
                  className="object-cover opacity-60 group-hover:opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center text-white font-semibold">
                  Ver todas
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Lightbox open={lightboxOpen} close={() => setLightboxOpen(false)} slides={lightboxSlides} />

      {/* Título y precio */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{inmuebleName}</h1>
        <p className="text-lg text-gray-600">{Direccion}</p>
        <div className="text-4xl font-extrabold text-blue-800 mt-2">
          ${Number(precio).toLocaleString()}
        </div>
      </div>

      {/* Características principales */}
      <div className="flex flex-wrap gap-6 text-base text-gray-700 border-b pb-4">
        {dormitorios > 0 && (
          <div className="flex items-center gap-2">
            <BedDouble className="w-5 h-5" />
            {dormitorios} Dorm
          </div>
        )}
        {banos > 0 && (
          <div className="flex items-center gap-2">
            <Bath className="w-5 h-5" />
            {banos} Baños
          </div>
        )}
        {terreno > 0 && (
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5" />
            {terreno} m²
          </div>
        )}
        {estacionamientos > 0 && (
          <div className="flex items-center gap-2">
            <CarFront className="w-5 h-5" />
            {estacionamientos} Parqueos
          </div>
        )}
      </div>

      {/* Ficha técnica (adaptativa) */}
      {fichaTecnica.length > 0 && (
        <div className="grid [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))] gap-4 bg-gray-100 p-4 rounded-lg text-base">
          {fichaTecnica.map((item, idx) => (
            <div key={idx} className="text-center">
              <span className="block text-gray-500">{item.label}</span>
              {item.value}
            </div>
          ))}
        </div>
      )}

      {/* Descripción + Agente */}
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
              <p className="text-gray-600 text-sm mb-1 flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                {agenteInfo.cargo}
              </p>
              <p className="text-gray-600 text-sm mb-1 flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {agenteInfo.telefono}
              </p>
              <p className="text-gray-600 text-sm mb-4 flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {agenteInfo.correo}
              </p>

              {/* WhatsApp con mensaje que incluye el título y la URL */}
              {(() => {
                const cleanPhone = String(agenteInfo?.telefono || '').replace(/[^\d]/g, '');
                if (!cleanPhone) return null;
                const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
                const rawMsg = `Hola, necesito más información sobre este inmueble:\n${inmuebleName}\n${currentUrl}`;
                const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(rawMsg)}`;
                return (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm w-full"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                );
              })()}
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
