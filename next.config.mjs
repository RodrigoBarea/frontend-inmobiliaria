/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
      },
      {
        protocol: "https",
        hostname: "backend-inmobiliaria-el-porvenir.onrender.com",
      },
      {
        protocol: "https", // Agregar soporte para imágenes de Cloudinary
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
