export type Testimonial = {
  quote: string;
  name: string;
  location: string;
  image: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "We've specified MSM rebar on every major pour for three years. The consistency batch to batch is what keeps us coming back — schedules don't slip waiting on certified steel.",
    name: "Karim Zahir",
    location: "Construction firm, Kabul",
    image: "/images/testimonials/client-1.jpg",
  },
  {
    quote:
      "Having a certified mill inside the country changed how we plan projects. Lead times are shorter and the test certificates make sign-off straightforward.",
    name: "Rashid Daud",
    location: "Infrastructure contractor, Herat",
    image: "/images/testimonials/client-2.jpg",
  },
  {
    quote:
      "Procurement is simpler when the quality is dependable. MSM angles and T-bars arrive to spec, every order — that reliability is rare and valuable.",
    name: "Nadia Barakzai",
    location: "Procurement lead, Mazar-i-Sharif",
    image: "/images/testimonials/client-3.jpg",
  },
];
