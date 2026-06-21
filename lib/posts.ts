export type PostCategory = "News" | "Guides" | "Resources";

export type Post = {
  slug: string;
  title: string;
  category: PostCategory;
  excerpt: string;
  date: string; // ISO date
  image: string;
  author: string;
  body: string; // markdown
};

export const postCategories: PostCategory[] = ["News", "Guides", "Resources"];

export const posts: Post[] = [
  {
    slug: "from-ore-to-structure",
    title: "From ore to structure: inside an integrated steel mill",
    category: "Guides",
    excerpt:
      "Every bar begins as fire. We walk through the four stages — melting, casting, rolling and testing — that turn raw material into certified steel.",
    date: "2026-05-12",
    image: "/images/posts/post-1.jpg",
    author: "Abdul Rahman",
    body: `## Every bar begins as fire\n\nAn integrated mill controls each stage in-house, so that what leaves the plant is consistent and certified.\n\n### Melting\nRaw material is charged and melted in a controlled electric furnace, where chemistry and temperature are held within tight limits.\n\n### Casting\nContinuous casting forms consistent, defect-free billets — the semi-finished feedstock for everything downstream.\n\n### Rolling\nBillets are hot-rolled into rebar, angles and T-bars at precise tolerances and given their surface profile.\n\n### Testing\nSamples from every batch are lab-tested for strength and tolerance before a single length ships.`,
  },
  {
    slug: "why-iso-certification-matters",
    title: "Why ISO certification matters for the steel you build with",
    category: "Resources",
    excerpt:
      "A certificate on the wall is really a promise in the steel. Here's what ISO 9001, 14001 and 45001 actually guarantee.",
    date: "2026-04-28",
    image: "/images/posts/post-2.jpg",
    author: "Mohammad Naseer",
    body: `## A promise in the steel\n\nCertification is not paperwork — it is a system that makes quality repeatable.\n\n- **ISO 9001** governs the quality management system behind every batch.\n- **ISO 14001** covers environmental management and cleaner production.\n- **ISO 45001** protects the people who make the steel.\n\nTogether with ISO 630-1 for structural delivery, these standards let engineers sign off with confidence.`,
  },
  {
    slug: "choosing-the-right-rebar",
    title: "Choosing the right rebar diameter for your project",
    category: "Guides",
    excerpt:
      "From 8 mm ties to 32 mm column reinforcement — a practical guide to selecting rebar size and grade.",
    date: "2026-04-10",
    image: "/images/posts/post-3.jpg",
    author: "Mohammad Naseer",
    body: `## Sizing reinforcement\n\nRebar diameter is driven by load, spacing and code requirements. Smaller bars suit ties and slabs; larger bars carry column and foundation loads.\n\nOur rebar runs from **8 mm to 32 mm**, ribbed for bond and rolled to ISO 630-1. When in doubt, share your drawings and our team will help match size and grade.`,
  },
  {
    slug: "building-a-domestic-value-chain",
    title: "Building a domestic steel value chain in Afghanistan",
    category: "News",
    excerpt:
      "Our vision reaches beyond the mill floor — toward Afghan iron ore, more skilled jobs, and steel that reaches regional markets.",
    date: "2026-03-22",
    image: "/images/posts/post-4.jpg",
    author: "Shafiq Ahmad Khwajazada",
    body: `## Beyond the mill floor\n\nAfghanistan holds vast, largely untapped iron-ore reserves. Our long-term vision is to develop them responsibly and build a full domestic value chain — from mine to mill to market.\n\nAs we grow, so does the opportunity: more skilled jobs, a stronger economy, and Afghan steel reaching beyond our borders.`,
  },
  {
    slug: "recycling-scrap-into-strength",
    title: "Recycling scrap into strength",
    category: "Resources",
    excerpt:
      "How re-melting local steel scrap reduces waste, cuts import dependence and supports cleaner production.",
    date: "2026-03-05",
    image: "/images/posts/post-5.jpg",
    author: "Abdul Rahman",
    body: `## A circular approach\n\nRecovered scrap is sorted, graded and re-melted into new billets. The result is less waste, less reliance on imported raw material, and a lower-emission path to new structural steel — central to our ISO 14001 commitment.`,
  },
  {
    slug: "what-336-tons-a-day-means",
    title: "What 336 tons a day means for your schedule",
    category: "News",
    excerpt:
      "Dependable capacity is a planning tool. Here's how consistent daily output keeps construction timelines on track.",
    date: "2026-02-18",
    image: "/images/posts/post-6.jpg",
    author: "Hamid Faizi",
    body: `## Capacity you can plan around\n\nProducing **336+ metric tons of certified steel every day** is not just a number — it is a commitment to availability. Contractors across nearly every province build their schedules on steel that arrives on spec and on time.`,
  },
];
