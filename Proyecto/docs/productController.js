const repo = require('../repositories/productRepository');
const cache = require('../services/cacheService');
const { problem } = require('../middlewares/problem');
const PREFIX = 'productos:';

function validate(body, partial = false) {
  const errors = [];
  if (!partial || body.nombre !== undefined) {
    if (typeof body.nombre !== 'string' || !body.nombre.trim()) errors.push({ field: 'nombre', message: 'Debe ser una cadena no vacía.' });
    else if (body.nombre.trim().length > 150) errors.push({ field: 'nombre', message: 'Máximo 150 caracteres.' });
  }
  if (!partial || body.precio !== undefined) {
    if (typeof body.precio !== 'number' || !Number.isFinite(body.precio) || body.precio <= 0) errors.push({ field: 'precio', message: 'Debe ser un número mayor que cero.' });
  }
  if (body.descripcion !== undefined && body.descripcion !== null && typeof body.descripcion !== 'string') errors.push({ field: 'descripcion', message: 'Debe ser texto o null.' });
  if (body.stock !== undefined && (!Number.isInteger(body.stock) || body.stock < 0)) errors.push({ field: 'stock', message: 'Debe ser un entero mayor o igual a cero.' });
  if (body.categoria_id !== undefined && body.categoria_id !== null && (!Number.isInteger(Number(body.categoria_id)) || Number(body.categoria_id) < 1)) errors.push({ field: 'categoria_id', message: 'Debe ser un ID entero positivo o null.' });
  if (body.estado !== undefined && typeof body.estado !== 'boolean' && body.estado !== 0 && body.estado !== 1) errors.push({ field: 'estado', message: 'Debe ser booleano.' });
  return errors;
}
async function list(req, res, next) {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const estado = req.query.estado;
    const categoriaId = req.query.categoria_id;
    const key = `${PREFIX}list:${JSON.stringify({ q, estado, categoriaId })}`;
    let data = cache.get(key); let cacheHit = true;
    if (!data) { data = await repo.list({ q, estado, categoriaId }); cache.set(key, data); cacheHit = false; }
    res.set('X-Cache', cacheHit ? 'HIT' : 'MISS');
    return res.json({ data, meta: { count: data.length, cached: cacheHit } });
  } catch (err) { next(err); }
}
async function getById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return problem(res, 400, 'ID inválido', 'El ID debe ser un entero positivo.', req.originalUrl);
    const key = `${PREFIX}id:${id}`; let data = cache.get(key); let hit = true;
    if (!data) { data = await repo.findById(id); if (data) cache.set(key, data); hit = false; }
    if (!data) return problem(res, 404, 'Producto no encontrado', `No existe un producto con ID ${id}.`, req.originalUrl);
    res.set('X-Cache', hit ? 'HIT' : 'MISS'); return res.json({ data });
  } catch (err) { next(err); }
}
async function create(req, res, next) {
  try {
    const errors = validate(req.body || {});
    if (errors.length) return problem(res, 400, 'Validación fallida', 'Revise los campos enviados.', req.originalUrl, { errors });
    const data = await repo.create(req.body); cache.invalidatePrefix(PREFIX);
    return res.status(201).location(`/api/v1/productos/${data.id}`).json({ data, message: 'Producto creado correctamente.' });
  } catch (err) { next(err); }
}
async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return problem(res, 400, 'ID inválido', 'El ID debe ser un entero positivo.', req.originalUrl);
    const errors = validate(req.body || {}, true);
    if (errors.length) return problem(res, 400, 'Validación fallida', 'Revise los campos enviados.', req.originalUrl, { errors });
    const data = await repo.update(id, req.body);
    if (!data) return problem(res, 404, 'Producto no encontrado', `No existe un producto con ID ${id}.`, req.originalUrl);
    cache.invalidatePrefix(PREFIX); return res.json({ data, message: 'Producto actualizado correctamente.' });
  } catch (err) { next(err); }
}
async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return problem(res, 400, 'ID inválido', 'El ID debe ser un entero positivo.', req.originalUrl);
    const removed = await repo.remove(id);
    if (!removed) return problem(res, 404, 'Producto no encontrado', `No existe un producto con ID ${id}.`, req.originalUrl);
    cache.invalidatePrefix(PREFIX); return res.status(204).send();
  } catch (err) { next(err); }
}
module.exports = { list, getById, create, update, remove };
