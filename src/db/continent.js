//MYSQL DATABASE CONFIGURATION / CONECTIONINSERT

// const connect = require("./config");

async function connect(){
    //garantir que eu tenha apenas uma conexão por aplicação
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;

    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection("mysql://root:@localhost:3306/theome");
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
}

connect();

//INSERT
async function insertContinent(continent){
    const conn = await connect();
    const sql = 'INSERT INTO continent(name) VALUES (?);';
    const values = [continent.name];
    console.log("returning...");
    return await conn.query(sql, values);
    
}

// //UPDATE
// async function updateContinent(id, continent){
//     const conn = await connect();
//     const sql = 'UPDATE continent SET name=? WHERE id=?';
//     const values = [continent.name, id];
//     return await conn.query(sql, values);
// }

// //DELETE
// async function deleteContinent(id){
//     const conn = await connect();
//     const sql = 'DELETE FROM continent where id=?;';
//     return await conn.query(sql, [id]);
//     }

// //SELECT
// async function selectContinent(){
//     const conn = await connect();
//     const [rows] = await conn.query('SELECT * FROM continent;');
//     return rows;
//}
 
module.exports = {
    insertContinent, 
    // updateContinent,
    // deleteContinent,
    // selectContinent, 
}



