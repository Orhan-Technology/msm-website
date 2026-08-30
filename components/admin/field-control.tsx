"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, ChevronUp, GripVertical, Plus, Trash2 } from "lucide-react";
import MediaPicker from "@/components/admin/media-picker";
import {
  AdminButton,
  AdminHelp,
  AdminInput,
  AdminLabel,
  AdminSelect,
  AdminTextarea,
  AdminToggle,
} from "@/components/admin/ui";
import type { Field } from "@/lib/cms/types";
import { fieldLabel } from "@/lib/i18n/field-labels";
import type { Locale } from "@/lib/i18n/locales";
import { cn } from "@/lib/utils";

/** Icon names the site's <Icon /> component understands. */
const iconChoices = [
  "Flame", "Recycle", "Thermometer", "FlaskConical", "Hammer", "Layers", "Mail", "Phone",
  "MapPin", "ShieldCheck", "Cog", "Mountain", "Handshake", "Globe", "HardHat", "Store",
  "TrendingUp", "Gauge", "Spline", "FileCheck", "FileText", "Download",
  "Facebook", "Twitter", "Instagram", "Youtube", "Linkedin",
];

type Value = unknown;

/** Build a blank item matching a list's declared shape. */
function emptyItem(fields: Field[]): Record<string, Value> {
  const item: Record<string, Value> = {};
  for (const field of fields) {
    if (field.type === "boolean") item[field.key] = false;
    else if (field.type === "number") item[field.key] = 0;
    else if (field.type === "list") item[field.key] = [];
    else item[field.key] = "";
  }
  return item;
}

function itemTitle(field: Field, item: Record<string, Value>, fallback: string) {
  const key = field.itemTitleKey ?? field.of?.[0]?.key;
  const raw = key ? item[key] : null;
  const text = typeof raw === "string" ? raw.trim() : typeof raw === "number" ? String(raw) : "";
  if (text) return text.length > 70 ? `${text.slice(0, 70)}…` : text;
  return fallback;
}

export function FieldControl({
  field,
  value,
  onChange,
  idPrefix = "",
}: {
  field: Field;
  value: Value;
  onChange: (next: Value) => void;
  idPrefix?: string;
}) {
  const locale = useLocale() as Locale;
  const label = fieldLabel(locale, field.label);
  const help = fieldLabel(locale, field.help);
  const id = `${idPrefix}${field.key}`;

  if (field.type === "list") {
    return <ListControl field={field} value={value} onChange={onChange} idPrefix={idPrefix} />;
  }

  if (field.type === "boolean") {
    return (
      <div className="pt-6">
        <AdminToggle checked={value === true} onChange={onChange} label={label} />
        <AdminHelp>{help}</AdminHelp>
      </div>
    );
  }

  const stringValue = typeof value === "string" ? value : value == null ? "" : String(value);

  return (
    <div>
      <AdminLabel htmlFor={id}>{label}</AdminLabel>

      {field.type === "image" || field.type === "video" || field.type === "media" || field.type === "file" ? (
        <MediaPicker
          value={stringValue}
          onChange={onChange}
          label={label}
          kind={
            field.type === "image"
              ? "image"
              : field.type === "video"
                ? "video"
                : field.type === "file"
                  ? "document"
                  : "any"
          }
        />
      ) : field.type === "textarea" || field.type === "markdown" ? (
        <AdminTextarea
          id={id}
          value={stringValue}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={field.type === "markdown" ? "min-h-[220px] font-mono text-[13px]" : undefined}
        />
      ) : field.type === "number" ? (
        <AdminInput
          id={id}
          type="number"
          value={stringValue}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value === "" ? "" : Number(event.target.value))}
        />
      ) : field.type === "select" ? (
        <AdminSelect id={id} value={stringValue} onChange={(event) => onChange(event.target.value)}>
          {(field.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </AdminSelect>
      ) : field.type === "icon" ? (
        <AdminSelect id={id} value={stringValue} onChange={(event) => onChange(event.target.value)}>
          <option value="">{fieldLabel(locale, "None")}</option>
          {iconChoices.map((icon) => (
            <option key={icon} value={icon}>
              {icon}
            </option>
          ))}
        </AdminSelect>
      ) : (
        <AdminInput
          id={id}
          value={stringValue}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}

      <AdminHelp>{help}</AdminHelp>
    </div>
  );
}

function ListControl({
  field,
  value,
  onChange,
  idPrefix,
}: {
  field: Field;
  value: Value;
  onChange: (next: Value) => void;
  idPrefix: string;
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations("admin.fields");
  const itemFields = field.of ?? [];
  const items = Array.isArray(value) ? (value as Record<string, Value>[]) : [];
  const [openIndex, setOpenIndex] = useState<number | null>(items.length === 0 ? null : 0);

  function update(next: Record<string, Value>[]) {
    onChange(next);
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    update(next);
    setOpenIndex(to);
  }

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <AdminLabel>{fieldLabel(locale, field.label)}</AdminLabel>
        <span className="text-xs text-ink/40">{t("itemCount", { count: items.length })}</span>
      </div>
      {field.help && (
        <p className="-mt-0.5 mb-2 text-xs leading-relaxed text-ink/45">{fieldLabel(locale, field.help)}</p>
      )}

      <div className="space-y-2">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={cn(
                "overflow-hidden rounded-btn border bg-white transition-colors",
                isOpen ? "border-accent/40" : "border-line-light",
              )}
            >
              <div className="flex items-center gap-1 px-2 py-2">
                <GripVertical className="h-4 w-4 shrink-0 text-ink/20" />
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex min-w-0 flex-1 items-center gap-2 px-1 py-1 text-left"
                >
                  <span className="font-display text-xs font-semibold text-ink/35">{index + 1}</span>
                  <span className="truncate font-display text-sm font-medium text-ink">
                    {itemTitle(field, item, t("item", { number: index + 1 }))}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => move(index, index - 1)}
                  disabled={index === 0}
                  aria-label={t("moveUp")}
                  className="grid h-8 w-8 place-items-center rounded-btn text-ink/40 hover:bg-sand hover:text-ink disabled:opacity-25"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, index + 1)}
                  disabled={index === items.length - 1}
                  aria-label={t("moveDown")}
                  className="grid h-8 w-8 place-items-center rounded-btn text-ink/40 hover:bg-sand hover:text-ink disabled:opacity-25"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    update(items.filter((_, i) => i !== index));
                    setOpenIndex(null);
                  }}
                  aria-label={t("remove")}
                  className="grid h-8 w-8 place-items-center rounded-btn text-ink/40 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {isOpen && (
                <div className="grid gap-4 border-t border-line-light bg-sand/40 p-4 md:grid-cols-2">
                  {itemFields.map((itemField) => (
                    <div key={itemField.key} className={itemField.wide || itemField.type === "list" ? "md:col-span-2" : ""}>
                      <FieldControl
                        field={itemField}
                        value={item[itemField.key]}
                        idPrefix={`${idPrefix}${field.key}-${index}-`}
                        onChange={(next) => {
                          const updated = [...items];
                          updated[index] = { ...updated[index], [itemField.key]: next };
                          update(updated);
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-2">
        <AdminButton
          onClick={() => {
            update([...items, emptyItem(itemFields)]);
            setOpenIndex(items.length);
          }}
        >
          <Plus className="h-4 w-4" />
          {fieldLabel(locale, field.addLabel) || fieldLabel(locale, "Add item")}
        </AdminButton>
      </div>
    </div>
  );
}
