const app = require('./app');
const settings = require('./config/settings');
const { checkDatabase, pool } = require('./config/db');
(async () => {
  try {
    const db = await checkDatabase();
    console.log(`MySQL conectado: ${db.databaseName} (MySQL ${db.mysqlVersion})`);
    const server = app.listen(settings.port, '0.0.0.0', () => console.log(`Farmacia Galeno API ejecutándose en http://localhost:${settings.port}`));
    const shutdown = async () => { server.close(async () => { await pool.end(); process.exit(0); }); };
    process.on('SIGINT', shutdown); process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('No se pudo conectar a MySQL. Verifique DB_HOST, usuario, contraseña, puerto y permisos.');
    console.error(err.message);
    process.exit(1);
  }
})();
