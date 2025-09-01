// app/alquiler/page.tsx
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Search,
  DollarSign,
  Wrench,
  MessageCircleMore,
} from 'lucide-react';

export default function GestionAlquilerPage() {
  const cards = [
    {
      icon: <Search className="w-6 h-6 text-[#001E6C]" />,
      title: 'Inquilino ideal',
      body:
        'Aplicamos un riguroso proceso de selección y verificación para asegurar que tu inmueble quede en las mejores manos.',
    },
    {
      icon: <DollarSign className="w-6 h-6 text-[#001E6C]" />,
      title: 'Cobranza puntual',
      body:
        'Gestionamos y recaudamos tu renta cada mes, manteniéndote siempre al día y sin sorpresas.',
    },
    {
      icon: <Wrench className="w-6 h-6 text-[#001E6C]" />,
      title: 'Mantenimiento',
      body:
        'Coordinamos revisiones periódicas y reparaciones inmediatas para conservar tu propiedad en óptimas condiciones.',
    },
  ];

  // WhatsApp: número + mensaje predeterminado (codificado)
  const rawMsg = 'Hola, necesito ayuda con la gestión de alquileres.';
  const waUrl = `https://wa.me/59177873534?text=${encodeURIComponent(rawMsg)}`;

  return (
    <main className="bg-white text-[#001E6C] overflow-x-hidden">
      {/* HERO (con más padding-bottom) */}
      <section
        className="relative h-[60vh] md:h-[55vh] w-full
                   bg-gradient-to-br from-[#001E6C] via-[#0038a2] to-[#0057b7]
                   flex items-center justify-center text-center px-6 pt-16
                   pb-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            Gestión Integral de Alquileres
          </h1>
          <p className="text-base sm:text-lg text-white/90">
            Nos encargamos de todo el ciclo de tu propiedad: selección de
            inquilino, cobranza puntual y mantenimiento continuo.
          </p>
        </motion.div>
      </section>

      {/* CARDS (menos solapamiento con el banner) */}
      <section className="relative z-10 -mt-12 bg-white rounded-t-[3rem] pt-16 pb-20 shadow-xl">
        <div className="max-w-6xl mx-auto px-6 grid gap-8 md:grid-cols-3">
          {cards.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{
                y: -6,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                transition: { duration: 0.3 },
              }}
              className="bg-white rounded-xl p-8 border-l-4 border-transparent
                         shadow-lg hover:border-[#001E6C] hover:shadow-2xl
                         transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-[#001E6C]/10 transition-colors">
                  {c.icon}
                </div>
                <h3 className="ml-4 text-xl font-semibold text-[#001E6C]">
                  {c.title}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONTACTO */}
      <section className="bg-white rounded-t-[2rem] shadow-xl -mt-12 relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#001E6C] mb-4">
              Ponte en contacto con un asesor
            </h2>
            <p className="text-gray-700 max-w-xl mx-auto text-lg mb-6 leading-relaxed">
              Resuelve tus dudas y obtén acompañamiento personalizado en todo el
              proceso de gestión de tu alquiler: selección, cobranza y
              mantenimiento.
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-[#25D366] hover:bg-[#1DA955]
                         text-white font-semibold py-3 px-6 rounded-full
                         text-lg shadow-md transition"
            >
              <MessageCircleMore className="w-5 h-5 mr-2" />
              Contactar por WhatsApp
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
