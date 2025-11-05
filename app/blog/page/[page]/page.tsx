'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Asesoramiento from '@/components/asesoramiento';
import { toAbsoluteUrl } from '@/helpers/media';

interface BlogListItem {
  id: number;
  attributes: {
    titulo: string;
    slug: string;
    portada: {
      data?: {
        attributes?: {
          url?: string;
          formats?: { medium?: { url: string }; large?: { url: string } };
        };
      };
    };
    contenido: any[];
    active: boolean;
  };
}

const ITEMS_PER_PAGE = 6;

const PaginaBlogs = () => {
  const [blogs, setBlogs] = useState<BlogListItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const params = useParams();
  const page = parseInt(params?.page as string) || 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/api/blogs?populate=portada&filters[active][$eq]=true&pagination[page]=${page}&pagination[pageSize]=${ITEMS_PER_PAGE}`
        );
        const json = await res.json();
        setBlogs(json.data || []);
        setTotalItems(json.meta?.pagination?.total || 0);
      } catch (error) {
        console.error('Error al cargar blogs:', error);
      }
    };

    fetchData();
  }, [baseUrl, page]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <>
      <section
        className="w-full h[400px] md:h-[500px] relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/banner-blogs.jpg')` }}
      >
        <div className="absolute inset-0 bg-[#001E6C]/60 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">Nuestros blogs</h1>
            <p className="mt-4 text-lg sm:text-xl max-w-2xl mx-auto">
              Explora artículos y consejos sobre bienes raíces.
            </p>
          </div>
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.3 }}
        className="relative z-10 -mt-14 bg-white rounded-t-3xl shadow-xl pt-20 pb-10"
      >
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#001E6C]">Últimos artículos</h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map(({ id, attributes }) => {
              const { titulo, slug, portada, contenido } = attributes;
              const rawPortada =
                portada?.data?.attributes?.formats?.large?.url ||
                portada?.data?.attributes?.url ||
                '';
              const portadaUrl = toAbsoluteUrl(rawPortada);
              const previewText = contenido
                ?.at(0)
                ?.children?.map((c: any) => c.text)
                .join(' ')
                .slice(0, 100);

              return (
                <motion.div
                  key={id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border rounded-xl shadow hover:shadow-xl overflow-hidden transition"
                >
                  <div className="relative h-[200px] w-full">
                    <Image src={portadaUrl} alt={titulo} fill className="object-cover" />
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="text-lg font-semibold text-[#001E6C] line-clamp-2">{titulo}</h3>
                    <p className="text-sm text-gray-700 line-clamp-2">{previewText}...</p>

                    <motion.div
                      whileHover="hover"
                      initial="rest"
                      animate="rest"
                      className="relative w-fit mt-2"
                    >
                      <Link
                        href={`/blog/${slug}`}
                        className="text-sm text-[#1c39bb] font-semibold tracking-wide inline-block"
                      >
                        Leer más →
                      </Link>
                      <motion.span
                        variants={{ rest: { width: 0 }, hover: { width: '100%' } }}
                        transition={{ duration: 0.3 }}
                        className="absolute left-0 -bottom-0.5 h-[2px] bg-[#1c39bb]"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Paginación */}
          <div className="flex justify-center items-center gap-2 pt-10">
            {page <= 1 ? (
              <button
                disabled
                className="px-3 py-2 rounded-full bg-gray-200 text-gray-400 cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            ) : (
              <Link
                href={`/blog/page/${page - 1}`}
                className="px-3 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
            )}

            {Array.from({ length: totalPages }, (_, i) => (
              <Link
                key={i + 1}
                href={`/blog/page/${i + 1}`}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold ${
                  i + 1 === page
                    ? 'bg-[#1c39bb] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {i + 1}
              </Link>
            ))}

            {page >= totalPages ? (
              <button
                disabled
                className="px-3 py-2 rounded-full bg-gray-200 text-gray-400 cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <Link
                href={`/blog/page/${page + 1}`}
                className="px-3 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <ChevronRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default PaginaBlogs;
