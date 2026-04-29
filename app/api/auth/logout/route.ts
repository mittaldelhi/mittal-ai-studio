import { cookies } from "next/headers";
import { ok } from "@/lib/server/api";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("sb-access-token");
  cookieStore.delete("sb-refresh-token");

  return ok({ loggedOut: true });
}
