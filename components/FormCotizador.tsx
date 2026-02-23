"use client";

import { useState } from "react";

const ciudadDefault = "medellín-antioquia";

export function FormCotizador() {
  const [form, setForm] = useState({
    origenCityId: ciudadDefault,
    destinoCityId: "bogotá-cundinamarca",
    pesoKg: 2,
    largoCm: 20,
    anchoCm: 20,
    altoCm: 20,
    valorDeclarado: 100000,
    valorContraentrega: 120000,
    servicio: "ESTANDAR"
  });
  const [resultado, setResultado] = useState<any>(null);
  const [error, setError] = useState("");

  const cotizar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/quote", { method: "POST", body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Error de cotización");
    setResultado(data);
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <form onSubmit={cotizar} className="card space-y-2">
        <h1 className="text-xl font-semibold">Cotizador de envío</h1>
        <input className="w-full border rounded p-2" value={form.origenCityId} onChange={(e) => setForm({ ...form, origenCityId: e.target.value })} placeholder="ID ciudad origen" />
        <input className="w-full border rounded p-2" value={form.destinoCityId} onChange={(e) => setForm({ ...form, destinoCityId: e.target.value })} placeholder="ID ciudad destino" />
        <div className="grid grid-cols-2 gap-2">
          <input className="border rounded p-2" type="number" value={form.pesoKg} onChange={(e) => setForm({ ...form, pesoKg: Number(e.target.value) })} placeholder="Peso kg" />
          <input className="border rounded p-2" type="number" value={form.valorDeclarado} onChange={(e) => setForm({ ...form, valorDeclarado: Number(e.target.value) })} placeholder="Valor declarado" />
          <input className="border rounded p-2" type="number" value={form.largoCm} onChange={(e) => setForm({ ...form, largoCm: Number(e.target.value) })} placeholder="Largo" />
          <input className="border rounded p-2" type="number" value={form.anchoCm} onChange={(e) => setForm({ ...form, anchoCm: Number(e.target.value) })} placeholder="Ancho" />
          <input className="border rounded p-2" type="number" value={form.altoCm} onChange={(e) => setForm({ ...form, altoCm: Number(e.target.value) })} placeholder="Alto" />
          <input className="border rounded p-2" type="number" value={form.valorContraentrega} onChange={(e) => setForm({ ...form, valorContraentrega: Number(e.target.value) })} placeholder="Valor recaudo" />
        </div>
        <select className="w-full border rounded p-2" value={form.servicio} onChange={(e) => setForm({ ...form, servicio: e.target.value })}>
          <option value="ESTANDAR">Estándar</option>
          <option value="EXPRESS">Express</option>
        </select>
        <button className="px-4 py-2 rounded bg-primario text-white">Cotizar</button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>

      <div className="card">
        <h2 className="font-semibold mb-2">Resultado</h2>
        {resultado ? <pre className="text-xs overflow-auto">{JSON.stringify(resultado, null, 2)}</pre> : <p className="text-sm text-slate-500">Cotiza para ver desglose.</p>}
      </div>
    </div>
  );
}
