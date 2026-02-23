import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="card text-center space-y-4">
        <h1 className="text-4xl font-bold">Contraentrega Ya</h1>
        <p className="text-slate-600">Pagos contraentrega y operación logística para e-commerce en Colombia.</p>
        <div className="flex justify-center gap-3">
          <Link className="px-4 py-2 rounded bg-primario text-white" href="/app/cotizador">Cotiza tu envío</Link>
          <Link className="px-4 py-2 rounded border" href="/auth/login">Ingresar</Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        {["Crea tu orden", "Recolectamos y entregamos", "Liquidamos tu recaudo"].map((paso, i) => (
          <div key={paso} className="card">
            <p className="text-sm text-slate-500">Paso {i + 1}</p>
            <h3 className="font-semibold">{paso}</h3>
          </div>
        ))}
      </section>

      <section className="card">
        <h2 className="text-2xl font-semibold mb-4">Preguntas frecuentes</h2>
        <ul className="space-y-3 text-sm">
          <li><b>¿Integran transportadoras reales?</b> No, usamos tarifas simuladas configurables.</li>
          <li><b>¿Cómo calculan el peso?</b> Tomamos el mayor entre peso real y volumétrico.</li>
          <li><b>¿Qué moneda maneja?</b> Pesos colombianos (COP).</li>
        </ul>
      </section>
    </div>
  );
}
