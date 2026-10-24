const { pool } = require('../config/db');

const SELECT = `SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, p.categoria_id,
                       c.nombre AS categoria_nombre, p.estado, p.created_at, p.updated_at
                FROM productos p LEFT JOIN categorias c ON c.id = p.categoria_id`;

async function list({ q, estado, categoriaId }) {
  const where = []; const values = [];
  if (q) { where.push('(p.nombre LIKE ? OR p.descripcion LIKE ?)'); values.push(`%${q}%`, `%${q}%`); }
  if (estado !== undefined) { where.push('p.estado = ?'); values.push(estado === 'true' || estado === '1' ? 1 : 0); }
  if (categoriaId) { where.push('p.categoria_id = ?'); values.push(Number(categoriaId)); }
  const sql = `${SELECT}${where.length ? ` WHERE ${where.join(' AND ')}` : ''} ORDER BY p.id DESC LIMIT 100`;
  const [rows] = await pool.execute(sql, values);
  return rows;
}
async function findById(id) {
  const [rows] = await pool.execute(`${SELECT} WHERE p.id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}
async function create(data) {
  const [result] = await pool.execute(
    'INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, estado) VALUES (?, ?, ?, ?, ?, ?)',
    [data.nombre.trim(), data.descripcion || null, data.precio, data.stock ?? 0, data.categoria_id ?? null, data.estado === undefined ? 1 : (data.estado ? 1 : 0)]
  );
  return findById(result.insertId);
}
async function update(id, data) {
  const current = await findById(id);
  if (!current) return null;
  const merged = {
    nombre: data.nombre === undefined ? current.nombre : data.nombre,
    descripcion: data.descripcion === undefined ? current.descripcion : data.descripcion,
    precio: data.precio === undefined ? current.precio : data.precio,
    stock: data.stock === undefined ? current.stock : data.stock,
    categoria_id: data.categoria_id === undefined ? current.categoria_id : data.categoria_id,
    estado: data.estado === undefined ? current.estado : data.estado
  };
  await pool.execute(
    'UPDATE productos SET nombre=?, descripcion=?, precio=?, stock=?, categoria_id=?, estado=? WHERE id=?',
    [merged.nombre.trim(), merged.descripcion || null, merged.precio, merged.stock, merged.categoria_id, merged.estado ? 1 : 0, id]
  );
  return findById(id);
}
async function remove(id) {
  const [result] = await pool.execute('DELETE FROM productos WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
module.exports = { list, findById, create, update, remove };
