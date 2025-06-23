'use client';
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Supercluster from 'supercluster';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface Props {
  inmuebles: {
    id: number;
    attributes: {
      precio: number;
      inmuebleName: string;
      Direccion: string;
      slug: string;
      imagenes?: { data: { attributes: { url: string; formats?: { large?: { url: string } } } }[] };
      dormitorios?: number;
      banos?: number;
      terreno?: number;
      estacionamientos?: number;
      ubicacion: {
        center: [number, number];
      };
    };
  }[];
  darkMode?: boolean;
}

export default function MapaResultados({ inmuebles, darkMode = false }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapRef.current,
        style: darkMode ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11',
        center: [-64.99, -17.39],
        zoom: 5,
      });

      map.current.on('load', () => {
        setLoaded(true);
      });
    } else {
      renderMarkers();
    }

    function renderMarkers() {
      if (!map.current || !inmuebles.length) return;

      const geoJSON = inmuebles.map(({ id, attributes }) => ({
        type: 'Feature',
        properties: {
          cluster: false,
          id,
          slug: attributes.slug,
          precio: attributes.precio,
          name: attributes.inmuebleName,
          direccion: attributes.Direccion,
          img: `${process.env.NEXT_PUBLIC_BACKEND_URL}${attributes.imagenes?.data[0]?.attributes.formats?.large?.url || attributes.imagenes?.data[0]?.attributes.url || ''}`,
          dormitorios: attributes.dormitorios,
          banos: attributes.banos,
          terreno: attributes.terreno,
          estacionamientos: attributes.estacionamientos,
        },
        geometry: {
          type: 'Point',
          coordinates: attributes.ubicacion.center,
        },
      }));

      const bounds = new mapboxgl.LngLatBounds();
      geoJSON.forEach((f: any) => bounds.extend(f.geometry.coordinates));
      map.current?.fitBounds(bounds, { padding: 50, maxZoom: 14 });

      geoJSON.forEach((f: any) => {
        const [lng, lat] = f.geometry.coordinates;
        const {
          precio,
          name,
          direccion,
          slug,
          img,
          dormitorios,
          banos,
          terreno,
          estacionamientos,
        } = f.properties;

        const el = document.createElement('div');
        el.className = 'marker';
        el.innerText = `$${(precio / 1000).toFixed(0)}K`;

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

        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
          closeOnClick: false,
        }).setHTML(`
  <div class="fade-popup card-container">
    <img src="${img}" alt="${name}" class="card-image" />
    <div class="card-body">
      <h3 class="card-title">${name}</h3>
      <p class="card-dir">${direccion}</p>
      <div class="card-info">
        ${dormitorios ? `<span>🛏 ${dormitorios}</span>` : ''}
        ${banos ? `<span>🛁 ${banos}</span>` : ''}
        ${terreno ? `<span>📐 ${terreno}m²</span>` : ''}
        ${estacionamientos ? `<span>🚗 ${estacionamientos}</span>` : ''}
      </div>
      <p class="card-price">$${precio.toLocaleString()}</p>
    </div>
  </div>
`)
;

        const marker = new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map.current!);

        el.addEventListener('mouseenter', () => {
          popup.setLngLat([lng, lat]).addTo(map.current!);
        });
        el.addEventListener('mouseleave', () => {
          popup.remove();
        });

        el.addEventListener('click', () => {
          window.location.href = `/inmueble/${slug}`;
        });
      });

      setTimeout(() => {
        setLoading(false);
        map.current?.resize();
      }, 400);
    }

    if (loaded) renderMarkers();
  }, [inmuebles, loaded, darkMode]);

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
        </div>
      )}
      <div ref={mapRef} className="absolute inset-0 w-full h-full" />
      <style jsx>{`
        .card-container {
          display: flex;
          flex-direction: column;
          border-radius: 12px;
          overflow: hidden;
          background: white;
          font-family: sans-serif;
          width: 240px;
        }
        .card-image {
          width: 100%;
          height: 130px;
          object-fit: cover;
        }
        .card-body {
          padding: 10px;
        }
        .card-title {
          font-weight: bold;
          font-size: 14px;
          color: #111827;
          margin: 0;
        }
        .card-dir {
          font-size: 12px;
          color: #6b7280;
          margin: 4px 0;
        }
        .card-info {
          display: flex;
          gap: 8px;
          font-size: 11px;
          margin: 4px 0;
          flex-wrap: wrap;
        }
        .card-price {
          font-weight: bold;
          font-size: 14px;
          color: #16a34a;
          margin-top: 6px;
        }
      `}</style>
    </div>
  );
}
