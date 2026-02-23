import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/schemas";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "local";
    const rate = checkRateLimit(ip);
    if (!rate.ok) {
      return NextResponse.json({ error: "Demasiados intentos" }, { status: 429 });
    }

    const parsed = loginSchema.parse(await req.json());
    const user = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (!user) return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });

    const ok = await bcrypt.compare(parsed.password, user.hash);
    if (!ok) return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });

    return NextResponse.json({ id: user.id, nombre: user.nombre, email: user.email, rol: user.rol });
  } catch (error) {
    console.error("login_error", error);
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }
}
