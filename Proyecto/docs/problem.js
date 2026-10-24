function problem(res, status, title, detail, instance, extra = {}) {
  return res.status(status).type('application/problem+json').json({
    type: extra.type || 'about:blank',
    title,
    status,
    detail,
    instance,
    ...(extra.errors ? { errors: extra.errors } : {})
  });
}
function notFound(req, res) {
  return problem(res, 404, 'Recurso no encontrado', `No existe una ruta para ${req.method} ${req.originalUrl}.`, req.originalUrl);
}
function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  if (err && err.type === 'entity.parse.failed') return problem(res, 400, 'JSON inválido', 'El cuerpo de la solicitud no contiene JSON válido.', req.originalUrl);
  if (err && err.code === 'ER_DUP_ENTRY') return problem(res, 409, 'Conflicto', 'Ya existe un registro con un dato único duplicado.', req.originalUrl);
  if (err && err.code === 'ER_NO_REFERENCED_ROW_2') return problem(res, 400, 'Referencia inválida', 'La categoría indicada no existe.', req.originalUrl);
  console.error(err);
  return problem(res, 500, 'Error interno del servidor', 'Ocurrió un error inesperado. No se exponen detalles internos.', req.originalUrl);
}
module.exports = { problem, notFound, errorHandler };
