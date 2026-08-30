/**
 * The admin panel is generated from these definitions: every editable section
 * declares its fields once, and the editor renders the right control for each
 * one. Adding a field here makes it editable in the panel — no admin UI code.
 */
export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "number"
  | "url"
  | "boolean"
  | "image"
  | "video"
  | "media"
  | "file"
  | "icon"
  | "select"
  | "list";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
  placeholder?: string;
  /** Options for `select`. */
  options?: { value: string; label: string }[];
  /** Item shape for `list`. */
  of?: Field[];
  /** Which item field to show as the row title in the list editor. */
  itemTitleKey?: string;
  /** Label for the "add item" button in a list editor. */
  addLabel?: string;
  /** Render this field across the full editor width. */
  wide?: boolean;
};

export type PageKey =
  | "global"
  | "home"
  | "about"
  | "products"
  | "services"
  | "projects"
  | "events"
  | "blog"
  | "contact";

export type SectionDef = {
  /** Stable storage key, e.g. "home.hero". */
  key: string;
  label: string;
  page: PageKey;
  description: string;
  /** Where this section shows on the live site, for the editor's "View" link. */
  previewPath: string;
  fields: Field[];
  defaults: Record<string, unknown>;
};

export type PageGroup = {
  key: PageKey;
  label: string;
  path: string;
  icon: string;
  description: string;
};
