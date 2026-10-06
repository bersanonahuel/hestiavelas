import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_USER = "Malena";
const ADMIN_PASS = "JOAQUINNOMEDEJES";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (
      username?.trim() === ADMIN_USER &&
      password === ADMIN_PASS
    ) {
      const cookieStore = await cookies();
      cookieStore.set("hestia_admin_auth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 días
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Usuario o contraseña incorrectos" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
