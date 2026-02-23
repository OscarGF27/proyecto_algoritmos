import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roles";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await requireRole(["ADMIN"] as any);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const rate = await prisma.rate.update({ where: { id: params.id }, data: await req.json() });
  await prisma.auditLog.create({ data: { actorUserId: (session.user as any).id, accion: "ACTUALIZAR_TARIFA", entidad: "Rate", entidadId: rate.id } });
  return NextResponse.json(rate);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await requireRole(["ADMIN"] as any);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  await prisma.rate.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
