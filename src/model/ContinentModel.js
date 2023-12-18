const db = require("../db/config");
console.log("Model file starts...")

//--------------------------------------------
//                  SELECT
//--------------------------------------------

    async function selectContinents(filterStatus){
        const conn = await db.connect()
        var sql = `
            SELECT * 
            FROM continent 
            WHERE excluded = ? 
                AND status LIKE ? 
                AND (name LIKE ? OR id LIKE ?) 
            ORDER BY id DESC LIMIT ? OFFSET ?`
        const values = [
            0,
            filterStatus.status, 
            "%"+filterStatus.search+"%", 
            "%"+filterStatus.search+"%", 
            filterStatus.itemsPerPage, 
            filterStatus.pageStartItem
        ]
        const result = conn.query(sql,values)
        return result  
    }

    async function countSelect(filterStatus){
        const conn = await db.connect()
        var sql = `SELECT COUNT (*) AS totalRegister FROM continent WHERE excluded = ? AND status LIKE ? AND (name LIKE ? OR id LIKE ?)`
        const values = [0,filterStatus.status, "%"+filterStatus.search+"%", "%"+filterStatus.search+"%", filterStatus.itemsPerPage, filterStatus.pageStartItem]
        const result = conn.query(sql,values)
        return result  
    }
    
//---------------------------------------------
//                   INSERT
//---------------------------------------------

    async function insertContinents(newContinent) {
        const conn = await db.connect()
        try {  
            const sql = `
                INSERT INTO continent(name, description, status) 
                VALUES (?, ?, ?)`
            const values = [newContinent.continentName, newContinent.continentDescription, newContinent.continentStatus]    
            const [queryResult] = await conn.query(sql, values)
            const result = {
                alertTypeResult: "alert-success",
                textResult: ("Registro n° " + queryResult.insertId +  " inserido com sucesso."),
            };
            return result
        } catch (err) {
            console.log(err)
            const result = {
                alertTypeResult: "alert-danger",
                textResult: ("Um erro ocorreu durante a tentativa de inserção. O registro não foi inserido."),
            };
            return result
        }        
    }

//----------------------------------------------
//                  UPDATE
//----------------------------------------------

    async function updateContinents(id, continent) {
        const conn = await db.connect()
        try { 
            const sql = `
                UPDATE continent 
                SET status = ?, name = ?, description = ? 
                WHERE id = ?`
            const values = [continent.continentStatus,continent.continentName, continent.continentDescription, id]
            const [queryResult] = await conn.query(sql, values)
            const result = {
                alertTypeResult: "alert-success",
                textResult: ("Registro " + id + " alterado com sucesso. Ocorreu " + queryResult.affectedRows + " alteração no Banco de Dados."),
            };
            return result
        } catch (err) {
            console.log(err)
            const result = {
                alertTypeResult: "alert-danger",
                textResult: ("Um erro ocorreu durante a tentativa de inserção. O registro não foi inserido."),
            };
            return result
        } 
    }

//------------------------------------------------
//                    DELETE
//------------------------------------------------

    async function deleteContinents(id) {
        const conn = await db.connect()
        try {
            const sql = `
                UPDATE continent 
                SET excluded = ? 
                WHERE id = ?`
            const values = [1, id]
            const [queryResult] = await conn.query(sql, values)
            const result = {
                alertTypeResult: "alert-warning",
                textResult: ("Registro n° " + id + " apagado com sucesso."),
            };
            return result
        } catch {
            const result = {
                alertTypeResult: "alert-danger",
                textResult: ("Um erro ocorreu durante a tentativa de inserção. O registro não foi inserido."),
            };
            return result
        }
    }

module.exports = {selectContinents, insertContinents, updateContinents, deleteContinents, countSelect}

