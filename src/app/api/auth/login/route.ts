import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_USER = process.env.ADMIN_USER || "Malena";
const ADMIN_PASS = process.env.ADMIN_PASSWORD;

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!ADMIN_PASS) {
      console.error("La variable de entorno ADMIN_PASSWORD no está configurada.");
      return NextResponse.json(
        { error: "El servidor no tiene configurada la contraseña de administrador en las variables de entorno." },
        { status: 500 }
      );
    }

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
