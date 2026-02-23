import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roles";

export async function GET() {
  const session = await requireRole(["ADMIN", "OPERADOR"] as any);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  return NextResponse.json(await prisma.rate.findMany({ orderBy: { createdAt: "desc" } }));
}

export async function POST(req: Request) {
  const session = await requireRole(["ADMIN"] as any);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const data = await req.json();
  const rate = await prisma.rate.create({ data });
  await prisma.auditLog.create({ data: { actorUserId: (session.user as any).id, accion: "CREAR_TARIFA", entidad: "Rate", entidadId: rate.id } });
  return NextResponse.json(rate, { status: 201 });
}
