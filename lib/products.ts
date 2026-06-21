export type Spec = { key: string; value: string };

export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number; // USD per metric ton (indicative)
  image: string;
  specs: Spec[];
  description: string;
};

export const productCategories = [
  "All",
  "Reinforcement",
  "Structural",
  "Semi-finished",
  "Plate",
] as const;

export const products: Product[] = [
  {
    slug: "steel-rebar",
    name: "Steel Rebar",
    category: "Reinforcement",
    price: 720,
    image: "/images/products/steel-rebar.jpg",
    description:
      "Ribbed reinforcement bar for concrete structures — the backbone of foundations, columns and slabs. Rolled and stamped at our Pol-e-Charkhi mill to international standard.",
    specs: [
      { key: "Diameter", value: "8–32 mm" },
      { key: "Standard", value: "ISO 630-1" },
      { key: "Surface", value: "Ribbed / deformed" },
      { key: "Length", value: "12 m (custom on request)" },
      { key: "Stamp", value: "MSM traceable" },
    ],
  },
  {
    slug: "steel-angles",
    name: "Steel Angles",
    category: "Structural",
    price: 760,
    image: "/images/products/steel-angles.jpg",
    description:
      "Equal-leg structural angles for frames, supports and fabrication — hot-rolled for dependable strength across a full range of sizes.",
    specs: [
      { key: "Size", value: "20×20 – 75×75 mm" },
      { key: "Process", value: "Hot-rolled" },
      { key: "Profile", value: "Equal-leg L" },
      { key: "Standard", value: "Structural grade" },
    ],
  },
  {
    slug: "steel-tbars",
    name: "Steel T-Bars",
    category: "Structural",
    price: 780,
    image: "/images/products/steel-tbars.jpg",
    description:
      "T-section iron for framing, gates and fabrication work — precise profiles in a full range of weights.",
    specs: [
      { key: "Weight", value: "500–1000 g/ft" },
      { key: "Profile", value: "T-iron" },
      { key: "Process", value: "Hot-rolled" },
      { key: "Finish", value: "Mill finish" },
    ],
  },
  {
    slug: "steel-billets",
    name: "Steel Billets",
    category: "Semi-finished",
    price: 540,
    image: "/images/products/steel-coils.jpg",
    description:
      "Continuously cast, defect-free billets — the semi-finished feedstock for downstream rolling and fabrication.",
    specs: [
      { key: "Section", value: "Square cast" },
      { key: "Process", value: "Continuous casting" },
      { key: "Quality", value: "Lab-verified chemistry" },
      { key: "Use", value: "Re-rolling feedstock" },
    ],
  },
  {
    slug: "plate-steel",
    name: "Plate Steel",
    category: "Plate",
    price: 690,
    image: "/images/products/plate-steel.jpg",
    description:
      "Flat plate and section stock for general fabrication, base plates and heavy structural connections.",
    specs: [
      { key: "Form", value: "Flat plate / section" },
      { key: "Finish", value: "Hot-rolled" },
      { key: "Grade", value: "Structural" },
      { key: "Cutting", value: "To-length on request" },
    ],
  },
  {
    slug: "structural-beams",
    name: "Structural Sections",
    category: "Structural",
    price: 810,
    image: "/images/products/structural-beams.jpg",
    description:
      "Structural sections for frames and supports — part of our roadmap toward I-beams and H-beams as we expand the value chain.",
    specs: [
      { key: "Type", value: "Structural sections" },
      { key: "Process", value: "Hot-rolled" },
      { key: "Roadmap", value: "I-beam / H-beam (planned)" },
      { key: "Standard", value: "ISO-aligned" },
    ],
  },
];
