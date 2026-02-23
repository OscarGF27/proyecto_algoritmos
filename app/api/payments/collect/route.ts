import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roles";

export async function POST(req: Request) {
  const session = await requireRole(["ADMIN", "OPERADOR"] as any);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const data = await req.json();
  const recaudo = await prisma.collection.create({ data: { ...data, fecha: new Date(data.fecha) } });
  return NextResponse.json(recaudo, { status: 201 });
}
