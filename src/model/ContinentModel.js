const db = require("../db/config");
console.log("Model file starts...")


//--------------------------------------------
//                  SELECT
//--------------------------------------------

    async function selectContinents(filterStatus){
        const conn = await db.connect()

        // console.log(filterStatus)

        // console.log(filterStatus.continentStatus)
        // console.log(filterStatus.continentSearch)
        // console.log(filterStatus.itemsPerPage)
        // console.log(filterStatus.pageStartItem)


        var sql = "SELECT * FROM continent WHERE excluded = ? AND status LIKE ? AND (name LIKE ? OR id LIKE ?) LIMIT ? OFFSET ?"
        const values = [0,filterStatus.continentStatus, "%"+filterStatus.continentSearch+"%", "%"+filterStatus.continentSearch+"%", filterStatus.itemsPerPage, filterStatus.pageStartItem]
        const result = conn.query(sql,values)
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

    async function deleteContinents(id) {
        const conn = await db.connect()
        const sql = "UPDATE continent SET excluded = ? WHERE id = ?"
        const values = [1, id]
        const result = conn.query(sql, values)
        return "Data deleted successfully"
    }


module.exports = {selectContinents, insertContinents, updateContinents,deleteContinents}

