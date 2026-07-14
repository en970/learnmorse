import type { NextConfig } from "next";

// Deployed as a static site to GitHub Pages under /learnmorse.
// Locally (next dev / a plain next build) the base path stays empty so
// the app is reachable at the root, which is what you want while working on it.
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
