import { EstadoOrden } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orderSchema } from "@/lib/schemas";
import { requireRole } from "@/lib/roles";
import { calcularCotizacion, calcularPesoFacturable } from "@/lib/quote";

export async function GET(req: Request) {
  const session = await requireRole(["ADMIN", "OPERADOR", "CLIENTE"] as any);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const estado = searchParams.get("estado") as EstadoOrden | null;
  const where: any = {};

  if ((session.user as any).role === "CLIENTE") where.userId = (session.user as any).id;
  if (estado) where.estado = estado;

  const orders = await prisma.order.findMany({ where, include: { eventos: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const session = await requireRole(["ADMIN", "OPERADOR", "CLIENTE"] as any);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  try {
    const data = orderSchema.parse(await req.json());
    const [origen, destino] = await Promise.all([
      prisma.city.findUnique({ where: { id: data.origenCityId } }),
      prisma.city.findUnique({ where: { id: data.destinoCityId } })
    ]);
    if (!origen || !destino) return NextResponse.json({ error: "Ciudad inválida" }, { status: 400 });

    const rate = await prisma.rate.findFirst({
      where: {
        zonaOrigen: origen.zona,
        zonaDestino: destino.zona,
        servicio: data.servicio,
        pesoMin: { lte: data.pesoKg },
        pesoMax: { gte: data.pesoKg }
      }
    });

    if (!rate) return NextResponse.json({ error: "Tarifa no encontrada" }, { status: 404 });
    const reglas = (await prisma.configRegla.findFirst())!;

    const { pesoVolumetrico, pesoFacturable } = calcularPesoFacturable(data.pesoKg, data.largoCm, data.anchoCm, data.altoCm);
    const desglose = calcularCotizacion(rate.precioBase, rate.precioPorKg, pesoFacturable, data.valorDeclarado, data.valorContraentrega, {
      seguroPorcentaje: reglas.seguroPorcentaje,
      seguroMinimo: reglas.seguroMinimo,
      recaudoPorcentaje: reglas.recaudoPorcentaje,
      recaudoFijo: reglas.recaudoFijo,
      comisionPorcentaje: reglas.comisionPorcentaje,
      comisionSobre: reglas.comisionSobre as "FLETE" | "TOTAL"
    });

    const orden = await prisma.order.create({
      data: {
        codigo: `CY-${Date.now()}`,
        userId: (session.user as any).id,
        origenCityId: data.origenCityId,
        destinoCityId: data.destinoCityId,
        datosRemitente: data.datosRemitente,
        datosDestinatario: { ...data.datosDestinatario, contenido: data.contenido, observaciones: data.observaciones ?? "" },
        pesoReal: data.pesoKg,
        pesoVolumetrico,
        valorDeclarado: data.valorDeclarado,
        valorContraentrega: data.valorContraentrega,
        servicio: data.servicio,
        totalEstimado: desglose.total,
        estado: "CREADA",
        eventos: {
          create: {
            estado: "CREADA",
            nota: "Orden creada",
            actorUserId: (session.user as any).id
          }
        }
      },
      include: { eventos: true }
    });

    return NextResponse.json(orden, { status: 201 });
  } catch (error) {
    console.error("order_create_error", error);
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }
}
