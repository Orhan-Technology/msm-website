export type Project = {
  title: string;
  partner: string;
  year: string;
  location: string;
  category: string;
  image: string;
  description: string;
};

// Flagship works and partnerships drawn from the MSM company profile.
// Add new completed projects here as the client supplies details + photos.
export const projects: Project[] = [
  {
    title: "Continuous-cast steel line & laboratory",
    partner: "USAID — ABADE program",
    year: "2012–2017",
    location: "Pol-e-Charkhi, Kabul",
    category: "Public-Private Alliance",
    image: "/images/plant/molten-stream.jpg",
    description:
      "A USAID-ABADE Public-Private Alliance (2012–2017) that installed a continuous cast-steel line and quality laboratory, introduced standardized steel products, and created employment for 200+ young Afghans.",
  },
  {
    title: "MSCC China steel collaboration",
    partner: "MSCC China project",
    year: "2019",
    location: "Nela Bagh, Kabul",
    category: "International partnership",
    image: "/images/plant/rolling-line.jpg",
    description:
      "A strategic collaboration that strengthened MSM's rolling capacity and transferred technical skills to Afghan engineers and operators.",
  },
  {
    title: "Nationwide rebar supply",
    partner: "Construction & infrastructure clients",
    year: "Ongoing",
    location: "All 34 provinces",
    category: "Supply",
    image: "/images/plant/stock-rebar.jpg",
    description:
      "Certified GR60 / GR75 rebar supplied across every province of Afghanistan — the backbone of foundations, columns and slabs in the nation's largest construction projects.",
  },
  {
    title: "Structural steel for industrial builds",
    partner: "Industrial & commercial developers",
    year: "Ongoing",
    location: "Afghanistan",
    category: "Supply",
    image: "/images/plant/stock-beams.jpg",
    description:
      "Hot-rolled angles and T-bars manufactured to ASTM and DIN standards for frames, supports and fabrication across industrial and commercial developments.",
  },
];
