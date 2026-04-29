import crypto from "node:crypto";
import { fail, ok, readNumber, readString } from "@/lib/server/api";
import { getPlanByName } from "@/lib/server/plans";
import { requireCurrentUser, supabaseRest } from "@/lib/server/supabase-rest";
import type { Order } from "@/lib/types/platform";

export async function POST(request: Request) {
  const user = await requireCurrentUser().catch(() => null);

  if (!user) {
    return fail("Login required.", 401);
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const razorpayOrderId = readString(body?.razorpay_order_id);
  const razorpayPaymentId = readString(body?.razorpay_payment_id);
  const razorpaySignature = readString(body?.razorpay_signature);
  const planName = readString(body?.planName);
  const amount = readNumber(body?.amount);
  const plan = await getPlanByName(planName);
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret || !plan?.yearly || amount !== plan.yearly || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return fail("Invalid payment verification request.", 422);
  }

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (expected !== razorpaySignature) {
    return fail("Payment signature verification failed.", 401);
  }

  const order = (
    await supabaseRest<Order[]>("/rest/v1/orders", {
      service: true,
      query: { user_id: `eq.${user.id}`, razorpay_order_id: `eq.${razorpayOrderId}`, select: "*" },
    })
  )[0];

  if (order) {
    await supabaseRest("/rest/v1/orders", {
      method: "PATCH",
      service: true,
      query: { id: `eq.${order.id}` },
      body: { status: "paid" },
    });
  }

  await supabaseRest("/rest/v1/payments", {
    method: "POST",
    service: true,
    body: {
      user_id: user.id,
      order_id: order?.id || null,
      plan_name: plan.name,
      amount: plan.yearly,
      currency: "INR",
      razorpay_payment_id: razorpayPaymentId,
      razorpay_order_id: razorpayOrderId,
      status: "paid",
    },
  });

  return ok({ verified: true });
}
