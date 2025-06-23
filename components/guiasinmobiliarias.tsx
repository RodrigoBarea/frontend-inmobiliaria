"use client";

import { FaHome, FaRegHandshake } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";

const GuiasInmobiliariasAzul = () => {
  return (
    <section className="relative z-10 -mt-6 w-full">
      {/* Degradado superior redondeado */}
      <div className="absolute top-0 left-0 right-0 h-10 rounded-t-3xl bg-gradient-to-b from-black/70 to-[#1c39bb] z-[-1]" />

      {/* Fondo principal con patrón azul */}
      <div className="bg-[#1c39bb] bg-[url('/textures/pattern.svg')] bg-repeat bg-[length:40px_40px] py-20 rounded-t-3xl shadow-xl">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-10">
          {/* Título + descripción */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Guías prácticas para orientarte en tu camino inmobiliario
            </h2>
            <p className="text-white/80 mt-4 max-w-2xl mx-auto">
              Ya sea que estés listo para vender o buscando tu primera propiedad,
              nuestras guías gratuitas te acompañan en cada paso del proceso.
            </p>
          </motion.div>

          {/* Tarjetas */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Guía para comprar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-md p-6 text-left flex flex-col justify-between hover:shadow-xl transform transition duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <motion.div whileHover={{ scale: 1.2 }} className="text-[#1c39bb]">
                  <FaHome className="text-2xl" />
                </motion.div>
                <h3 className="text-xl font-semibold text-[#1c39bb]">
                  Guía para comprar
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Descubre todo lo que necesitas saber antes de invertir en tu nuevo hogar.
              </p>
              <motion.div
                whileHover="hover"
                initial="rest"
                animate="rest"
                className="relative w-fit"
              >
                <Link
                  href="/guia-comprador"
                  className="text-sm font-semibold tracking-wide text-[#1c39bb] px-1 py-1"
                >
                  Ver guía →
                </Link>
                <motion.span
                  variants={{ rest: { width: 0 }, hover: { width: "100%" } }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-0 bottom-0 h-[2px] bg-[#1c39bb]"
                />
              </motion.div>
            </motion.div>

            {/* Guía para vender */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-md p-6 text-left flex flex-col justify-between hover:shadow-xl transform transition duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <motion.div whileHover={{ scale: 1.2 }} className="text-[#1c39bb]">
                  <FaRegHandshake className="text-2xl" />
                </motion.div>
                <h3 className="text-xl font-semibold text-[#1c39bb]">
                  Guía para vender
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Aprende a vender tu propiedad con estrategias que maximizan su valor.
              </p>
              <motion.div
                whileHover="hover"
                initial="rest"
                animate="rest"
                className="relative w-fit"
              >
                <Link
                  href="/guia-vendedor"
                  className="text-sm font-semibold tracking-wide text-[#1c39bb] px-1 py-1"
                >
                  Ver guía →
                </Link>
                <motion.span
                  variants={{ rest: { width: 0 }, hover: { width: "100%" } }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-0 bottom-0 h-[2px] bg-[#1c39bb]"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuiasInmobiliariasAzul;