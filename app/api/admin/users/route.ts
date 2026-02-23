import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roles";

export async function GET() {
  const session = await requireRole(["ADMIN"] as any);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const users = await prisma.user.findMany({ select: { id: true, nombre: true, email: true, rol: true, createdAt: true } });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const session = await requireRole(["ADMIN"] as any);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const data = await req.json();
  const user = await prisma.user.create({ data: { ...data, hash: await bcrypt.hash(data.password, 10) } });
  return NextResponse.json({ id: user.id, nombre: user.nombre, email: user.email, rol: user.rol }, { status: 201 });
}
