export type Service = {
  slug: string;
  title: string;
  shortDescription: string;
  icon: string; // lucide-react icon name
  fullDescription: string;
  capabilities: string[];
};

export const services: Service[] = [
  {
    slug: "metal-crafting",
    title: "Metal Crafting",
    shortDescription:
      "Melting and continuous casting of high-grade billets, the foundation of every certified bar we make.",
    icon: "Flame",
    fullDescription:
      "Our crafting line charges raw material into a controlled electric furnace and continuously casts it into consistent, defect-free billets. Tight control over temperature, chemistry and cooling gives every batch the mechanical properties demanded by structural applications.",
    capabilities: [
      "Controlled electric-arc melting",
      "Continuous billet casting",
      "Chemistry control per heat",
      "Traceable batch records",
    ],
  },
  {
    slug: "metal-recycling",
    title: "Metal Recycling",
    shortDescription:
      "Turning local scrap into new structural steel — a cleaner, circular value chain for Afghanistan.",
    icon: "Recycle",
    fullDescription:
      "We recover and re-melt steel scrap into new billets, reducing waste and dependence on imported raw material. Recycling is central to our ISO 14001 environmental commitment and to building a self-reliant domestic supply.",
    capabilities: [
      "Scrap sorting and grading",
      "Re-melting into billets",
      "Lower-emission production",
      "ISO 14001 aligned",
    ],
  },
  {
    slug: "heat-treatment",
    title: "Heat Treatment",
    shortDescription:
      "Precise thermal processing to deliver the strength, ductility and durability each grade requires.",
    icon: "Thermometer",
    fullDescription:
      "Hot-rolling and controlled cooling tune the grain structure of our products so they meet exact strength and ductility targets. The result is steel that performs predictably under load, in tension and under fatigue.",
    capabilities: [
      "Hot rolling to spec",
      "Controlled cooling",
      "Grain-structure tuning",
      "Consistent yield strength",
    ],
  },
  {
    slug: "quality-testing",
    title: "Quality Testing",
    shortDescription:
      "In-house laboratory testing of every batch for strength and tolerance before it ever ships.",
    icon: "FlaskConical",
    fullDescription:
      "Under our ISO 9001 quality system, samples from every batch are lab-tested for tensile strength, dimensional tolerance and surface quality. Nothing leaves Pol-e-Charkhi until it passes — that is our promise on the wall and in the steel.",
    capabilities: [
      "Tensile and yield testing",
      "Dimensional inspection",
      "ISO 9001 quality system",
      "Per-batch certificates",
    ],
  },
  {
    slug: "structural-fabrication",
    title: "Structural Fabrication",
    shortDescription:
      "Angles, T-bars and sections fabricated for frames, supports and the structures that build a nation.",
    icon: "Hammer",
    fullDescription:
      "From equal-leg angles to T-section iron, we fabricate the structural shapes contractors rely on for frames, supports and reinforcement across residential, commercial and infrastructure projects.",
    capabilities: [
      "Equal-leg angles 20×20–75×75 mm",
      "T-iron sections",
      "Custom structural shapes",
      "Project-grade consistency",
    ],
  },
  {
    slug: "rolling-finishing",
    title: "Rolling & Finishing",
    shortDescription:
      "Hot rolling into rebar, angles and T-bars to exact dimensional specification and surface finish.",
    icon: "Layers",
    fullDescription:
      "Our rolling mill shapes billets into finished rebar, angles and T-bars at precise tolerances. Every length is stamped, inspected and prepared for dispatch to construction and infrastructure projects nationwide.",
    capabilities: [
      "Rebar 8–32 mm",
      "Ribbed surface profile",
      "MSM-stamped traceability",
      "Bundling and dispatch",
    ],
  },
];
