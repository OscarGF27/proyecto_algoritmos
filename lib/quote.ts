export type ReglaCotizacion = {
  seguroPorcentaje: number;
  seguroMinimo: number;
  recaudoPorcentaje: number;
  recaudoFijo: number;
  comisionPorcentaje: number;
  comisionSobre: "FLETE" | "TOTAL";
};

export function calcularPesoFacturable(pesoReal: number, largo: number, ancho: number, alto: number) {
  const pesoVolumetrico = (largo * ancho * alto) / 5000;
  return {
    pesoVolumetrico,
    pesoFacturable: Math.max(pesoReal, pesoVolumetrico)
  };
}

export function calcularCotizacion(
  fleteBase: number,
  precioPorKg: number,
  pesoFacturable: number,
  valorDeclarado: number,
  valorContraentrega: number,
  reglas: ReglaCotizacion
) {
  const flete = fleteBase + precioPorKg * pesoFacturable;
  const seguro = Math.max(valorDeclarado * reglas.seguroPorcentaje, reglas.seguroMinimo);
  const recaudo = valorContraentrega * reglas.recaudoPorcentaje + reglas.recaudoFijo;
  const subtotal = flete + seguro + recaudo;
  const comision = (reglas.comisionSobre === "FLETE" ? flete : subtotal) * reglas.comisionPorcentaje;
  const total = subtotal + comision;

  return { flete, seguro, recaudo, comision, total };
}
