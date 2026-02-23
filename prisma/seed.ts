import { PrismaClient, Rol, Servicio } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashAdmin = await bcrypt.hash("Admin123*", 10);
  const hashOperador = await bcrypt.hash("Operador123*", 10);
  const hashCliente = await bcrypt.hash("Cliente123*", 10);

  const [admin, operador, cliente] = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@contraentregaya.co" },
      update: {},
      create: { nombre: "Admin Demo", email: "admin@contraentregaya.co", hash: hashAdmin, rol: Rol.ADMIN }
    }),
    prisma.user.upsert({
      where: { email: "operador@contraentregaya.co" },
      update: {},
      create: { nombre: "Operador Demo", email: "operador@contraentregaya.co", hash: hashOperador, rol: Rol.OPERADOR }
    }),
    prisma.user.upsert({
      where: { email: "cliente@contraentregaya.co" },
      update: {},
      create: { nombre: "Cliente Demo", email: "cliente@contraentregaya.co", hash: hashCliente, rol: Rol.CLIENTE }
    })
  ]);

  const ciudades = [
    { nombre: "Medellín", departamento: "Antioquia", zona: "CENTRO" },
    { nombre: "Bogotá", departamento: "Cundinamarca", zona: "CENTRO" },
    { nombre: "Cali", departamento: "Valle del Cauca", zona: "SUR" },
    { nombre: "Barranquilla", departamento: "Atlántico", zona: "NORTE" }
  ];

  for (const ciudad of ciudades) {
    await prisma.city.upsert({
      where: { id: `${ciudad.nombre}-${ciudad.departamento}`.toLowerCase().replace(/\s+/g, "-") },
      update: ciudad,
      create: {
        id: `${ciudad.nombre}-${ciudad.departamento}`.toLowerCase().replace(/\s+/g, "-"),
        ...ciudad
      }
    });
  }

  await prisma.rate.createMany({
    data: [
      { zonaOrigen: "CENTRO", zonaDestino: "CENTRO", servicio: Servicio.ESTANDAR, pesoMin: 0, pesoMax: 2, precioBase: 9000, precioPorKg: 3200, tiempoEstimadoDias: 1 },
      { zonaOrigen: "CENTRO", zonaDestino: "CENTRO", servicio: Servicio.EXPRESS, pesoMin: 0, pesoMax: 2, precioBase: 13000, precioPorKg: 4200, tiempoEstimadoDias: 1 },
      { zonaOrigen: "CENTRO", zonaDestino: "SUR", servicio: Servicio.ESTANDAR, pesoMin: 0, pesoMax: 5, precioBase: 12000, precioPorKg: 3600, tiempoEstimadoDias: 2 },
      { zonaOrigen: "CENTRO", zonaDestino: "SUR", servicio: Servicio.EXPRESS, pesoMin: 0, pesoMax: 5, precioBase: 17000, precioPorKg: 4700, tiempoEstimadoDias: 1 },
      { zonaOrigen: "CENTRO", zonaDestino: "NORTE", servicio: Servicio.ESTANDAR, pesoMin: 0, pesoMax: 5, precioBase: 14000, precioPorKg: 3900, tiempoEstimadoDias: 3 },
      { zonaOrigen: "CENTRO", zonaDestino: "NORTE", servicio: Servicio.EXPRESS, pesoMin: 0, pesoMax: 5, precioBase: 20000, precioPorKg: 5200, tiempoEstimadoDias: 2 },
      { zonaOrigen: "SUR", zonaDestino: "NORTE", servicio: Servicio.ESTANDAR, pesoMin: 0, pesoMax: 10, precioBase: 16000, precioPorKg: 4100, tiempoEstimadoDias: 3 },
      { zonaOrigen: "SUR", zonaDestino: "NORTE", servicio: Servicio.EXPRESS, pesoMin: 0, pesoMax: 10, precioBase: 22000, precioPorKg: 5400, tiempoEstimadoDias: 2 }
    ],
    skipDuplicates: true
  });

  const existeConfig = await prisma.configRegla.findFirst();
  if (!existeConfig) {
    await prisma.configRegla.create({
      data: {
        seguroPorcentaje: 0.01,
        seguroMinimo: 3000,
        recaudoPorcentaje: 0.015,
        recaudoFijo: 2000,
        comisionPorcentaje: 0.05,
        comisionSobre: "FLETE",
        actualizadoPorId: admin.id
      }
    });
  }

  console.log("Seed completado", { admin: admin.email, operador: operador.email, cliente: cliente.email });
}

main().finally(() => prisma.$disconnect());
