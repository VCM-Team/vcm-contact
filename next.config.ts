import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Ruta puente del QR: el QR impreso apunta siempre a /qr; aquí se cambia el destino
  async redirects() {
    return [
      {
        source: "/qr",
        destination: "/?utm_source=qr&utm_medium=print",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;