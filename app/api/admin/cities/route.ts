import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roles";

export async function GET() {
  const session = await requireRole(["ADMIN", "OPERADOR"] as any);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  return NextResponse.json(await prisma.city.findMany({ orderBy: { nombre: "asc" } }));
}

export async function POST(req: Request) {
  const session = await requireRole(["ADMIN"] as any);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const data = await req.json();
  const city = await prisma.city.create({ data });
  return NextResponse.json(city, { status: 201 });
}
