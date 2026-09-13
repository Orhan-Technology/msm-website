import "server-only";
import { randomUUID } from "crypto";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/index";
import { contactMessages } from "@/db/schema";
import type { ContactMessageRow } from "@/db/schema";

export type MessageInput = {
  kind?: "contact" | "newsletter";
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  subject?: string;
  message?: string;
  /** Which language the visitor was browsing in. */
  locale?: string;
};

export async function createMessage(input: MessageInput): Promise<ContactMessageRow> {
  const row: ContactMessageRow = {
    id: randomUUID(),
    kind: input.kind ?? "contact",
    name: (input.name ?? "").slice(0, 200),
    email: (input.email ?? "").slice(0, 200),
    phone: (input.phone ?? "").slice(0, 60),
    company: (input.company ?? "").slice(0, 200),
    subject: (input.subject ?? "").slice(0, 200),
    message: (input.message ?? "").slice(0, 5000),
    locale: input.locale ?? "en",
    read: 0,
    createdAt: Date.now(),
  };
  await getDb().insert(contactMessages).values(row);
  return row;
}

export async function fetchMessages(): Promise<ContactMessageRow[]> {
  return getDb().select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

export async function markMessageRead(id: string, read: boolean) {
  await getDb().update(contactMessages).set({ read: read ? 1 : 0 }).where(eq(contactMessages.id, id));
}

export async function deleteMessage(id: string) {
  await getDb().delete(contactMessages).where(eq(contactMessages.id, id));
}

export async function countUnreadMessages() {
  const rows = await getDb().select().from(contactMessages);
  return rows.filter((row) => row.read === 0).length;
}
