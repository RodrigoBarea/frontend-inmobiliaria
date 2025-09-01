"use client";

import Image from "next/image";
import { SiWhatsapp } from "react-icons/si";

const Asesoramiento = () => {
  // Mensaje con emojis (codificado para URL)
  const rawMsg = "Hola, necesito asesoramiento inmobiliario.";
  const waUrl = `https://wa.me/59177873534?text=${encodeURIComponent(rawMsg)}`;

  return (
    <section className="w-full bg-white">
      <div className="flex flex-col lg:flex-row items-stretch w-full h-full">

        {/* Imagen ocupando toda la mitad izquierda en desktop con degradado */}
        <div className="relative w-full lg:w-1/2 h-[400px] lg:h-auto">
          <Image
            src="/asesoramiento.jpg"
            alt="Asesoramiento inmobiliario"
            className="w-full h-full object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
            width={800}
            height={500}
          />
          {/* Gradiente blanco sutil sobre el borde derecho */}
          <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-white to-transparent" />
        </div>

        {/* Texto + botón */}
        <div className="w-full lg:w-1/2 px-6 py-10 lg:py-0 flex flex-col justify-center text-center lg:text-left space-y-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
            Asesoramiento personalizado
          </h3>
          <h2 className="text-3xl sm:text-4xl font-black text-[#001E6C] leading-tight">
            ¿No sabes por dónde empezar?
            <br />
            Te brindamos asesoramiento a un click de distancia.
          </h2>
          <p className="text-gray-600 text-base">
            Nuestro equipo está listo para ayudarte a encontrar tu propiedad ideal, resolver tus dudas y acompañarte en cada paso del proceso.
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#001E6C] hover:bg-[#001244] text-white font-semibold px-4 py-2 rounded-full shadow-md transition-all text-sm max-w-max mx-auto lg:mx-0"
          >
            <SiWhatsapp className="h-5 w-5" />
            Contáctanos por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default Asesoramiento;
