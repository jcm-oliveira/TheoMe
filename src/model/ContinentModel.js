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
            return ("Registro n°: " + result.insertId +  " inserido com sucesso.")
        } catch (err) {
            console.log(err)
            return ("Um erro ocorreu durante a tentativa de inserção. O registro não foi inserido.")
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
            return ("Registro " + id + " alterado com sucesso. Ocorreu " + result.affectedRows + " alteração no Banco de Dados.")
        } catch (err) {
            console.log(err)
            return ("Um erro ocorreu durante a tentativa de alteração. O registro não foi alterado.")
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
        return ("Registro n° " + id + " apagado com sucesso.")
    }


module.exports = {selectContinents, insertContinents, updateContinents, deleteContinents, countSelect}

