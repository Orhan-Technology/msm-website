/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Old demo/variant URLs → clean live routes
      { source: "/contact-pages/:path*", destination: "/contact", permanent: true },
      { source: "/blog-pages/:path*", destination: "/blog", permanent: true },
      { source: "/home-pages/:path*", destination: "/", permanent: true },
      // Removed utility/template pages
      { source: "/template-pages/:path*", destination: "/", permanent: true },
      { source: "/coming-soon", destination: "/", permanent: true },
      { source: "/password", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
