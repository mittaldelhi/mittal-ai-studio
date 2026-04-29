import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PortfolioPage } from "@/components/sections/LandingPage";
import { getPublicPortfolioProjects } from "@/lib/server/portfolio";

export default async function PortfolioRoute() {
  const projects = await getPublicPortfolioProjects();

  return (
    <>
      <Navbar />
      <PortfolioPage projects={projects} />
      <Footer />
    </>
  );
}
