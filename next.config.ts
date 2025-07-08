import type { NextConfig } from "next";
import tailwindcss from "@tailwindcss/postcss"

const nextConfig: NextConfig = {
  plugins: [tailwindcss()],
};

export default nextConfig;
