import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roles";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await requireRole(["ADMIN"] as any);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const user = await prisma.user.update({ where: { id: params.id }, data: await req.json() });
  return NextResponse.json({ id: user.id, nombre: user.nombre, email: user.email, rol: user.rol });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await requireRole(["ADMIN"] as any);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
