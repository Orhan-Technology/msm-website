# Maisam Steel Mill — Website

The official website for **Maisam Steel Mill (MSM)** — Afghanistan's first ISO-certified steel manufacturer (est. 2009, Pol-e-Charkhi Industrial Park, Kabul).

A trilingual, content-driven marketing site with a built-in admin panel: company story, products, services, projects, events, ISO certifications, blog and contact. Published in **English, Dari (دری) and Pashto (پښتو)**. It is **not** an e-commerce store — products are presented as a catalog with "Request a quote" calls to action.

## Tech stack

| | |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org) (App Router) + [React 19](https://react.dev) |
| **Language** | TypeScript |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) 3.4 |
| **Database** | SQLite via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) + [Drizzle ORM](https://orm.drizzle.team) |
| **Localisation** | [next-intl](https://next-intl.dev) — English, Dari, Pashto, with RTL |
| **Auth** | Password login, signed session cookie ([jose](https://github.com/panva/jose) / JWT) |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [lucide-react](https://lucide.dev) |
| **Markdown** | [react-markdown](https://github.com/remarkjs/react-markdown) (blog post bodies) |
| **Fonts** | Archivo (display) + IBM Plex Sans (body); Vazirmatn for Dari/Pashto — all via `next/font` |
| **Package manager** | [pnpm](https://pnpm.io) |

## Getting started

**Prerequisites:** Node.js 20+ and pnpm.

```bash
# install dependencies
pnpm install

# create your local environment file
cp .env.example .env.local
#   → set ADMIN_PASSWORD (8+ chars) and SESSION_SECRET (16+ chars)

# start the dev server (http://localhost:3000)
pnpm dev

# type-check + production build
pnpm build

# run the production build locally
pnpm start

# lint
pnpm lint
```

The database file is created automatically on first run at `data/msm-cms.db` — there is no separate migration step.

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `ADMIN_PASSWORD` | yes | Password for `/admin`. Minimum 8 characters. |
| `SESSION_SECRET` | yes | Signs the admin session cookie. Minimum 16 characters. |
| `SQLITE_URL` | no | Database location. Defaults to `file:./data/msm-cms.db`. |
| `NEXT_PUBLIC_SITE_URL` | no | Canonical URL for metadata, sitemap and structured data. Defaults to `https://msm.af`. |

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Languages

| Language | URL | Direction | `hreflang` |
|---|---|---|---|
| English (default) | `/about` | LTR | `en` |
| Dari | `/fa/about` | RTL | `fa-AF` |
| Pashto | `/ps/about` | RTL | `ps-AF` |

English stays on the un-prefixed paths, so every URL that is already indexed keeps
working; Dari and Pashto sit under `/fa` and `/ps`. A language switcher appears in
the header and the footer, and the `<html lang>`/`dir` plus `hreflang` alternates
are emitted automatically.

**Typography.** Latin text uses Archivo + IBM Plex Sans. Dari and Pashto switch to
**Vazirmatn**, a modern variable Arabic-script face that covers the extra Pashto
letters (ټ ډ ړ ږ ښ ګ ڼ ې ۍ). On the RTL locales letter-spacing is forced to zero —
tracking would break the cursive joins — the width axis is disabled, and line
height is opened up. Phone numbers and emails are wrapped in `<bdi dir="ltr">` so
the bidi algorithm doesn't reorder their digit groups.

**Two layers of translation:**

1. **Interface strings** (buttons, labels, form fields, the whole admin panel) —
   translated in `messages/{en,fa,ps}.json`, with English filling any gap.
   Editor field labels live in `lib/i18n/field-labels.ts`, keyed by their English
   text so one entry translates every section that uses that phrase.
2. **Content** (headings, body copy, products, events) — entered per language in
   the admin. Each section and each event has an **English / دری / پښتو** tab.
   A field left empty in Dari or Pashto falls back to the English text field by
   field, so a partly-translated page is never blank.

## Admin panel

Sign in at **`/admin`**. From there the whole public site is editable — no developer needed.
The panel itself runs in English, Dari or Pashto (picked from the sidebar and
remembered in a cookie) and flips to RTL with the language.

| Area | What you can do |
|---|---|
| **Global** | Logo, wordmark, main menu, company details, offices, socials, footer, SEO and share image |
| **Home page** | All 15 bands — hero video, intro collage, products, services, process, quality, lab, presence, projects, events, newsletter, testimonials, partners, downloads, blog |
| **About page** | Header, story, values, CEO message, vision & mission, mining research, team |
| **Products** | Page header plus the full catalogue — name, photo, video, price, specification, description |
| **Services** | Page header plus every service — icon, photo, video, capabilities |
| **Projects** | Page header plus every project — photo, video, partner, year, description |
| **Events** | Page header, plus create/edit/publish/reorder individual events |
| **Blog** | Page header plus every article — cover image, excerpt, markdown body |
| **Contact** | Page header, form copy, success message and map |
| **Media library** | Upload and reuse images (10 MB), videos (300 MB) and PDFs (40 MB) |
| **Inbox** | Contact-form enquiries and newsletter sign-ups |

Every field is declared once in `lib/cms/sections.ts`; the editor UI is generated from that
definition, so adding a new editable field needs no admin-UI code.

**How content resolves:** each section ships with default content (drawn from `lib/*.ts`). When
an admin saves, the change is stored as a partial overlay in SQLite and deep-merged over that
default. Untouched sections keep rendering the shipped copy, and **Reset** on any section
restores it.

## API

Public (read-only, cached):

| Route | Purpose |
|---|---|
| `GET /api/events` | Published events. Supports `?locale=`, `?limit=` and `?featured=true`. |
| `GET /api/events/[slug]` | A single published event. Supports `?locale=`. |
| `GET /api/content/[key]` | A resolved content section, e.g. `/api/content/home.hero?locale=fa`. |
| `POST /api/contact` | Contact form and newsletter sign-up. Rate-limited, with a honeypot. |
| `GET /api/uploads/[file]` | Serves uploaded media. Videos support HTTP range requests. |

Admin (session cookie required):

| Route | Purpose |
|---|---|
| `POST /api/admin/login` · `POST /api/admin/logout` · `GET /api/admin/session` | Authentication |
| `GET/PUT/DELETE /api/admin/content` | Read, save and reset a section in one language (`locale` param) |
| `POST /api/admin/locale` | Set the admin panel's working language |
| `GET/POST/PATCH/DELETE /api/admin/assets` | Media library |
| `GET/POST/PATCH /api/admin/events` · `GET/PUT/DELETE /api/admin/events/[id]` | Events |
| `GET/PATCH/DELETE /api/admin/messages` | Inbox |

## Project structure

```
.
├── app/
│   ├── (site)/[locale]/      # The public site, one tree for all three languages
│   │   ├── layout.tsx        #   <html lang/dir>, fonts, metadata from the CMS
│   │   ├── page.tsx          #   Home
│   │   ├── about/ products/ services/ projects/ blog/ contact/ events/
│   │   └── product/[slug]/ service/[slug]/ blog/[slug]/ team/[slug]/
│   ├── (admin)/admin/        # Admin panel — its own root layout, no locale prefix
│   ├── api/                  # Public and admin API routes
│   └── globals.css           # Design tokens, base styles, RTL rules
├── i18n/                     # next-intl routing, navigation and request config
├── messages/                 # en.json · fa.json · ps.json
├── components/
│   ├── admin/                # Admin shell, section editor, media picker
│   ├── events/               # Event card
│   └── sections/             # Page sections (Hero, ProductsShowcase, …)
├── db/                       # Drizzle schema + migration on boot
├── lib/
│   ├── admin/                # Auth: JWT, password, rate limit, guards
│   ├── cms/                  # Section registry, repositories, content reader
│   ├── i18n/                 # Locales, fonts, message loader, field labels
│   └── media/                # Upload types and size limits
├── data/                     # SQLite database (gitignored)
└── public/
    ├── images/ videos/ downloads/
    └── uploads/              # Admin uploads (gitignored)
```

## Deployment

Runs on any Node host: `pnpm build` then `pnpm start`.

**Important:** the CMS stores content in a SQLite file and uploads on the local filesystem, so
the app needs **persistent disk** — a VPS, Docker volume, Fly.io volume or Railway volume. It
will not retain content on a read-only or ephemeral filesystem (including Vercel's default
serverless runtime). Back up `data/` and `public/uploads/` together.

## Notes

- **Forms are live** — contact and newsletter submissions are stored and readable in the admin Inbox. Wire an email notification on top if you want alerts.
- **Map** uses Google's keyless `/maps/embed?pb=` embed and is editable under Global → Company details.
- `next.config.mjs` redirects old/demo URLs (e.g. `/blog-pages/*`, `/contact-pages/*`) to the clean routes.
- The `lib/*.ts` data files remain the seed/default content. Editing them changes the fallback that a never-edited section renders.
- **Content ships untranslated.** Interface strings are fully translated into Dari and Pashto; the marketing copy starts as English in all three languages and falls back to English until someone enters the translation in the admin.
- To add a fourth language: add it to `lib/i18n/locales.ts`, drop in `messages/<code>.json`, and add a column to `lib/i18n/field-labels.ts`. Nothing else needs to change.

---

© Maisam Steel Mill. All rights reserved.
