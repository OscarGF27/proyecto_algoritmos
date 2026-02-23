import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { Rol } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = registerSchema.parse(json);
    const existe = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (existe) return NextResponse.json({ error: "Email ya registrado" }, { status: 409 });

    const hash = await bcrypt.hash(parsed.password, 10);
    const user = await prisma.user.create({
      data: {
        nombre: parsed.nombre,
        email: parsed.email,
        hash,
        rol: parsed.rol ?? Rol.CLIENTE
      }
    });

    return NextResponse.json({ id: user.id, nombre: user.nombre, email: user.email, rol: user.rol }, { status: 201 });
  } catch (error) {
    console.error("register_error", error);
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }
}
