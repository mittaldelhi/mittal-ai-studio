import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { LandingPage } from "@/components/sections/LandingPage";
import { businessInfo } from "@/lib/constants/site";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: businessInfo.name,
  description: "AI-powered websites, chatbots, automations, and local SEO for businesses in Rajasthan.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Ashadeep Ananta Jagat, Alwar byepass Road",
    addressLocality: "Bhiwadi",
    addressRegion: "Rajasthan",
    postalCode: "301019",
    addressCountry: "IN",
  },
  email: businessInfo.email,
  telephone: businessInfo.phone,
  areaServed: ["Bhiwadi", "Alwar", "Jaipur", "Rajasthan", "India"],
  url: "https://mittalai.studio",
  sameAs: [businessInfo.whatsappUrl],
  priceRange: "Rs. 4,999 - Rs. 19,999 per year",
  serviceType: ["AI Website Development", "Google Business Optimization", "AI Chatbots", "WhatsApp Automation"],
};

export default async function Home() {
  return (
    <>
      <Navbar />
      <LandingPage />
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
    </>
  );
}
