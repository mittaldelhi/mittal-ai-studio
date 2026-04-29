import { pricingPlans, type PricingPlan } from "@/lib/constants/site";
import { supabaseRest } from "@/lib/server/supabase-rest";

type PlanRow = {
  id: string;
  name: string;
  yearly: number | null;
  note: string | null;
  features: string[] | null;
  active: boolean;
  featured: boolean | null;
  sort_order: number | null;
};

function normalizeFeatures(value: unknown) {
  return Array.isArray(value) ? value.map((item) => String(item)).filter(Boolean) : [];
}

export async function getPublicPlans() {
  const rows = await supabaseRest<PlanRow[]>("/rest/v1/plans", {
    service: true,
    query: { active: "eq.true", select: "*", order: "sort_order.asc,name.asc" },
  }).catch(() => []);

  if (!rows.length) {
    return pricingPlans;
  }

  return rows.map((row) => ({
    name: row.name,
    yearly: row.yearly,
    note: row.note || pricingPlans.find((plan) => plan.name === row.name)?.note || "Yearly service plan.",
    featured: Boolean(row.featured),
    features: normalizeFeatures(row.features),
  })) satisfies PricingPlan[];
}

export async function getPlanByName(name: string) {
  const plans = await getPublicPlans();
  return plans.find((plan) => plan.name === name) || null;
}
