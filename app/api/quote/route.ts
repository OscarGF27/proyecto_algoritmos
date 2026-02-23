import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { quoteSchema } from "@/lib/schemas";
import { calcularCotizacion, calcularPesoFacturable } from "@/lib/quote";

export async function POST(req: Request) {
  try {
    const data = quoteSchema.parse(await req.json());
    const [origen, destino] = await Promise.all([
      prisma.city.findUnique({ where: { id: data.origenCityId } }),
      prisma.city.findUnique({ where: { id: data.destinoCityId } })
    ]);
    if (!origen || !destino) return NextResponse.json({ error: "Ciudad no válida" }, { status: 400 });

    const rate = await prisma.rate.findFirst({
      where: {
        zonaOrigen: origen.zona,
        zonaDestino: destino.zona,
        servicio: data.servicio,
        pesoMin: { lte: data.pesoKg },
        pesoMax: { gte: data.pesoKg }
      }
    });
    if (!rate) return NextResponse.json({ error: "No hay tarifa para esta ruta" }, { status: 404 });

    const reglas = (await prisma.configRegla.findFirst())!;
    const { pesoVolumetrico, pesoFacturable } = calcularPesoFacturable(data.pesoKg, data.largoCm, data.anchoCm, data.altoCm);
    const desglose = calcularCotizacion(
      rate.precioBase,
      rate.precioPorKg,
      pesoFacturable,
      data.valorDeclarado,
      data.valorContraentrega,
      {
        seguroPorcentaje: reglas.seguroPorcentaje,
        seguroMinimo: reglas.seguroMinimo,
        recaudoPorcentaje: reglas.recaudoPorcentaje,
        recaudoFijo: reglas.recaudoFijo,
        comisionPorcentaje: reglas.comisionPorcentaje,
        comisionSobre: reglas.comisionSobre as "FLETE" | "TOTAL"
      }
    );

    return NextResponse.json({
      tiempoEstimadoDias: rate.tiempoEstimadoDias,
      pesoVolumetrico,
      pesoFacturable,
      ...desglose
    });
  } catch (error) {
    console.error("quote_error", error);
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }
}
