"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Phone } from "lucide-react";
import { FaWhatsapp } from 'react-icons/fa';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { useRouter } from "next/navigation";

const MenuList = () => {
  const router = useRouter();

  const navItems = [
    { href: "/compra/page/1", label: "Compra" },
    { href: "/alquiler/page/1", label: "Alquila" },
    { href: "/anticretico/page/1", label: "En Anticrético" },
    { href: "/vender", label: "Vende" },
      { href: "/alquileres", label: "Gestión de Alquileres" },
    { href: "/sobre-nosotros", label: "Nosotros" },
    { href: "/blog/page/1", label: "Blog" },
  ];

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
                  variants={{
                    rest: { width: 0 },
                    hover: { width: "100%" },
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-0 bottom-0 h-[2px] bg-[#1c39bb]"
                />
              </motion.a>
            </Link>
          </NavigationMenuItem>
        ))}

        {/* Teléfono como último ítem */}
        <NavigationMenuItem>
          <motion.div
            whileHover="hover"
            initial="rest"
            animate="rest"
            onClick={() => router.push("/contacto")}
            className="flex items-center gap-2 cursor-pointer relative"
          >
            < FaWhatsapp strokeWidth="2" style={{ color: "#1c39bb" }} />
            <div className="relative">
              <span className="text-sm font-semibold text-[#1c39bb] tracking-wide">
                +591 711 22 333
              </span>
              <motion.span
                variants={{
                  rest: { width: 0 },
                  hover: { width: "100%" },
                }}
                transition={{ duration: 0.3 }}
                className="absolute left-0 bottom-0 h-[2px] bg-[#1c39bb]"
              />
            </div>
          </motion.div>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MenuList;