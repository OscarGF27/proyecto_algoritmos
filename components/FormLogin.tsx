"use client";

import { useState } from "react";

export function FormLogin() {
  const [email, setEmail] = useState("cliente@contraentregaya.co");
  const [password, setPassword] = useState("Cliente123*");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || password.length < 8) {
      setMsg("Valida tus datos");
      return;
    }
    const res = await fetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    const data = await res.json();
    setMsg(res.ok ? `Bienvenido ${data.nombre}` : data.error);
  };

  return (
    <form className="card max-w-md space-y-3" onSubmit={submit}>
      <h1 className="text-xl font-semibold">Ingresar</h1>
      <input className="w-full border rounded p-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" />
      <input className="w-full border rounded p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
      <button className="px-4 py-2 rounded bg-primario text-white">Entrar</button>
      {msg && <p className="text-sm">{msg}</p>}
    </form>
  );
}
