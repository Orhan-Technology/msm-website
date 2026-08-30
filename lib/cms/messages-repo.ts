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

export function createMessage(input: MessageInput): ContactMessageRow {
  const db = getDb();
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
  db.insert(contactMessages).values(row).run();
  return row;
}

export function fetchMessages(): ContactMessageRow[] {
  return getDb().select().from(contactMessages).orderBy(desc(contactMessages.createdAt)).all();
}

export function markMessageRead(id: string, read: boolean) {
  getDb().update(contactMessages).set({ read: read ? 1 : 0 }).where(eq(contactMessages.id, id)).run();
}

export function deleteMessage(id: string) {
  getDb().delete(contactMessages).where(eq(contactMessages.id, id)).run();
}

export function countUnreadMessages() {
  return getDb().select().from(contactMessages).all().filter((row) => row.read === 0).length;
}
