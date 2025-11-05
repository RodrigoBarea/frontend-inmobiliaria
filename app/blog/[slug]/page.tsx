'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';
import { toAbsoluteUrl } from '@/helpers/media';

interface Blog {
  id: number;
  attributes: {
    titulo: string;
    slug: string;
    portada: { data?: { attributes?: { url?: string; formats?: any } } };
    contenido: any[];
    createdAt: string;
    agente?: {
      data?: {
        attributes: {
          nombre: string;
          cargo?: string;
          fotoPrincipal?: { data?: { attributes?: { url?: string } } };
        };
      };
    };
  };
}

const PaginaDetalleBlog = () => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [otrosBlogs, setOtrosBlogs] = useState<Blog[]>([]);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { slug } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/api/blogs?populate=portada,agente.fotoPrincipal&filters[slug][$eq]=${slug}`
        );
        const json = await res.json();
        setBlog(json.data?.[0] || null);
      } catch (error) {
        console.error('Error al cargar blog:', error);
      }
    };
    fetchData();
  }, [baseUrl, slug]);

  useEffect(() => {
    const fetchOtros = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/api/blogs?populate=portada&filters[slug][$ne]=${slug}&filters[active][$eq]=true&pagination[limit]=3`
        );
        const json = await res.json();
        setOtrosBlogs(json.data || []);
      } catch (error) {
        console.error('Error al cargar más blogs:', error);
      }
    };
    fetchOtros();
  }, [baseUrl, slug]);

  if (!blog) return <div className="p-10 text-center">Cargando...</div>;

  const { titulo, portada, contenido, createdAt, agente } = blog.attributes;

  // Portada (prefiere formato grande si existe)
  const portadaUrl = toAbsoluteUrl(
    portada?.data?.attributes?.formats?.large?.url || portada?.data?.attributes?.url
  );

  const formattedDate = new Date(createdAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Foto del agente
  const fotoAgente = toAbsoluteUrl(
    agente?.data?.attributes?.fotoPrincipal?.data?.attributes?.url
  );

  return (
    <>
      <section
        className="relative h-[70vh] md:h-[80vh] w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${portadaUrl})` }}
      >
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center px-4 text-white text-center">
          <h1 className="text-3xl md:text-6xl font-extrabold max-w-5xl leading-tight drop-shadow-lg">
            {titulo}
          </h1>
        </div>
      </section>

      <section className="relative z-10 -mt-10 bg-white rounded-t-3xl shadow-xl pt-12 pb-16 px-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CalendarDays className="w-4 h-4" />
          <span>{formattedDate}</span>
        </div>

        {contenido.map((block, i) => {
          if (block.type === 'heading') {
            return (
              <h2 key={i} className="text-2xl font-bold text-[#001E6C] mt-6">
                {block.children.map((c: any) => c.text).join(' ')}
              </h2>
            );
          }
          if (block.type === 'paragraph') {
            return (
              <p key={i} className="text-gray-700 text-lg leading-relaxed">
                {block.children.map((c: any) => c.text).join(' ')}
              </p>
            );
          }
          return null;
        })}

        {agente?.data && (
          <div className="mt-12 border-t pt-6 flex items-center gap-4">
            {agente.data.attributes.fotoPrincipal?.data?.attributes?.url && (
              <Image
                src={fotoAgente}
                alt={agente.data.attributes.nombre}
                width={60}
                height={60}
                className="rounded-full object-cover"
              />
            )}
            <div>
              <p className="font-bold text-[#001E6C]">{agente.data.attributes.nombre}</p>
              <p className="text-sm text-gray-500">{agente.data.attributes.cargo}</p>
            </div>
          </div>
        )}

        {otrosBlogs.length > 0 && (
          <aside className="mt-16 border-t pt-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#001E6C]">Más del blog</h3>
              <Link
                href="/blog/page/1"
                className="text-sm text-[#001E6C] font-semibold hover:underline"
              >
                Ver todos
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {otrosBlogs.map((b) => {
                const rawUrl =
                  b.attributes.portada?.data?.attributes?.formats?.large?.url ||
                  b.attributes.portada?.data?.attributes?.url;
                const url = toAbsoluteUrl(rawUrl);
                const fecha = new Date(b.attributes.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                });

                return (
                  <Link
                    href={`/blog/${b.attributes.slug}`}
                    key={b.id}
                    className="group border rounded-xl overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="relative h-[160px] w-full">
                      <Image src={url} alt={b.attributes.titulo} fill className="object-cover" />
                    </div>
                    <div className="p-4 space-y-1">
                      <p className="text-xs text-gray-400">{fecha}</p>
                      <h4 className="font-semibold text-[#001E6C] group-hover:underline">
                        {b.attributes.titulo}
                      </h4>
                    </div>
                  </Link>
                );
              })}
            </div>
          </aside>
        )}
      </section>
    </>
  );
};

export default PaginaDetalleBlog;
