'use client';

import { motion } from 'framer-motion';
import { Target, Eye, Star, CheckCircle } from 'lucide-react';

export default function NosotrosPage() {
  const cards = [
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Nuestra Misión',
      body: (
        <>Ofrecer soluciones inmobiliarias integrales que superen las expectativas de nuestros clientes, con un enfoque humano, profesional y transparente.</>
      ),
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'Nuestra Visión',
      body: (
        <>Ser la inmobiliaria líder en Tarija, reconocida por su innovación, integridad y por transformar la forma de vivir e invertir en bienes raíces.</>
      ),
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Nuestros Valores',
      body: (
        <ul className="space-y-2 text-base text-gray-700">
          {['Compromiso', 'Transparencia', 'Innovación', 'Confianza', 'Atención personalizada'].map((v, i) => (
            <li key={i} className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#1c39bb]" /> {v}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <section className="relative pt-32 pb-24 overflow-visible bg-gray-50">
      {/* ✦ Fondos abstractos animados */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#1c39bb] rounded-full opacity-10 animate-spin-slow pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#001E6C] rounded-full opacity-8 animate-pulse-slow pointer-events-none" />

      {/* ✦ Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto max-w-3xl text-center space-y-6 px-6"
      >
        <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#001E6C] to-[#1c39bb] drop-shadow-md">
          Sobre Nosotros
        </h1>

        <p className="text-xl text-gray-700 font-sans leading-relaxed max-w-3xl mx-auto">
          En <span className="font-semibold text-[#001E6C]">El Porvenir</span>, no solo vendemos propiedades: construimos confianza. Nos impulsa la excelencia, el compromiso y la personalización en cada experiencia inmobiliaria.
        </p>
      </motion.div>

      {/* ✦ Wave SVG */}
      <div className="absolute inset-x-0 bottom-0 h-40 z-0 pointer-events-none">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,0 C600,100 600,0 1200,100 L1200,120 L0,120 Z" fill="#ffffff" />
        </svg>
      </div>

      {/* ✦ Cards */}
      <div className="relative z-10 mt-20 grid gap-10 px-6 md:grid-cols-3 max-w-6xl mx-auto">
        {cards.map((c, i) => (
          <motion.div
            key={i}
            initial="rest"
            whileHover="hover"
            animate="rest"
            variants={{
              rest: { scale: 1 },
              hover: { scale: 1.03, transition: { duration: 0.3 } },
            }}
            className="relative group bg-white rounded-3xl p-8 overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.1),0_10px_20px_rgba(0,0,0,0.05)]"
          >
            {/* borde degradado on hover */}
            <div className="absolute inset-0 rounded-3xl bg-clip-padding group-hover:bg-gradient-to-tr group-hover:from-[#1c39bb]/20 group-hover:to-[#001E6C]/20 pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <motion.h3
                className="flex items-center gap-3 text-xl font-bold text-[#001E6C]"
                variants={{
                  rest: { color: '#001E6C' },
                  hover: { color: '#1C39BB', transition: { duration: 0.2 } },
                }}
              >
                {c.icon} {c.title}
              </motion.h3>
              <motion.div
                className="text-gray-700 text-base leading-relaxed"
                variants={{
                  rest: { opacity: 0.9 },
                  hover: { opacity: 1 },
                }}
              >
                {c.body}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}



