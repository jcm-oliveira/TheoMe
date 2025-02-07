//MYSQL DATABASE CONFIGURATION / CONECTION

async function connect(){
    //garantir que eu tenha apenas uma conexão por aplicação
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;
    
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection("mysql://root:123456@localhost:3306/theome");
    console.log("MySQL Connected!");
    global.connection = connection;
    return connection;
}

connect();

module.exports = {connect}




