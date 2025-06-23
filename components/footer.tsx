import { Facebook, Instagram } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-b from-white via-gray-100 to-gray-200 border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center space-y-8 text-center">

        {/* Línea divisoria decorativa */}
        <div className="w-16 h-1 rounded-full bg-gray-400" />

        {/* Íconos de redes con estilo */}
        <div className="flex space-x-6">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <Facebook className="h-6 w-6 text-gray-500 hover:text-[#1877F2] transition-transform transform hover:scale-110" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <Instagram className="h-6 w-6 text-gray-500 hover:text-[#E4405F] transition-transform transform hover:scale-110" />
          </a>
          <a href="https://wa.me/5490000000000" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <SiWhatsapp className="h-6 w-6 text-gray-500 hover:text-[#25D366] transition-transform transform hover:scale-110" />
          </a>
        </div>

        {/* Mensaje adicional o branding */}
        <p className="text-sm text-gray-500 italic">
          Conectando personas con espacios que inspiran.
        </p>

        {/* Derechos reservados */}
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} TuEmpresa. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;