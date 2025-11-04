/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@invoice-suite/config",
    "@invoice-suite/db",
    "@invoice-suite/ui",
    "@invoice-suite/utils",
    "@invoice-suite/pdf",
  ],
};

export default nextConfig;
