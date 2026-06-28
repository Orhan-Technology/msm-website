export type Stat = { label: string; value: number; suffix: string };
export type SocialLink = { label: string; href: string; icon: string };
export type Office = {
  city: string;
  country: string;
  role: string;
  detail: string;
  status?: "operating" | "expanding";
};

export type Company = {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  email: string;
  emailAlt: string;
  phone: string;
  phoneAlt: string;
  address: string;
  mapLink: string;
  founded: number;
  ceo: string;
  stats: Stat[];
  offices: Office[];
  socials: SocialLink[];
};

export const company: Company = {
  name: "Maisam Steel Mill",
  shortName: "MSM",
  tagline: "We're the future of the metallurgy industry",
  description:
    "Maisam Steel Mill is Afghanistan's first ISO-certified steel manufacturer. Since 2009 we have produced rebar, angles and T-bars to international standards from our plant in Pol-e-Charkhi, Kabul.",
  email: "info@maisamsteel.com",
  emailAlt: "maisamsteelmill@gmail.com",
  phone: "+93 799 65 94 50",
  phoneAlt: "+93 777 20 20 00",
  address: "Pol-e-Charkhi Industrial Park, New Bagram Road, Kabul-1001, Afghanistan",
  mapLink: "https://maps.app.goo.gl/NwVEWUSrWwDvt6EB7",
  founded: 2009,
  ceo: "Shafiq Ahmad Khwajazada",
  stats: [
    { label: "Years of experience", value: 15, suffix: "+" },
    { label: "Metric tons produced daily", value: 336, suffix: "+" },
    { label: "People employed", value: 500, suffix: "+" },
    { label: "Provinces supplied", value: 34, suffix: "" },
  ],
  // Operational footprint. Afghanistan production + the trading/representative
  // offices expanding the group across the region.
  offices: [
    {
      city: "Kabul",
      country: "Afghanistan",
      role: "Head office & steel mill",
      detail: "Pol-e-Charkhi Industrial Park, New Bagram Road — production, casting and rolling.",
      status: "operating",
    },
    {
      city: "Nationwide",
      country: "Afghanistan",
      role: "Distribution network",
      detail: "Supplied across all 34 provinces through regional distribution zones.",
      status: "operating",
    },
    {
      city: "Dubai",
      country: "UAE",
      role: "Free-zone trading office",
      detail: "Regional trading and procurement hub for international supply.",
      status: "expanding",
    },
    {
      city: "Istanbul",
      country: "Türkiye",
      role: "Representative office",
      detail: "Partnerships, sourcing and access to European markets.",
      status: "expanding",
    },
  ],
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/maisamsteel", icon: "Facebook" },
    { label: "Instagram", href: "https://www.instagram.com/maisamsteel", icon: "Instagram" },
    { label: "YouTube", href: "https://www.youtube.com/@maisamsteelmill1979", icon: "Youtube" },
  ],
};
