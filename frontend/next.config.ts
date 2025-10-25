import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: path.resolve(__dirname), // absolute path to your frontend folder
  },
};

export default nextConfig;
