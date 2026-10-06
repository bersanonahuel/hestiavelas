import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("hestia_admin_auth");

  if (authCookie?.value === "true") {
    return NextResponse.json({ authenticated: true, user: "Malena" });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
