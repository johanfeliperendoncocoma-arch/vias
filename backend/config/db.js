const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10
});

async function conectarDB() {
    try {
        const conn = await pool.getConnection();
        console.log("✅ MySQL conectado");
        conn.release();
    } catch (error) {
        console.error("❌ Error MySQL:", error);
    }
}

module.exports = { pool, conectarDB };
