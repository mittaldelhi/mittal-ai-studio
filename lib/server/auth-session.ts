import { cookies } from "next/headers";

export async function setAuthCookies(accessToken: string, refreshToken: string, expiresIn = 3600) {
  const cookieStore = await cookies();

  cookieStore.set("sb-access-token", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: expiresIn,
    path: "/",
  });

  if (refreshToken) {
    cookieStore.set("sb-refresh-token", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }
}
