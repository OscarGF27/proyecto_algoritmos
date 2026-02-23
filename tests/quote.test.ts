import { describe, expect, it } from "vitest";
import { calcularCotizacion, calcularPesoFacturable } from "@/lib/quote";

describe("motor de cotización", () => {
  it("calcula peso volumétrico correctamente", () => {
    const res = calcularPesoFacturable(1, 50, 30, 20);
    expect(res.pesoVolumetrico).toBe(6);
    expect(res.pesoFacturable).toBe(6);
  });

  it("usa peso real si es mayor", () => {
    const res = calcularPesoFacturable(10, 20, 20, 20);
    expect(res.pesoFacturable).toBe(10);
  });

  it("calcula desglose con comisión sobre flete", () => {
    const res = calcularCotizacion(10000, 3000, 2, 100000, 120000, {
      seguroPorcentaje: 0.01,
      seguroMinimo: 3000,
      recaudoPorcentaje: 0.01,
      recaudoFijo: 2000,
      comisionPorcentaje: 0.05,
      comisionSobre: "FLETE"
    });
    expect(res.flete).toBe(16000);
    expect(res.seguro).toBe(3000);
    expect(res.recaudo).toBe(3200);
    expect(res.comision).toBe(800);
    expect(res.total).toBe(23000);
  });

  it("calcula comisión sobre total", () => {
    const res = calcularCotizacion(8000, 2000, 1, 200000, 50000, {
      seguroPorcentaje: 0.01,
      seguroMinimo: 1000,
      recaudoPorcentaje: 0.02,
      recaudoFijo: 1000,
      comisionPorcentaje: 0.1,
      comisionSobre: "TOTAL"
    });
    expect(res.total).toBeGreaterThan(res.flete);
    expect(res.comision).toBe((res.flete + res.seguro + res.recaudo) * 0.1);
  });

  it("aplica seguro mínimo", () => {
    const res = calcularCotizacion(10000, 0, 1, 10000, 0, {
      seguroPorcentaje: 0.01,
      seguroMinimo: 3000,
      recaudoPorcentaje: 0,
      recaudoFijo: 0,
      comisionPorcentaje: 0,
      comisionSobre: "FLETE"
    });
    expect(res.seguro).toBe(3000);
  });
});
