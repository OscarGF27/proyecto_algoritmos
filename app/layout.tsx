import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "Contraentrega Ya",
  description: "Plataforma de pagos contraentrega y logística"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="border-b bg-white">
          <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link className="font-bold text-xl text-primario" href="/">
              Contraentrega Ya
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/app/cotizador">Cotizador</Link>
              <Link href="/auth/login">Ingresar</Link>
            </div>
          </nav>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
