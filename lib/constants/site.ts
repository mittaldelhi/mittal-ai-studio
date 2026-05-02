export type Service = {
  slug: string;
  title: string;
  description: string;
  outcome: string;
  imageUrl?: string | null;
};

export type PortfolioProject = {
  title: string;
  clientName?: string;
  category: string;
  city: string;
  liveUrl?: string;
  result: string;
  description: string;
  tags: string[];
  servicesDelivered?: string[];
  imageUrl?: string | null;
  featured?: boolean;
};

export type PricingPlan = {
  name: string;
  yearly: number | null;
  note: string;
  featured?: boolean;
  features: string[];
};

export const navItems = ["Work", "Services", "Process", "Pricing", "Contact"];

export const businessInfo = {
  name: "Mittal AI Studio",
  address: "Ashadeep Ananta Jagat, Alwar byepass Road, Bhiwadi, Rajasthan - 301019",
  email: "Contact@mittalaistudio.com",
  phone: "+919999081105",
  whatsappUrl:
    "https://wa.me/919999081105?text=Hi%20Mittal%20AI%20Studio%2C%20I%20want%20to%20book%20a%20free%20AI%20business%20audit.",
};

export const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/mittalaistudio",
    short: "Fb",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@mittalaistudio",
    short: "Yt",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/mittalaistudio",
    short: "Ig",
  },
];

export const stats = [
  { value: "50+", label: "Local brands served" },
  { value: "3x", label: "Average enquiry growth" },
  { value: "48hr", label: "Launch-ready first cut" },
  { value: "5-star", label: "Client experience" },
];

export const audiences = [
  { type: "Restaurants", hook: "Get 3x more table bookings" },
  { type: "Clinics", hook: "Free up your receptionist with AI" },
  { type: "Coaching Centers", hook: "Go fully digital in 3 weeks" },
  { type: "Real Estate", hook: "Convert more property enquiries" },
  { type: "Shopkeepers", hook: "Rank #1 on Google Maps" },
  { type: "Startups", hook: "Launch your digital presence" },
];

export const services: Service[] = [
  {
    slug: "website-dev",
    title: "AI Website Development",
    description: "Modern, fast websites built for conversions.",
    outcome: "Premium web presence with lead capture, SEO, analytics, and smooth mobile UX.",
    imageUrl: "/services/extracted/03-website-development.jpg",
  },
  {
    slug: "google-business",
    title: "Google Business Optimization",
    description: "Rank higher on Maps and local searches.",
    outcome: "Profile cleanup, photos, posts, reviews workflow, and location keyword strategy.",
    imageUrl: "/services/extracted/05-google-business-profile.jpg",
  },
  {
    slug: "ai-chatbot",
    title: "AI Chatbots",
    description: "24/7 customer support that never sleeps.",
    outcome: "Lead qualification, FAQs, bookings, and handoff to WhatsApp or your team.",
    imageUrl: "/services/extracted/04-ai-chatbot.jpg",
  },
  {
    slug: "mobile-app",
    title: "Mobile App Development",
    description: "Android and iOS apps for your business.",
    outcome: "Customer portals, ordering flows, loyalty programs, and admin dashboards.",
    imageUrl: "/services/extracted/09-ui-ux-design.jpg",
  },
  {
    slug: "ai-automation",
    title: "AI Automation",
    description: "Automate repetitive tasks with AI workflows.",
    outcome: "Follow-ups, reports, CRM updates, invoice reminders, and internal operations.",
    imageUrl: "/services/extracted/02-digital-success.jpg",
  },
  {
    slug: "whatsapp",
    title: "WhatsApp Automation",
    description: "Auto-replies, booking, and reminders on WhatsApp.",
    outcome: "Faster replies, less missed business, and cleaner customer communication.",
    imageUrl: "/services/extracted/06-whatsapp-automation.jpg",
  },
  {
    slug: "seo",
    title: "SEO and Local SEO",
    description: "Dominate search results in your city.",
    outcome: "Local landing pages, technical SEO, content, schema, and ranking reports.",
    imageUrl: "/services/extracted/07-digital-marketing.jpg",
  },
  {
    slug: "branding",
    title: "Branding and UI/UX Design",
    description: "Logos, color systems, and full brand kits.",
    outcome: "A polished identity that makes small businesses feel established and trusted.",
    imageUrl: "/services/extracted/09-ui-ux-design.jpg",
  },
  {
    slug: "dashboard",
    title: "Business Dashboards",
    description: "See enquiries, sales, and campaign ROI in one place.",
    outcome: "Owner-friendly dashboards for daily decisions without spreadsheet chaos.",
    imageUrl: "/services/extracted/08-lead-generation-crm.jpg",
  },
  {
    slug: "content",
    title: "AI Content Systems",
    description: "Social posts, offers, and local campaigns generated faster.",
    outcome: "Content calendars, offer copy, festival campaigns, and approval workflows.",
    imageUrl: "/services/extracted/07-digital-marketing.jpg",
  },
];

