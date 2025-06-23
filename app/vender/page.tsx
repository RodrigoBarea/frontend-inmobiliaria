// app/vender/page.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircleMore, Building2, FileCheck, Zap } from 'lucide-react';

const VenderPage = () => {
  return (
    <section>
      {/* Banner principal */}
      <div className="relative h-[60vh] w-full bg-gradient-to-br from-[#001E6C] via-[#0038a2] to-[#0057b7] flex items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-white text-4xl sm:text-5xl font-extrabold leading-tight drop-shadow-lg">
            ¿Quieres vender tu propiedad en Tarija?
          </h1>
          <p className="mt-4 text-white text-lg max-w-2xl mx-auto drop-shadow-md">
            Te ayudamos a mostrar tu inmueble al público adecuado y venderlo al mejor precio.
          </p>
        </motion.div>
      </div>

      {/* Sección informativa */}
      <div className="bg-white rounded-t-[2rem] shadow-xl -mt-12 z-10 relative">
        <div className="max-w-6xl mx-auto px-6 py-16 space-y-20">

          {/* Paso 1 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#001E6C] mb-4">
              1. Ponte en contacto con un agente
            </h2>
            <p className="text-gray-700 max-w-xl mx-auto text-lg mb-6">
              Nuestro equipo está listo para ayudarte. Te guiaremos paso a paso para publicar tu inmueble.
            </p>
            <Link
              href="https://wa.me/591XXXXXXXX" // reemplaza por tu número
              target="_blank"
              className="inline-flex items-center bg-[#25D366] hover:bg-[#1DA955] text-white font-semibold py-3 px-6 rounded-full text-lg shadow-md transition"
            >
              <MessageCircleMore className="w-5 h-5 mr-2" />
              Contactar por WhatsApp
            </Link>
          </motion.div>

          {/* Beneficios */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            <div className="space-y-4">
              <Building2 className="mx-auto w-10 h-10 text-[#001E6C]" />
              <h3 className="font-bold text-lg">Mayor visibilidad</h3>
              <p className="text-gray-600 text-sm">
                Publicamos tu propiedad en nuestra web y redes para llegar a miles de interesados.
              </p>
            </div>
            <div className="space-y-4">
              <FileCheck className="mx-auto w-10 h-10 text-[#001E6C]" />
              <h3 className="font-bold text-lg">Proceso claro</h3>
              <p className="text-gray-600 text-sm">
                Te asesoramos con los trámites legales y documentos necesarios para vender.
              </p>
            </div>
            <div className="space-y-4">
              <Zap className="mx-auto w-10 h-10 text-[#001E6C]" />
              <h3 className="font-bold text-lg">Atención rápida</h3>
              <p className="text-gray-600 text-sm">
                Respondemos tus dudas y solicitudes en menos de 24 horas.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VenderPage;
