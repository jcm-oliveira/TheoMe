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











// __________________________________________________________________________

// //SELECT
// async function selectAssociation_type(){
//     const conn = await connect();
//     const [rows] = await conn.query('SELECT * FROM association_type;');
//     return rows;
// }

// //INSERT
// async function insertAssociation_type(association_type){
//     const conn = await connect();
//     const sql = 'INSERT INTO association_type(name) VALUES (?);';
//     const values = [association_type.name];
//     return await conn.query(sql, values);
// }

// //UPDATE
// async function updateAssociation_type(id, association_type){
//     const conn = await connect();
//     const sql = 'UPDATE association_type SET name=? WHERE id=?';
//     const values = [association_type.name, id];
//     return await conn.query(sql, values);
// }

// //DELETE
// async function deleteAssociation_type(id){
//     const conn = await connect();
//     const sql = 'DELETE FROM association_type where id=?;';
//     return await conn.query(sql, [id]);
//     }
 
// module.exports = {
//     insertAssociation_type, 
//     updateAssociation_type,
//     deleteAssociation_type,
//     selectAssociation_type, 
// }



