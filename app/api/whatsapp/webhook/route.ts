import { fail, ok, readString } from "@/lib/server/api";
import { supabaseRest } from "@/lib/server/supabase-rest";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN && challenge) {
    return new Response(challenge, { status: 200 });
  }

  return fail("WhatsApp verification failed.", 403);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const entries = Array.isArray(body?.entry) ? body.entry : [];

  for (const entry of entries) {
    const changes = typeof entry === "object" && entry && "changes" in entry && Array.isArray(entry.changes) ? entry.changes : [];

    for (const change of changes) {
      const value = typeof change === "object" && change && "value" in change ? (change.value as Record<string, unknown>) : {};
      const messages = Array.isArray(value.messages) ? value.messages : [];

      for (const message of messages) {
        const messageObject = message as Record<string, unknown>;
        const from = readString(messageObject.from);
        const textBody =
          typeof messageObject.text === "object" && messageObject.text
            ? readString((messageObject.text as Record<string, unknown>).body)
            : "";

        if (!from || !textBody) {
          continue;
        }

        await supabaseRest("/rest/v1/whatsapp_conversations", {
          method: "POST",
          service: true,
          body: {
            phone: from,
            last_message: textBody,
            raw_payload: messageObject,
            status: "open",
          },
        });

        await supabaseRest("/rest/v1/enquiries", {
          method: "POST",
          service: true,
          body: {
            name: "WhatsApp Lead",
            business: "WhatsApp",
            phone: from,
            message: textBody,
            status: "new",
          },
        });
      }
    }
  }

  return ok({ received: true });
}
