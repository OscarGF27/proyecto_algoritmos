import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roles";

export async function GET(req: Request) {
  const session = await requireRole(["ADMIN", "OPERADOR"] as any);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const from = new Date(searchParams.get("from") || "1970-01-01");
  const to = new Date(searchParams.get("to") || new Date().toISOString());

  const recaudos = await prisma.collection.findMany({ where: { fecha: { gte: from, lte: to } } });
  const config = (await prisma.configRegla.findFirst())!;
  const totalRecaudado = recaudos.reduce((acc, it) => acc + it.montoRecaudado, 0);
  const totalComisiones = totalRecaudado * config.comisionPorcentaje;
  const totalALiquidar = totalRecaudado - totalComisiones;

  return NextResponse.json({ from, to, totalRecaudado, totalComisiones, totalALiquidar, cantidad: recaudos.length });
}
