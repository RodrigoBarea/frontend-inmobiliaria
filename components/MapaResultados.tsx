'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Inmueble } from '@/types/inmueble';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface Props {
  inmuebles: Inmueble[];
  ciudadSeleccionada: string | null;
  darkMode?: boolean;
}

const CITY_COORDINATES: Record<string, { center: [number, number], zoom: number }> = {
  'La Paz': { center: [-68.1193, -16.4897], zoom: 12 },
  'Santa Cruz': { center: [-63.1812, -17.7833], zoom: 12 },
  'Cochabamba': { center: [-66.1561, -17.3895], zoom: 12 },
};

export default function MapaResultados({ inmuebles, ciudadSeleccionada, darkMode = false }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const popups = useRef<mapboxgl.Popup[]>([]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: darkMode 
        ? 'mapbox://styles/mapbox/dark-v11' 
        : 'mapbox://styles/mapbox/light-v11',
      center: [-64.99, -17.39],
      zoom: 5,
    });

    map.current.on('load', () => {
      setLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [darkMode]);

  useEffect(() => {
    if (!map.current || !loaded) return;

    const renderMarkers = () => {
      setLoading(true);
      markers.current.forEach(m => m.remove());
      popups.current.forEach(p => p.remove());
      markers.current = [];
      popups.current = [];

      if (inmuebles.length === 0) {
        setLoading(false);
        return;
      }

      if (ciudadSeleccionada && CITY_COORDINATES[ciudadSeleccionada]) {
        const { center, zoom } = CITY_COORDINATES[ciudadSeleccionada];
        map.current?.flyTo({ center, zoom, duration: 1000 });
      } else {
        const bounds = new mapboxgl.LngLatBounds();
        inmuebles.forEach(i => bounds.extend(i.attributes.ubicacion.center));
        map.current?.fitBounds(bounds, { padding: 50 });
      }

      inmuebles.forEach(inmueble => {
        const { ubicacion, precio, inmuebleName, Direccion, ciudad, slug, imagenes } = inmueble.attributes;
        const [lng, lat] = ubicacion.center;

        const el = document.createElement('div');
        el.className = 'marker';
        el.textContent = precio >= 1000 ? `$${(precio / 1000).toFixed(0)}K` : `$${precio} USD`;

        Object.assign(el.style, {
          padding: '4px 8px',
          background: 'white',
          color: 'black',
          borderRadius: '9999px',
          fontSize: '12px',
          fontWeight: 'bold',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        });

        const imgUrl = imagenes?.data?.[0]?.attributes.formats?.large?.url || 
                       imagenes?.data?.[0]?.attributes.url || '';
        const fullImgUrl = imgUrl.startsWith('https://') || imgUrl.startsWith('http://')
          ? imgUrl
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}${imgUrl}`;

        const popup = new mapboxgl.Popup({ offset: 25, closeButton: false, closeOnClick: false }).setHTML(`
          <div class="popup-container">
            ${fullImgUrl ? `<img src="${fullImgUrl}" alt="${inmuebleName}" class="popup-image" />` : ''}
            <div class="popup-body">
              <h3 class="popup-title">${inmuebleName}</h3>
              <p class="popup-address">${Direccion}, ${ciudad}</p>
              <div class="popup-features">
                ${inmueble.attributes.dormitorios ? `<span>🛏 ${inmueble.attributes.dormitorios}</span>` : ''}
                ${inmueble.attributes.banos ? `<span>🛁 ${inmueble.attributes.banos}</span>` : ''}
                ${inmueble.attributes.terreno ? `<span>📐 ${inmueble.attributes.terreno}m²</span>` : ''}
                ${inmueble.attributes.estacionamientos ? `<span>🚗 ${inmueble.attributes.estacionamientos}</span>` : ''}
              </div>
              <p class="popup-price">$${precio.toLocaleString()} USD</p>
            </div>
          </div>
        `);

        const marker = new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map.current!);
        markers.current.push(marker);
        popups.current.push(popup);

        el.addEventListener('mouseenter', () => popup.setLngLat([lng, lat]).addTo(map.current!));
        el.addEventListener('mouseleave', () => popup.remove());
        el.addEventListener('click', () => {
          window.location.href = `/inmueble/${slug}`;
        });
      });

      setLoading(false);
    };

    renderMarkers();
  }, [inmuebles, loaded, ciudadSeleccionada]);

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
        </div>
      )}
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
