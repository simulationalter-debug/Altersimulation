import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static export — the whole app is client-side state
  // (zustand + localStorage, no API routes/server actions), so this
  // needs no server at runtime. Required for the Capacitor mobile
  // wrapper (native WebViews load a local bundle, not a live server).
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
