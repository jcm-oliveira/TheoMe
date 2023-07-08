const db = require("../db/config");
console.log("Model file starts...")


//--------------------------------------------
//                  SELECT
//--------------------------------------------

   async function selectContinents(){
        const conn = await db.connect()
        var sql = "SELECT * FROM continent"
        const result = conn.query(sql)
        return result  
    }

    
//---------------------------------------------
//                   INSERT
//---------------------------------------------

    async function insertContinents(newContinent) {
        const conn = await db.connect()
        const sql = "INSERT INTO continent(name, description,status) VALUES (?, ?, ?)"
        const values = [newContinent.continentName, newContinent.continentDescription, newContinent.continentStatus]
        const result = conn.query(sql, values)
        return "Data inserted successfully"
    }

//----------------------------------------------
//                     UPDATE
//----------------------------------------------

    async function updateContinents(id, continent) {
        const conn = await db.connect()
        const sql = "UPDATE continent SET  status = ?, name = ?, description = ? WHERE id = ?"
        const values = [continent.continentStatus,continent.continentName, continent.continentDescription, id]
        const result = conn.query(sql, values)
        return "Data updated successfully"
  
    }

//------------------------------------------------
//                    DELETE
//------------------------------------------------

    module.exports = {selectContinents, insertContinents, updateContinents}














// _________________________________________________________________________________

        // var sql = `INSERT INTO continent (
        //             name,
        //             description,
        //             status
        //             ) VALUES (            
        //                 "${newContinent.continentName}",
        //                 "${newContinent.continentDescription}",
        //                 "${newContinent.continentStatus}"
        //             )`;

// const mysql = require("mysql");
// const db = mysql.createConnection("mysql://root:@localhost:3306/theome");
// console.log("MySQL Connected!");


    //---------------CREATE----------------
    // async create(newContinent) {
    //         console.log("Connected!");
    //         console.log(con)
    //         var sql = `INSERT INTO continent (
    //                 name,
    //                 description,
    //                 status
    //                 ) VALUES (            
    //                     "${newContinent.continentName}",
    //                     "${newContinent.continentDescription}",
    //                     "${newContinent.continentStatus}"
    //                 )`;
    //         await con.query(sql, function (err, result) {
    //           if (err) throw err;
    //           console.log("1 record inserted");
    //         });
    // },



// --------------GET-------------------

       // var sql = "SELECT * FROM continent";

        // db.query(sql, function (err, result, fields) {
        //     // if any error while executing above query, throw error
        //     if (err) throw err;
        //     // if there is no error, you have the result
        //     console.log("Query Result:", result);
            
        //     const teste = result[3].name
        //     console.log(teste)

        //     return result            
                    
        // return result.map ((continent) => ({
        //     id: continent.id,
        //     name: "texto",
        //     description: continent.description,
        //     status: continent.status,
        //     excluded: continent.excluded,
        //     datetime: continent.datetime
        //      }));
        // });

//---------------CONECTION-------------------

// const mysql = require("mysql");
// const db = mysql.createConnection("mysql://root:@localhost:3306/theome");
// console.log("MySQL Connected!");


// var mysql = require('mysql');
// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "theome"
// });


          // return new Promise((resolve,reject) => {
            //     con.query(sql, function (err, result) => {
            //     if(err) return reject('Not found...')
            //     else return resolve(result)
            // });


// CREATE
        // console.log("Database conecting...");
        // // con.connect();
        // con.query(`INSERT INTO continent (
        //     name,
        //     description,
        //     status
        //     ) VALUES (            
        //         "${newContinent.continentName}",
        //         "${newContinent.continentDescription}",
        //         "${newContinent.continentStatus}"
        //     )`)
        // console.log("Data created in database.")

//SHOW

        // const conn = await mysql.connect();        
        // const continents = await conn.query(`SELECT * FROM continent WHERE ID=1` )
        // console.log("Query Result", continents)
        // console.log(continents[0].name)
        // return continents.map (continent => ({
        //     id: continent.id,
        //     name: "texto",
        //     description: continent.description,
        //     status: continent.status,
        //     excluded: continent.excluded,
        //     datetime: continent.datetime
        // }));

// __________________________________________________________________________
// async function insertContinent(continent){
//     console.log("Database conecting...");
//     const conn = await mysql.connect();

//     console.log("Object data received:")
//     const values = [continent.name, continent.description];
//     console.log(values);

//     const sql = 'INSERT INTO continent(name, description) VALUES (?,?);';
    
//     return await conn.query(sql, values);
// }

// module.exports = {
//     insertContinent, 
//     // updateContinent,
//     // deleteContinent,
//     // selectContinent, 
// }



// __________________________________________________________________________
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
 



