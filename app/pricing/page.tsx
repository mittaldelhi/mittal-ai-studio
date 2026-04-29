import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PricingPage } from "@/components/sections/LandingPage";
import { getPublicPlans } from "@/lib/server/plans";

export default async function PricingRoute() {
  const plans = await getPublicPlans();

  return (
    <>
      <Navbar />
      <PricingPage plans={plans} />
      <Footer />
    </>
  );
}
