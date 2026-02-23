const intentos = new Map<string, { count: number; expires: number }>();

export function checkRateLimit(key: string, maxIntentos = 5, ventanaMs = 60000) {
  const ahora = Date.now();
  const entry = intentos.get(key);
  if (!entry || entry.expires < ahora) {
    intentos.set(key, { count: 1, expires: ahora + ventanaMs });
    return { ok: true };
  }
  if (entry.count >= maxIntentos) return { ok: false, retryInMs: entry.expires - ahora };
  entry.count += 1;
  return { ok: true };
}
