'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Lightbulb, ClipboardCheck, Rocket, Handshake } from 'lucide-react';

const steps = [
  {
    icon: <Lightbulb className="w-8 h-8 text-[#1c39bb]" />,
    title: 'Prepara tu propiedad',
    description: 'Asesórate sobre cómo presentar tu inmueble de forma atractiva para el mercado.',
  },
  {
    icon: <ClipboardCheck className="w-8 h-8 text-[#1c39bb]" />,
    title: 'Establece un precio correcto',
    description: 'Te ayudamos a fijar un precio competitivo y realista basado en el mercado.',
  },
  {
    icon: <Rocket className="w-8 h-8 text-[#1c39bb]" />,
    title: 'Promoción efectiva',
    description: 'Publicamos tu propiedad en los canales adecuados para maximizar su exposición.',
  },
  {
    icon: <Handshake className="w-8 h-8 text-[#1c39bb]" />,
    title: 'Cierra con seguridad',
    description: 'Nos encargamos del proceso legal y de acompañarte hasta la firma final.',
  },
];

const GuiaVendedor = () => {
  // Mensaje con emojis (codificado para URL)
  const rawMsg = 'Hola, necesito asesoramiento inmobiliario.';
  const waUrl = `https://wa.me/59177873534?text=${encodeURIComponent(rawMsg)}`;

  return (
    <>
      {/* HERO con gradiente + curvatura SVG igual a GuiaComprador */}
      <section className="relative bg-gradient-to-br from-[#1c39bb] to-[#001e6c] text-white text-center flex items-center justify-center px-6 h-[70vh] sm:h-[65vh] md:h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-6xl font-extrabold drop-shadow-lg">Guía del Vendedor</h1>
          <p className="mt-4 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
            Todo lo que necesitas saber para vender tu propiedad con éxito, respaldo y el mejor asesoramiento.
          </p>
        </motion.div>

        {/* Curvatura inferior SVG como en GuiaComprador */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none rotate-180">
          <svg viewBox="0 0 500 80" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0,0 C150,80 350,0 500,80 L500,0 L0,0 Z" fill="#ffffff"></path>
          </svg>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <section className="bg-white px-6 pt-10 pb-16 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#001e6c]">¿Por qué seguir esta guía?</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Vender una propiedad requiere estrategia, preparación y acompañamiento. Esta guía te mostrará cómo hacerlo con seguridad y éxito.
          </p>
        </div>

        {/* TARJETAS DE PASOS */}
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
              src="/vendedor-asesor.jpg"
              alt="Agente asesorando al vendedor"
              width={500}
              height={400}
              className="rounded-xl shadow-lg object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#001e6c] mb-4">
              ¿Listo para vender con éxito?
            </h3>
            <p className="text-gray-700 mb-6">
              Nuestro equipo está listo para ayudarte a planificar la mejor estrategia de venta.
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

export default GuiaVendedor;
