const mysql = require("../db/config");

module.exports = {

    //CREATE
    async create(newContinent) {
            
        console.log("Database conecting...");
        const conn = await mysql.connect();

        await conn.query(`INSERT INTO continent (
            name,
            description,
            status
            ) VALUES (            
                "${newContinent.continentName}",
                "${newContinent.continentDescription}",
                "${newContinent.continentStatus}"
            )`)
        console.log("Data created in database.")

        // await db.close()
    },

    //SHOW
    async get(){

        console.log("Database conecting...");
        const conn = await mysql.connect();
        
        const continents = await conn.query(`SELECT * FROM continent` )

        console.log("Query Result", continents)

        return continents.map (continent => ({
            id: continent.id,
            name: "texto",
            description: continent.description,
            status: continent.status,
            excluded: continent.excluded,
            datetime: continent.datetime
        }));
    },
}










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
 



