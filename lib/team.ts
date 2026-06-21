export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  socials: { label: string; href: string; icon: string }[];
};

export const team: TeamMember[] = [
  {
    slug: "shafiq-ahmad-khwajazada",
    name: "Shafiq Ahmad Khwajazada",
    role: "Founder & Chief Executive Officer",
    image: "/images/team/member-1.jpg",
    bio: "Shafiq founded Maisam Steel Mill in 2009 with a single belief: that Afghanistan deserves nothing less than the highest-quality materials for its infrastructure. Under his leadership, MSM became the nation's first ISO-certified steel manufacturer and a partner in its reconstruction.",
    socials: [
      { label: "LinkedIn", href: "#", icon: "Linkedin" },
      { label: "Email", href: "mailto:info@msm.af", icon: "Mail" },
    ],
  },
  {
    slug: "abdul-rahman",
    name: "Abdul Rahman",
    role: "Plant Director",
    image: "/images/team/member-2.jpg",
    bio: "Abdul oversees the melting, casting and rolling lines at Pol-e-Charkhi, keeping daily output consistent and on-spec. He has spent his career on the mill floor and knows every stage of the process by heart.",
    socials: [{ label: "LinkedIn", href: "#", icon: "Linkedin" }],
  },
  {
    slug: "mohammad-naseer",
    name: "Mohammad Naseer",
    role: "Head of Quality Assurance",
    image: "/images/team/member-3.jpg",
    bio: "Mohammad runs the in-house laboratory and the ISO 9001 quality system. Every batch passes through his team's tensile, dimensional and surface checks before it earns the MSM stamp.",
    socials: [{ label: "LinkedIn", href: "#", icon: "Linkedin" }],
  },
  {
    slug: "hamid-faizi",
    name: "Hamid Faizi",
    role: "Sales & Logistics Director",
    image: "/images/team/member-4.jpg",
    bio: "Hamid leads sales and distribution, coordinating delivery of certified steel to construction and infrastructure projects across nearly every province of Afghanistan.",
    socials: [
      { label: "LinkedIn", href: "#", icon: "Linkedin" },
      { label: "Email", href: "mailto:info@msm.af", icon: "Mail" },
    ],
  },
];
