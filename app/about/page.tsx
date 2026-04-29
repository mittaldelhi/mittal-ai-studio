import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { AboutPage } from "@/components/sections/LandingPage";
import { getFounderProfile } from "@/lib/server/portfolio";

export default async function AboutRoute() {
  const founder = await getFounderProfile();

  return (
    <>
      <Navbar />
      <AboutPage founder={founder} />
      <Footer />
    </>
  );
}
