# Maisam Steel Mill — Website

The official informational website for **Maisam Steel Mill (MSM)** — Afghanistan's first ISO-certified steel manufacturer (est. 2009, Pol-e-Charkhi Industrial Park, Kabul).

A fast, content-driven marketing site: company story, products, services, ISO certifications, blog, and contact. It is **not** an e-commerce store — products are presented as a catalog with "Request a quote" calls to action.

## Tech stack

| | |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org) (App Router) + [React 19](https://react.dev) |
| **Language** | TypeScript |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) 3.4 |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [lucide-react](https://lucide.dev) |
| **Markdown** | [react-markdown](https://github.com/remarkjs/react-markdown) (blog post bodies) |
| **Fonts** | Archivo (display) + IBM Plex Sans (body), via `next/font` |
| **Package manager** | [pnpm](https://pnpm.io) |

## Getting started

**Prerequisites:** Node.js 18.18+ (20+ recommended) and pnpm.

```bash
# install dependencies
pnpm install

# start the dev server (http://localhost:3000)
pnpm dev

# type-check + production build
pnpm build

# run the production build locally
pnpm start

# lint
pnpm lint
```

## Project structure

```
.
├── app/                  # Routes (App Router)
│   ├── page.tsx          # Home
│   ├── about/            # About (story, stats, values, team)
│   ├── products/         # Product catalog
│   ├── product/[slug]/   # Product detail
│   ├── services/         # Services overview
│   ├── service/[slug]/   # Service detail
│   ├── blog/             # Blog index
│   ├── blog/[slug]/      # Blog post (markdown)
│   ├── contact/          # Contact form + Google Map
│   ├── team/[slug]/      # Team member profile
│   ├── layout.tsx        # Root layout, fonts, metadata
│   ├── globals.css       # Design tokens, base styles, animations
│   └── not-found.tsx     # 404
├── components/           # UI components
│   └── sections/         # Page sections (Hero, ProductsShowcase, …)
├── lib/                  # Content & data (edit these to update the site)
├── public/               # Images, logo, hero video, certificates
└── next.config.mjs       # Redirects (legacy URLs → clean routes)
```

## Editing content

All copy and data live in **`lib/`** — no CMS required:

- `lib/company.ts` — name, contact details, address, map link, stats, socials
- `lib/products.ts` — products and categories
- `lib/services.ts` — services
- `lib/posts.ts` — blog posts (markdown bodies)
- `lib/team.ts` — team members
- `lib/testimonials.ts` — testimonials

Images live in `public/images/` (and `public/videos/` for the hero clip).

## Deployment

Optimised for [Vercel](https://vercel.com): import the repo and deploy — Next.js and pnpm are auto-detected. Since the app is at the **repository root**, no "Root Directory" override is needed.

It also runs on any Node host: `pnpm build` then `pnpm start`.

## Notes

- **Forms are mock.** The contact and newsletter forms validate and show success/error states but do not yet send anywhere — wire them to an email service or API route before launch.
- **Map** uses Google's keyless `/maps/embed?pb=` embed, centered on the MSM plant.
- `next.config.mjs` redirects old/demo URLs (e.g. `/blog-pages/*`, `/contact-pages/*`) to the clean routes.

---

© Maisam Steel Mill. All rights reserved.
