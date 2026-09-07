"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { AdminBadge, AdminCard, AdminEmpty } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export type AdminMessage = {
  id: string;
  kind: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  read: number;
  createdAt: number;
};

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessagesAdmin({ initialMessages }: { initialMessages: AdminMessage[] }) {
  const t = useTranslations("admin.inbox");
  const [messages, setMessages] = useState(initialMessages);
  const [openId, setOpenId] = useState<string | null>(null);

  async function toggleRead(message: AdminMessage) {
    const response = await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: message.id, read: message.read === 0 }),
    });
    const data = (await response.json()) as { messages?: AdminMessage[] };
    if (data.messages) setMessages(data.messages);
  }

  async function remove(id: string) {
    if (!window.confirm(t("confirmDelete"))) return;
    const response = await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
    const data = (await response.json()) as { messages?: AdminMessage[] };
    if (data.messages) setMessages(data.messages);
  }

  if (messages.length === 0) {
    return (
      <AdminEmpty title={t("noMessages")} description={t("noMessagesHint")} />
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => {
        const isOpen = openId === message.id;
        const unread = message.read === 0;
        return (
          <AdminCard key={message.id} className={cn("overflow-hidden", unread && "border-accent/40")}>
            <div className="flex items-start gap-4 p-4">
              <span
                className={cn(
                  "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-btn",
                  unread ? "bg-accent/10 text-accent" : "bg-sand text-ink/35",
                )}
              >
                {unread ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
              </span>

              <button onClick={() => setOpenId(isOpen ? null : message.id)} className="min-w-0 flex-1 text-left">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-sm font-semibold text-ink">
                    {message.name || message.email || t("unknownSender")}
                  </span>
                  {message.kind === "newsletter" && <AdminBadge tone="muted">{t("newsletter")}</AdminBadge>}
                  {unread && <AdminBadge tone="accent">{t("new")}</AdminBadge>}
                </span>
                <span className="mt-0.5 block text-xs text-ink/45">
                  {message.email}
                  {message.phone ? ` · ${message.phone}` : ""} · {formatDate(message.createdAt)}
                </span>
                {message.message && !isOpen && (
                  <span className="mt-1.5 block truncate text-sm text-ink/60">{message.message}</span>
                )}
              </button>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => void toggleRead(message)}
                  className="rounded-btn px-2.5 py-1.5 font-display text-xs font-medium text-ink/50 transition-colors hover:bg-sand hover:text-ink"
                >
                  {unread ? t("markRead") : t("markUnread")}
                </button>
                <button
                  onClick={() => void remove(message.id)}
                  aria-label={t("deleteMessage")}
                  className="grid h-8 w-8 place-items-center rounded-btn text-ink/40 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {isOpen && (
              <div className="border-t border-line-light bg-sand/40 px-4 py-4">
                {message.company && (
                  <p className="text-sm text-ink/60">
                    <span className="font-medium text-ink">{t("company")}</span> {message.company}
                  </p>
                )}
                {message.subject && (
                  <p className="text-sm text-ink/60">
                    <span className="font-medium text-ink">{t("subject")}</span> {message.subject}
                  </p>
                )}
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink/75">
                  {message.message || t("noBody")}
                </p>
                {message.email && (
                  <a
                    href={`mailto:${message.email}`}
                    className="mt-4 inline-flex items-center gap-1.5 font-display text-sm font-medium text-accent hover:text-accent-hover"
                  >
                    {t("replyByEmail")}
                  </a>
                )}
              </div>
            )}
          </AdminCard>
        );
      })}
    </div>
  );
}