export const portfolio: PortfolioProject[] = [
  {
    title: "Deepak Mittal Portfolio",
    clientName: "Deepak Mittal",
    category: "Founder Portfolio",
    city: "India",
    liveUrl: "https://deepakmittal.vercel.app",
    result: "Founder-led personal brand",
    description:
      "Business technology consultant portfolio positioning 15 years of IBM and Concentrix process expertise for local business growth.",
    tags: ["Portfolio", "Personal Brand", "Consulting"],
    servicesDelivered: ["Portfolio website", "Founder positioning", "Service storytelling"],
    featured: true,
  },
  {
    title: "Chandra Mehndi Art",
    clientName: "Chandra Mehndi Art",
    category: "Mehndi Artist",
    city: "Gurgaon",
    liveUrl: "https://Chandramehndiart.vercel.app",
    result: "Premium booking-ready artist website",
    description: "Professional mehndi and henna artist website for bridal, Arabic, and contemporary designs.",
    tags: ["Website", "Local SEO", "Booking CTA"],
    servicesDelivered: ["Responsive website", "Service pages", "SEO metadata", "Schema markup"],
    featured: true,
  },
  {
    title: "Seema Rajput",
    clientName: "Seema Rajput",
    category: "Beautician and Model",
    city: "India",
    liveUrl: "https://seemarajput.vercel.app",
    result: "Elegant personal brand portfolio",
    description:
      "Personal brand website for a professional beautician and model offering bridal makeup, party makeup, photoshoot makeup, and brand modeling.",
    tags: ["Portfolio", "Beauty", "Personal Brand"],
    servicesDelivered: ["Responsive website", "Personal brand sections", "Service showcase", "SEO metadata"],
    featured: true,
  },
  {
    title: "AI Booking Assistant",
    clientName: "Learning Lab",
    category: "AI Automation",
    city: "Build in public",
    result: "Salon booking automation concept",
    description: "A conversational AI chatbot trained to handle appointment bookings for a local salon and reduce phone time.",
    tags: ["Next.js", "OpenAI", "Supabase"],
    servicesDelivered: ["AI chatbot", "Booking workflow", "Lead capture"],
  },
];

export const processSteps = [
  "Audit the business and local competition",
  "Map the highest-value digital workflow",
  "Design the brand, website, or automation system",
  "Build fast with weekly review checkpoints",
  "Launch with SEO, analytics, and conversion tracking",
  "Optimize monthly using real lead and revenue data",
];

export const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    yearly: 4999,
    note: "For shops, freelancers, and single-location businesses starting online.",
    features: ["1-page premium website", "Google Business cleanup", "Basic local SEO", "Lead form and WhatsApp CTA"],
  },
  {
    name: "Growth",
    yearly: 9999,
    note: "The best fit for growing businesses that need automation.",
    featured: true,
    features: ["5-page website", "WhatsApp automation", "Monthly SEO improvements", "Lead dashboard", "Offer campaign support"],
  },
  {
    name: "AI Premium",
    yearly: 19999,
    note: "For serious operators who want a complete AI-enabled growth system.",
    features: ["Custom AI chatbot", "Automation workflows", "Dashboard and CRM setup", "Content engine", "Priority support"],
  },
  {
    name: "Enterprise",
    yearly: null,
    note: "For multi-location clinics, restaurant groups, franchises, and larger teams.",
    features: ["Custom integrations", "Advanced reporting", "Team workflows", "Security review", "Dedicated roadmap"],
  },
];

export const testimonials = [
  {
    quote: "The website finally feels like our business is premium. Enquiries now come from Google and WhatsApp without us chasing people.",
    name: "Rohit Jain",
    role: "Restaurant Owner, Bhiwadi",
  },
  {
    quote: "Patients get answers and appointment reminders automatically. It saved real time for our reception desk.",
    name: "Dr. Neha Sharma",
    role: "Clinic Director, Alwar",
  },
  {
    quote: "They understood local business language, not just tech language. The dashboard made our follow-up process much cleaner.",
    name: "Amit Mittal",
    role: "Real Estate Consultant",
  },
];
