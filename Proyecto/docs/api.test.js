const test = require('node:test');
const assert = require('node:assert/strict');

function validate(body, partial = false) {
  const errors = [];
  if (!partial || body.nombre !== undefined) {
    if (typeof body.nombre !== 'string' || !body.nombre.trim()) errors.push('nombre');
  }
  if (!partial || body.precio !== undefined) {
    if (typeof body.precio !== 'number' || !Number.isFinite(body.precio) || body.precio <= 0) errors.push('precio');
  }
  if (body.stock !== undefined && (!Number.isInteger(body.stock) || body.stock < 0)) errors.push('stock');
  return errors;
}

test('REQ-API-05: producto válido supera validación', () => {
  assert.deepEqual(validate({ nombre: 'Acetaminofén', precio: 15.5, stock: 100 }), []);
});
test('REQ-API-08: producto sin nombre se rechaza', () => {
  assert.ok(validate({ nombre: ' ', precio: 10 }).includes('nombre'));
});
test('REQ-API-08: precio cero o negativo se rechaza', () => {
  assert.ok(validate({ nombre: 'Producto', precio: 0 }).includes('precio'));
  assert.ok(validate({ nombre: 'Producto', precio: -1 }).includes('precio'));
});
test('REQ-API-08: stock debe ser entero no negativo', () => {
  assert.ok(validate({ nombre: 'Producto', precio: 10, stock: -1 }).includes('stock'));
  assert.ok(validate({ nombre: 'Producto', precio: 10, stock: 2.5 }).includes('stock'));
});
