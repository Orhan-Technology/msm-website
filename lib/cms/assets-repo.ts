import "server-only";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/index";
import { assets } from "@/db/schema";
import { mediaKindOf, type MediaKind } from "@/lib/media/media-kinds";
import type { AssetRow } from "@/db/schema";

export function insertAsset(row: AssetRow) {
  getDb().insert(assets).values(row).run();
}

export function fetchAssets(kind?: MediaKind): AssetRow[] {
  const rows = getDb().select().from(assets).orderBy(desc(assets.createdAt)).all();
  if (!kind) return rows;
  return rows.filter((row) => mediaKindOf(row.mimeType) === kind);
}

export function fetchAsset(id: string): AssetRow | null {
  return getDb().select().from(assets).where(eq(assets.id, id)).get() ?? null;
}

export function updateAssetAlt(id: string, alt: string) {
  getDb().update(assets).set({ alt }).where(eq(assets.id, id)).run();
}

export function deleteAssetRow(id: string) {
  getDb().delete(assets).where(eq(assets.id, id)).run();
}

export function countAssets() {
  return getDb().select({ id: assets.id }).from(assets).all().length;
}
