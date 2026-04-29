import { NextResponse } from "next/server";
import { fail } from "@/lib/server/api";
import { getPlanByName } from "@/lib/server/plans";
import { requireCurrentUser, supabaseRest } from "@/lib/server/supabase-rest";

type OrderBody = {
  planName?: unknown;
  amount?: unknown;
};

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const user = await requireCurrentUser().catch(() => null);

  if (!user) {
    return fail("Please login with Google before buying a plan.", 401);
  }

  let body: OrderBody;

  try {
    body = (await request.json()) as OrderBody;
  } catch {
    return NextResponse.json({ success: false, data: null, error: "Invalid JSON body." }, { status: 400 });
  }

  const planName = readString(body.planName);
  const requestedAmount = typeof body.amount === "number" ? body.amount : 0;
  const plan = await getPlanByName(planName);

  if (!plan?.yearly || requestedAmount !== plan.yearly) {
    return NextResponse.json({ success: false, data: null, error: "Invalid pricing plan." }, { status: 422 });
  }

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: "Razorpay keys are missing. Add NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
      },
      { status: 500 },
    );
  }

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: plan.yearly * 100,
      currency: "INR",
      receipt: `${plan.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      notes: {
        plan: plan.name,
        billing: "yearly",
      },
    }),
  });

  const razorpayOrder = (await response.json()) as { id?: string; amount?: number; currency?: string; error?: unknown };

  if (!response.ok || !razorpayOrder.id || !razorpayOrder.amount || !razorpayOrder.currency) {
    return NextResponse.json(
      { success: false, data: null, error: "Razorpay order could not be created." },
      { status: 502 },
    );
  }

  await supabaseRest("/rest/v1/orders", {
    method: "POST",
    service: true,
    body: {
      user_id: user.id,
      plan_name: plan.name,
      amount: plan.yearly,
      currency: "INR",
      razorpay_order_id: razorpayOrder.id,
      status: "created",
    },
  });

  return NextResponse.json({
    success: true,
    data: {
      keyId,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    },
    error: null,
  });
}
