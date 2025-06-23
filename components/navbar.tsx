"use client";

import Image from "next/image";
import Link from "next/link";
import MenuList from "./menu-list";
import MobileMenu from "./items-menu-mobile";

const Navbar = () => {
  return (
    <header className="w-full bg-white border-b sticky top-0 z-50">
      <div className="flex items-center h-[84px] max-w-[1440px] mx-auto px-4">
        
        {/* Logo a la izquierda */}
        <Link href="/" className="shrink-0">
          <Image
            src="/Logoweb.png"
            alt="El Porvenir Bienes Raíces"
            width={170}
            height={42}
            priority
          />
        </Link>

        {/* Menú + Teléfono a la derecha */}
        <nav className="hidden sm:flex items-center ml-auto">
          <MenuList />
        </nav>

        {/* Mobile fallback */}
        <div className="flex sm:hidden ml-auto">
          <MobileMenu/>
        </div>
      </div>
    </header>
  );
};

export default Navbar;