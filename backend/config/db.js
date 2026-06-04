
const sql = require("mssql");

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_DATABASE,

    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

async function conectarDB() {
    try {
        await sql.connect(config);
        console.log("✅ SQL Server conectado");
    } catch (error) {
        console.error("❌ Error SQL:", error);
    }
}

module.exports = {
    sql,
    conectarDB
};