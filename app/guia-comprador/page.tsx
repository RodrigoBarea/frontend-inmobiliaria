'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { FileText, Home, Search, Handshake } from 'lucide-react';

const steps = [
  {
    icon: <Search className="w-8 h-8 text-[#1c39bb]" />,
    title: 'Define tus necesidades',
    description: 'Determina tu presupuesto, ubicación deseada y tipo de propiedad que buscas.',
  },
  {
    icon: <Home className="w-8 h-8 text-[#1c39bb]" />,
    title: 'Explora opciones',
    description: 'Revisa nuestro catálogo de inmuebles y filtra según tus preferencias.',
  },
  {
    icon: <Handshake className="w-8 h-8 text-[#1c39bb]" />,
    title: 'Asesoramiento experto',
    description: 'Nuestro equipo te acompaña en todo el proceso legal y financiero.',
  },
  {
    icon: <FileText className="w-8 h-8 text-[#1c39bb]" />,
    title: 'Cierra con confianza',
    description: 'Finaliza tu compra de manera segura y con respaldo profesional.',
  },
];

const GuiaComprador = () => {
  // Mensaje con emojis (codificado para URL)
  const rawMsg = 'Hola, necesito asesoramiento inmobiliario.';
  const waUrl = `https://wa.me/59177873534?text=${encodeURIComponent(rawMsg)}`;

  return (
    <>
      {/* HERO con gradiente + curvatura SVG */}
      <section className="relative bg-gradient-to-br from-[#1c39bb] to-[#001e6c] text-white text-center flex items-center justify-center px-6 h-[70vh] sm:h-[65vh] md:h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-6xl font-extrabold drop-shadow-lg">Guía del Comprador</h1>
          <p className="mt-4 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
            Todo lo que necesitas saber para comprar tu próxima propiedad con claridad y confianza.
          </p>
        </motion.div>

        {/* Curvatura inferior con SVG */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none rotate-180">
          <svg viewBox="0 0 500 80" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0,0 C150,80 350,0 500,80 L500,0 L0,0 Z" fill="#ffffff"></path>
          </svg>
        </div>
      </section>

      {/* SECCIÓN DE PASOS */}
      <section className="bg-white px-6 pt-10 pb-16 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#001e6c]">¿Por qué seguir esta guía?</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Comprar una casa puede ser una de las decisiones más importantes de tu vida. Nuestra guía está diseñada para acompañarte en cada paso del proceso.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-50 rounded-xl p-6 text-center shadow hover:shadow-xl"
            >
              <div className="flex justify-center mb-4">{step.icon}</div>
              <h3 className="text-lg font-semibold text-[#001e6c] mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-[#f0f4ff] py-16">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center px-6 gap-8">
          <div className="flex-1">
            <Image
              src="/comprador-asesor.jpg"
              alt="Agente ayudando a cliente"
              width={500}
              height={400}
              className="rounded-xl shadow-lg object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#001e6c] mb-4">
              ¿Listo para comenzar tu compra?
            </h3>
            <p className="text-gray-700 mb-6">
              Agenda una llamada con uno de nuestros expertos y recibe una asesoría gratuita personalizada.
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#1c39bb] text-white px-6 py-3 rounded-full font-semibold transition hover:scale-105 hover:bg-[#001e6c]"
            >
              Contactar vía WhatsApp →
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default GuiaComprador;
