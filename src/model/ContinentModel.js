const db = require("../db/config");
console.log("Model file starts...")


//--------------------------------------------
//                  SELECT
//--------------------------------------------

    async function selectContinents(filterStatus){
        const conn = await db.connect()
        var sql = "SELECT * FROM continent WHERE excluded = ? AND status LIKE ? AND (name LIKE ? OR id LIKE ?) ORDER BY id DESC LIMIT ? OFFSET ?"
        const values = [0,filterStatus.continentStatus, "%"+filterStatus.continentSearch+"%", "%"+filterStatus.continentSearch+"%", filterStatus.itemsPerPage, filterStatus.pageStartItem]
        const result = conn.query(sql,values)
        return result  
    }

    async function countSelect(filterStatus){
        const conn = await db.connect()
        var sql = "SELECT COUNT (*) AS totalRegister FROM continent WHERE excluded = ? AND status LIKE ? AND (name LIKE ? OR id LIKE ?)"
        const values = [0,filterStatus.continentStatus, "%"+filterStatus.continentSearch+"%", "%"+filterStatus.continentSearch+"%", filterStatus.itemsPerPage, filterStatus.pageStartItem]
        const result = conn.query(sql,values)
        return result  
    }
    
//---------------------------------------------
//                   INSERT
//---------------------------------------------

    async function insertContinents(newContinent) {
        const conn = await db.connect()
        try {  
            const sql = "INSERT INTO continent(name, description,status) VALUES (?, ?, ?)"
            const values = [newContinent.continentName, newContinent.continentDescription, newContinent.continentStatus]    
            const [result] = await conn.query(sql, values)
            return ("Register n°: " + result.insertId + " inserted successfully.")
        } catch (err) {
            console.log(err)
            return ("Error found. Operation canceled.")
        }        
    }

//----------------------------------------------
//                  UPDATE
//----------------------------------------------

    async function updateContinents(id, continent) {
        const conn = await db.connect()
        try { 
            const sql = "UPDATE continent SET  status = ?, name = ?, description = ? WHERE id = ?"
            const values = [continent.continentStatus,continent.continentName, continent.continentDescription, id]
            const [result] = await conn.query(sql, values)
            return (result.affectedRows + " register updated successfully.")
        } catch (err) {
            console.log(err)
            return ("Error found. Operation canceled.")
        } 
    }

//------------------------------------------------
//                    DELETE
//------------------------------------------------

    async function deleteContinents(id) {
        const conn = await db.connect()
        const sql = "UPDATE continent SET excluded = ? WHERE id = ?"
        const values = [1, id]
        conn.query(sql, values)
        return ("Register n° " + id + " deleted successfully")
    }


module.exports = {selectContinents, insertContinents, updateContinents, deleteContinents, countSelect}

