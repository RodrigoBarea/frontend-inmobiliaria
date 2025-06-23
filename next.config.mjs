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
        hostname: "backend-inmobiliaria-hcml.onrender.com",
      },
    ],
  },
};

export default nextConfig;