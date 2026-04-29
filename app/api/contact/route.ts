import { fail, ok, readString } from "@/lib/server/api";
import { getAccessTokenFromRequest, getSupabaseUser, isSupabaseConfigured, supabaseRest } from "@/lib/server/supabase-rest";

const localLeads: Array<Record<string, string>> = [];

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const lead = {
    name: readString(body?.name),
    business: readString(body?.business),
    phone: readString(body?.phone),
    message: readString(body?.message),
  };

  if (!lead.name || !lead.business || !lead.phone || !lead.message) {
    return fail("Please complete all enquiry fields.", 422);
  }

  if (!isSupabaseConfigured()) {
    localLeads.push({ ...lead, created_at: new Date().toISOString() });
    return ok({ leadId: `local-${localLeads.length}`, mode: "local" });
  }

  const user = await getSupabaseUser(getAccessTokenFromRequest(request));
  const rows = await supabaseRest<Array<{ id: string }>>("/rest/v1/enquiries", {
    method: "POST",
    service: true,
    prefer: "return=representation",
    body: {
      ...lead,
      user_id: user?.id || null,
      status: "new",
    },
  });

  await supabaseRest("/rest/v1/analytics_events", {
    method: "POST",
    service: true,
    body: {
      user_id: user?.id || null,
      event_name: "enquiry_created",
      metadata: lead,
    },
  });

  return ok({ leadId: rows[0]?.id });
}
