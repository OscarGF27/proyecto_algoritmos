import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roles";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await requireRole(["ADMIN"] as any);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const city = await prisma.city.update({ where: { id: params.id }, data: await req.json() });
  return NextResponse.json(city);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await requireRole(["ADMIN"] as any);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  await prisma.city.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
