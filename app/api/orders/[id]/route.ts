import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roles";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await requireRole(["ADMIN", "OPERADOR", "CLIENTE"] as any);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const orden = await prisma.order.findUnique({ where: { id: params.id }, include: { eventos: true } });
  if (!orden) return NextResponse.json({ error: "No encontrada" }, { status: 404 });

  if ((session.user as any).role === "CLIENTE" && orden.userId !== (session.user as any).id) {
    return NextResponse.json({ error: "Prohibido" }, { status: 403 });
  }

  return NextResponse.json(orden);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await requireRole(["ADMIN", "OPERADOR"] as any);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  await prisma.order.update({ where: { id: params.id }, data: { estado: "CANCELADA" } });
  return NextResponse.json({ ok: true });
}
