import "server-only";
import path from "path";

/**
 * Where uploaded media lives on disk. In production this is a Dokploy volume
 * mounted at /app/uploads (see the Dockerfile), so files survive redeploys.
 * Files are served by /api/uploads/<name>, never straight from /public: anything
 * written after `next build` is missing from Next's static manifest.
 */
export const uploadDir = path.resolve(process.env.UPLOAD_DIR ?? path.join(process.cwd(), "public", "uploads"));
