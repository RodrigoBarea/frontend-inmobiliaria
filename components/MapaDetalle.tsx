'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface Props {
  center: [number, number];
}

export default function MapaDetalle({ center }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center,
      zoom: 14,
    });

    // Creamos un marcador personalizado
    const markerElement = document.createElement('div');
    markerElement.style.backgroundImage = 'url("/icons/marker.svg")'; // asegúrate que exista este archivo
    markerElement.style.width = '40px';
    markerElement.style.height = '40px';
    markerElement.style.backgroundSize = 'contain';
    markerElement.style.backgroundRepeat = 'no-repeat';
    markerElement.style.backgroundPosition = 'center';
    markerElement.style.cursor = 'pointer';

    new mapboxgl.Marker({ element: markerElement })
      .setLngLat(center)
      .addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
    };
  }, [center]);

  return <div ref={mapRef} className="w-full h-[400px] rounded-xl overflow-hidden shadow" />;
}
