const mysql = require('mysql2/promise');
const config = require('./settings');

const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  waitForConnections: true,
  connectionLimit: config.db.connectionLimit,
  queueLimit: 0,
  charset: 'utf8mb4',
  decimalNumbers: true
});

async function checkDatabase() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT DATABASE() AS databaseName, VERSION() AS mysqlVersion');
    return rows[0];
  } finally {
    connection.release();
  }
}

module.exports = { pool, checkDatabase };
