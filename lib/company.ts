export type Stat = { label: string; value: number; suffix: string };
export type SocialLink = { label: string; href: string; icon: string };

export type Company = {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  mapLink: string;
  founded: number;
  stats: Stat[];
  socials: SocialLink[];
};

export const company: Company = {
  name: "Maisam Steel Mill",
  shortName: "MSM",
  tagline: "We're the future of the metallurgy industry",
  description:
    "Maisam Steel Mill is Afghanistan's first ISO-certified steel manufacturer. Since 2009 we have produced rebar, angles and T-bars to international standards from our plant in Pol-e-Charkhi, Kabul.",
  email: "info@msm.af",
  phone: "+93 79 965 9450",
  address: "Pol-e-Charkhi Industrial Park, New Bagram Road, Kabul-1001, Afghanistan",
  mapLink: "https://maps.app.goo.gl/NwVEWUSrWwDvt6EB7",
  founded: 2009,
  stats: [
    { label: "Years of experience", value: 15, suffix: "+" },
    { label: "Metric tons produced daily", value: 336, suffix: "+" },
    { label: "People employed", value: 500, suffix: "+" },
    { label: "Provinces supplied", value: 34, suffix: "" },
  ],
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/maisamsteel", icon: "Facebook" },
    { label: "Instagram", href: "https://www.instagram.com/maisamsteel", icon: "Instagram" },
    { label: "YouTube", href: "https://www.youtube.com/@maisamsteelmill1979", icon: "Youtube" },
    { label: "LinkedIn", href: "#", icon: "Linkedin" },
  ],
};
