/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // better-sqlite3 est un module natif : on l'exclut du bundle serveur.
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
