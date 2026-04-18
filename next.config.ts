import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // התעלמות משגיאות TypeScript בזמן Build
  typescript: {
    ignoreBuildErrors: true,
  },
  // התעלמות משגיאות ESLint בזמן Build
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* כאן אפשר להוסיף הגדרות נוספות אם היו לך קודם */
};

export default nextConfig;