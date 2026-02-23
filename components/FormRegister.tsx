"use client";

import { useState } from "react";

export function FormRegister() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !email.includes("@") || password.length < 8) {
      setMsg("Completa campos válidos");
      return;
    }
    const res = await fetch("/api/auth/register", { method: "POST", body: JSON.stringify({ nombre, email, password }) });
    const data = await res.json();
    setMsg(res.ok ? `Usuario creado: ${data.email}` : data.error);
  };

  return (
    <form className="card max-w-md space-y-3" onSubmit={submit}>
      <h1 className="text-xl font-semibold">Registro</h1>
      <input className="w-full border rounded p-2" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
      <input className="w-full border rounded p-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" />
      <input className="w-full border rounded p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
      <button className="px-4 py-2 rounded bg-primario text-white">Crear cuenta</button>
      {msg && <p className="text-sm">{msg}</p>}
    </form>
  );
}
