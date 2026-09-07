import "server-only";
import { revalidateTag } from "next/cache";
import { CMS_CACHE_TAG, MEDIA_CACHE_TAG } from "@/lib/cms/cache-tags";

/** Call after any admin write so the public site picks the change up immediately. */
export function revalidateCms() {
  revalidateTag(CMS_CACHE_TAG);
}

export function revalidateMedia() {
  revalidateTag(MEDIA_CACHE_TAG);
}
