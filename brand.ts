export const brand = {
  name: "GROYOU",
  tagline: "Grow Smarter. Scale Faster.",
  color: "#00FF88",
  whatsapp: {
    number: "+91 86670038564",
    link: "https://wa.me/9186670038564",
    message:
      "Hi GROYOU, I'd like to explore growth services. Please share details so your team can prepare a custom strategy.",
  },
};

export type Founder = {
  name: string;
  designation: string;
  experience: string;
  specializations: string[];
  portfolio?: string;
  gradient: string;
  accent: string;
};

export const founders: Founder[] = [
  {
    name: "Surajith Thangavel",
    designation: "Founder & CEO",
    experience: "6+ Years Experience in Digital Marketing",
    specializations: [
      "Performance Marketing",
      "SEO Strategy",
      "Growth Marketing",
      "Brand Building",
    ],
    portfolio: "https://sujithjai.github.io/PORTFOLIO/",
    gradient: "linear-gradient(135deg, #00ff88 0%, #00a55f 100%)",
    accent: "#00ff88",
  },
  {
    name: "Vetrivel",
    designation: "Co-Founder & COO",
    experience: "3+ Years Experience in Digital Marketing",
    specializations: [
      "Operations Management",
      "Campaign Execution",
      "Client Success",
      "Business Operations",
    ],
    gradient: "linear-gradient(135deg, #00ff88 0%, #191919 100%)",
    accent: "#a7ffd1",
  },
];

export const founderStory = {
  title: "The Story Behind GROYOU",
  content:
    "GROYOU was founded with a simple mission: helping businesses grow through data-driven digital marketing and innovative growth strategies. With a combined experience of over 9 years in the digital marketing industry, Surajith Thangavel and Vetrivel built GROYOU to deliver measurable results, scalable systems, and long-term brand growth. From startups to established businesses, our goal is to transform brands into industry leaders through creativity, technology, and performance-focused marketing.",
};

export const pricingPlans = [
  {
    name: "Starter",
    price: "₹79,999",
    cadence: "per month",
    tagline: "Build visibility and capture demand with a focused growth package.",
    features: [
      "Google Ads or Meta Ads setup",
      "Landing page optimisation",
      "Core SEO fixes",
      "Weekly reporting dashboards",
      "Conversion tracking setup",
      "Monthly strategy review",
    ],
    highlight: false,
  },
  {
    name: "Growth",
    price: "₹1,89,999",
    cadence: "per month",
    tagline: "A complete growth engine for ambitious brands that need pipeline clarity.",
    features: [
      "Multi-channel paid media",
      "Full technical + local SEO",
      "Custom landing page builds",
      "Brand & content system",
      "WhatsApp & email automation",
      "CRM integration & lead scoring",
      "Bi-weekly CRO sprints",
      "Dedicated growth strategist",
    ],
    highlight: true,
  },
  {
    name: "Scale",
    price: "Custom",
    cadence: "tailored to business",
    tagline: "A growth OS for category leaders that need compounding returns.",
    features: [
      "End-to-end growth OS",
      "Channel expansion + ABM",
      "Market & competitive analysis",
      "Premium branding & visual systems",
      "Advanced attribution + MMM",
      "Executive-level reporting",
      "Quarterly strategy sprints",
      "Priority response SLA",
    ],
    highlight: false,
  },
];

export const caseStudiesV2 = [
  {
    company: "Sparrow Wellness",
    industry: "Healthcare",
    before: { leads: 42, cpl: 1240, roas: 1.6, revenue: "₹6.1L" },
    after: { leads: 198, cpl: 420, roas: 4.9, revenue: "₹22.3L" },
    summary:
      "Rebuilt funnel, improved lead scoring and tightened creative → lifted qualified pipeline 371% in 90 days.",
  },
  {
    company: "Axis Living",
    industry: "Real Estate",
    before: { leads: 58, cpl: 2450, roas: 1.2, revenue: "₹9.8L" },
    after: { leads: 246, cpl: 960, roas: 4.1, revenue: "₹31.5L" },
    summary:
      "Project-specific landing pages + geofenced demand capture → 4x revenue growth and cleaner quality signals.",
  },
  {
    company: "Nova Learning",
    industry: "Education",
    before: { leads: 120, cpl: 680, roas: 2.1, revenue: "₹12.4L" },
    after: { leads: 512, cpl: 290, roas: 5.8, revenue: "₹41.9L" },
    summary:
      "Introduced search dominance, remarketing stacks and counsellor automation → 238% enrolment lift.",
  },
];

export const partnerBadges = [
  "Google Partner",
  "Meta Business Partner",
  "LinkedIn Marketing Solutions",
  "Shopify Expert",
  "HubSpot Solutions Partner",
  "Zoho Certified",
];

export const clientLogosPremium = [
  "SPARROW",
  "AXIS",
  "NOVA",
  "MERIDIAN",
  "HELIOS",
  "ZENITH",
  "VERTEX",
  "ATLAS",
];

export const reviews = [
  { author: "Deepa Menon", company: "Sparrow Wellness", stars: 5, text: "GROYOU redesigned our lead quality system completely. Revenue is now trackable and predictable." },
  { author: "Karthik Ravi", company: "Axis Living", stars: 5, text: "Finally an agency that treats marketing like a growth system, not a cost centre." },
  { author: "Ananya Shah", company: "Nova Learning", stars: 5, text: "The automation layer saved our counsellors hours every week and gave us clarity on every channel." },
];
