import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import 'mapbox-gl/dist/mapbox-gl.css';
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer"; // Asegúrate que esta ruta sea correcta


const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Inmobiliaria El Porvenir",
  description: "Bienvenidos a la inmobiliaria El Porvenir",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${poppins.className} min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        
        <Footer />
      </body>
    </html>
  );
}

