import "server-only";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/index";
import { assets } from "@/db/schema";
import { mediaKindOf, type MediaKind } from "@/lib/media/media-kinds";
import type { AssetRow } from "@/db/schema";

export async function insertAsset(row: AssetRow) {
  await getDb().insert(assets).values(row);
}

export async function fetchAssets(kind?: MediaKind): Promise<AssetRow[]> {
  const rows = await getDb().select().from(assets).orderBy(desc(assets.createdAt));
  if (!kind) return rows;
  return rows.filter((row) => mediaKindOf(row.mimeType) === kind);
}

export async function fetchAsset(id: string): Promise<AssetRow | null> {
  const [row] = await getDb().select().from(assets).where(eq(assets.id, id)).limit(1);
  return row ?? null;
}

export async function updateAssetAlt(id: string, alt: string) {
  await getDb().update(assets).set({ alt }).where(eq(assets.id, id));
}

export async function deleteAssetRow(id: string) {
  await getDb().delete(assets).where(eq(assets.id, id));
}

export async function countAssets() {
  const rows = await getDb().select({ id: assets.id }).from(assets);
  return rows.length;
}
