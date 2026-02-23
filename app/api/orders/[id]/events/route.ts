import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roles";
import { orderEventSchema } from "@/lib/schemas";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await requireRole(["ADMIN", "OPERADOR"] as any);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  try {
    const data = orderEventSchema.parse(await req.json());
    const evento = await prisma.orderEvent.create({
      data: {
        orderId: params.id,
        estado: data.estado,
        nota: data.nota,
        actorUserId: (session.user as any).id
      }
    });

    await prisma.order.update({ where: { id: params.id }, data: { estado: data.estado } });
    await prisma.auditLog.create({
      data: {
        actorUserId: (session.user as any).id,
        accion: "CAMBIO_ESTADO",
        entidad: "Order",
        entidadId: params.id,
        metadata: data
      }
    });

    return NextResponse.json(evento, { status: 201 });
  } catch (error) {
    console.error("event_error", error);
    return NextResponse.json({ error: "Evento inválido" }, { status: 400 });
  }
}
