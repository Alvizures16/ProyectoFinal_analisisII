require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'solo-desarrollo-cambiar-esta-clave',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2h',
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'galeno_api',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'farmacia_galeno',
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10)
  }
};
