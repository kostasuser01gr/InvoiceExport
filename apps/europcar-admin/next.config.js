/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@invoice-suite/auth",
    "@invoice-suite/config",
    "@invoice-suite/db",
    "@invoice-suite/ui",
    "@invoice-suite/utils",
    "@invoice-suite/pdf",
    "@invoice-suite/mydata",
  ],
};

export default nextConfig;
