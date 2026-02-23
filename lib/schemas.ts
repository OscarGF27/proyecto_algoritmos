import { EstadoOrden, Rol, Servicio } from "@prisma/client";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const registerSchema = z.object({
  nombre: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  rol: z.nativeEnum(Rol).optional()
});

export const quoteSchema = z.object({
  origenCityId: z.string().min(1),
  destinoCityId: z.string().min(1),
  pesoKg: z.number().positive(),
  largoCm: z.number().positive(),
  anchoCm: z.number().positive(),
  altoCm: z.number().positive(),
  valorDeclarado: z.number().nonnegative(),
  valorContraentrega: z.number().nonnegative(),
  servicio: z.nativeEnum(Servicio)
});

export const orderSchema = quoteSchema.extend({
  datosRemitente: z.object({
    nombre: z.string(),
    telefono: z.string(),
    direccion: z.string()
  }),
  datosDestinatario: z.object({
    nombre: z.string(),
    telefono: z.string(),
    direccion: z.string()
  }),
  contenido: z.string().min(2),
  observaciones: z.string().optional()
});

export const orderEventSchema = z.object({
  estado: z.nativeEnum(EstadoOrden),
  nota: z.string().optional()
});
