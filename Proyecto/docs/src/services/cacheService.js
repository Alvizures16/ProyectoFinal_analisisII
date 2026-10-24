// Caché en memoria con TTL (Cache-Aside). En una sola instancia sirve para la demo académica.
const cache = new Map();
const DEFAULT_TTL_MS = 30_000;

function get(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() >= item.expiresAt) { cache.delete(key); return null; }
  return item.value;
}
function set(key, value, ttlMs = DEFAULT_TTL_MS) {
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
}
function invalidatePrefix(prefix) {
  for (const key of cache.keys()) if (key.startsWith(prefix)) cache.delete(key);
}
function clear() { cache.clear(); }
module.exports = { get, set, invalidatePrefix, clear };
