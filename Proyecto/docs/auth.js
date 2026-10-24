const jwt = require('jsonwebtoken');
const settings = require('../config/settings');
const { problem } = require('./problem');
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return problem(res, 401, 'No autenticado', 'Envíe Authorization: Bearer <token>.', req.originalUrl);
  try { req.auth = jwt.verify(token, settings.jwtSecret); return next(); }
  catch { return problem(res, 401, 'Token inválido o expirado', 'Inicie sesión para obtener un token vigente.', req.originalUrl); }
}
module.exports = { requireAuth };
