import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emits .next/standalone with a self-contained server.js and only the traced
  // dependencies, which is what the Dockerfile ships.
  output: "standalone",
  // better-sqlite3 is a native module; keep it out of the bundler.
  serverExternalPackages: ["better-sqlite3"],
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
  async rewrites() {
    // Uploaded media is written after build, so it is served by the API route
    // rather than Next's static manifest. This keeps the short /uploads path working.
    return { afterFiles: [{ source: "/uploads/:path*", destination: "/api/uploads/:path*" }] };
  },
};

export default withNextIntl(nextConfig);
