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

module.exports = {connect}



