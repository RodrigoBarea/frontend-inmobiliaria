"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";

const MenuList = () => {
  const navItems = [
    { href: "/compra/page/1", label: "Compra" },
    { href: "/alquiler/page/1", label: "Alquila" },
    { href: "/anticretico/page/1", label: "En Anticrético" },
    { href: "/vender", label: "Vende" },
    { href: "/alquileres", label: "Gestión de Alquileres" },
    { href: "/sobre-nosotros", label: "Nosotros" },
    { href: "/blog/page/1", label: "Blog" },
  ];

  // Mensaje con emojis (se codifica para URL)
  const rawMsg = "Hola, necesito asesoramiento inmobiliario.";
  const waUrl = `https://wa.me/59177873534?text=${encodeURIComponent(rawMsg)}`;

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex items-center gap-10">
        {navItems.map(({ href, label }) => (
          <NavigationMenuItem key={label}>
            <Link href={href} passHref legacyBehavior>
              <motion.a
                whileHover="hover"
                initial="rest"
                animate="rest"
                className="relative text-sm font-semibold tracking-wide text-[#1c39bb] px-1 py-1"
              >
                {label}
                <motion.span
                  variants={{ rest: { width: 0 }, hover: { width: "100%" } }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-0 bottom-0 h-[2px] bg-[#1c39bb]"
                />
              </motion.a>
            </Link>
          </NavigationMenuItem>
        ))}

        {/* CTA WhatsApp con mensaje codificado */}
        <NavigationMenuItem>
          <motion.a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover="hover"
            initial="rest"
            animate="rest"
            className="flex items-center gap-2 cursor-pointer relative"
          >
            <FaWhatsapp style={{ color: "#1c39bb", fontSize: "1.2rem" }} />
            <div className="relative">
              <span className="text-sm font-semibold text-[#1c39bb] tracking-wide">
                +591 77873534
              </span>
              <motion.span
                variants={{ rest: { width: 0 }, hover: { width: "100%" } }}
                transition={{ duration: 0.3 }}
                className="absolute left-0 bottom-0 h-[2px] bg-[#1c39bb]"
              />
            </div>
          </motion.a>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MenuList;
