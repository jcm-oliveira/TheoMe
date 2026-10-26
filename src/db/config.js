//MYSQL DATABASE CONFIGURATION / CONECTION
//credenciais lidas do arquivo .env (ver .env.example)
require("dotenv").config({ quiet: true });

console.log('DB config:', { host: process.env.DB_HOST, user: process.env.DB_USER, db: process.env.DB_NAME });

async function connect(){
    //garantir que eu tenha apenas uma conexão por aplicação
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;
    
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
    console.log("MySQL Connected!");
    global.connection = connection;
    return connection;
}

connect();

module.exports = {connect}




