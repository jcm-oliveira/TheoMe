//MYSQL DATABASE CONFIGURATION / CONECTION
//credenciais lidas do arquivo .env (ver .env.example)
require("dotenv").config({ quiet: true });
const mysql = require("mysql2/promise");

//pool reaproveita conexões e reabre automaticamente as que o MySQL fechar
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    enableKeepAlive: true
});

async function connect(){
    return pool;
}

//transação: usa uma conexão própria do pool (o pool não tem beginTransaction)
//e sempre a devolve ao pool, mesmo em caso de erro
async function transaction(work){
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const result = await work(conn);
        await conn.commit();
        return result;
    } catch (error) {
        await conn.rollback().catch(() => {});
        throw error;
    } finally {
        conn.release();
    }
}

module.exports = {connect, transaction}



