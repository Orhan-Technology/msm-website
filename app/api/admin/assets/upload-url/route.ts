import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/require-admin";
import { maxBytesForMime, resolveUploadMime } from "@/lib/media/media-kinds";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Mints the short-lived token the browser uses to upload straight to Vercel Blob,
 * so a 300 MB video never has to fit through a Function's 100 MB request body.
 *
 * The size and type limits are enforced here rather than in the browser: the
 * token carries them, and Blob rejects anything that exceeds them.
 */
export async function POST(request: Request) {
  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  // Only the token request comes from the admin's browser. The completion callback
  // is delivered by Blob itself and carries no session cookie, so it must not be
  // put behind the admin guard.
  if (body.type === "blob.generate-client-token") {
    const unauthorized = await requireAdminApi();
    if (unauthorized) return unauthorized;
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const mime = resolveUploadMime("", pathname);
        if (!mime) throw new Error("Unsupported file type.");
        return {
          allowedContentTypes: [mime],
          maximumSizeInBytes: maxBytesForMime(mime),
          // The pathname already carries a uuid; a second suffix would only make
          // the stored name diverge from the asset id.
          addRandomSuffix: false,
        };
      },
      onUploadCompleted: async () => {
        // Nothing to do: the database row is written by POST /api/admin/assets once
        // the browser reports success. This callback cannot reach a localhost dev
        // server, so it must never be the only place the row gets created.
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Upload could not be authorised." },
      { status: 400 },
    );
  }
}
