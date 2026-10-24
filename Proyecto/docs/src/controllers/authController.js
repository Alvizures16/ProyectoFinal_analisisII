const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const settings = require('../config/settings');
const { problem } = require('../middlewares/problem');

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
      return problem(res, 400, 'Datos incompletos', 'Debe enviar email y password.', req.originalUrl, { errors: [{ field: 'email/password', message: 'Son obligatorios.' }] });
    }
    const [rows] = await pool.execute('SELECT id, nombre, email, password, rol, estado FROM usuarios WHERE email = ? LIMIT 1', [email.trim().toLowerCase()]);
    const user = rows[0];
    if (!user || !user.estado) return problem(res, 401, 'Credenciales inválidas', 'El correo o la contraseña no son correctos, o el usuario está inactivo.', req.originalUrl);
    // La base puede contener hashes bcrypt. El soporte de contraseña en texto plano es solo para la migración de la práctica.
    let valid = false;
    if (typeof user.password === 'string' && /^\$2[aby]\$/.test(user.password)) valid = await bcrypt.compare(password, user.password);
    else valid = user.password === password;
    if (!valid) return problem(res, 401, 'Credenciales inválidas', 'El correo o la contraseña no son correctos.', req.originalUrl);
    const token = jwt.sign({ sub: user.id, email: user.email, rol: user.rol }, settings.jwtSecret, { expiresIn: settings.jwtExpiresIn });
    return res.status(200).json({ token, tokenType: 'Bearer', expiresIn: settings.jwtExpiresIn, user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } });
  } catch (err) { next(err); }
}
module.exports = { login };
