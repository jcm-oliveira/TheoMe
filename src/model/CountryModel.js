const db = require("../db/config");
console.log("CountryModel file starts...")

//--------------------------------------------
//                  SELECT
//--------------------------------------------

    async function selectCountries(filterStatus){
        const conn = await db.connect()
        var sql = "SELECT * FROM country WHERE excluded = ? AND status LIKE ? AND (name LIKE ? OR id LIKE ?) ORDER BY id DESC LIMIT ? OFFSET ?"
        const values = [0,filterStatus.countryStatus, "%"+filterStatus.countrySearch+"%", "%"+filterStatus.countrySearch+"%", filterStatus.itemsPerPage, filterStatus.pageStartItem]
        const result = conn.query(sql,values)
        return result  
    }

    async function countSelect(filterStatus){
        const conn = await db.connect()
        var sql = "SELECT COUNT (*) AS totalRegister FROM country WHERE excluded = ? AND status LIKE ? AND (name LIKE ? OR id LIKE ?)"
        const values = [0,filterStatus.countryStatus, "%"+filterStatus.countrySearch+"%", "%"+filterStatus.countrySearch+"%", filterStatus.itemsPerPage, filterStatus.pageStartItem]
        const result = conn.query(sql,values)
        return result  
    }
    
//---------------------------------------------
//                   INSERT
//---------------------------------------------

    async function insertCountries(newCountry) {
        const conn = await db.connect()
        try {  
            const sql = "INSERT INTO country(id_continent, name, description, status) VALUES (?, ?, ?, ?)"
            const values = [newCountry.id_Continent,newCountry.countryName, newCountry.countryDescription, newCountry.countryStatus]    
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

    async function updateCountries(id, country) {
        const conn = await db.connect()
        try { 
            const sql = "UPDATE country SET  status = ?, name = ?, description = ? WHERE id = ?"
            const values = [country.countryStatus,country.countryName, country.countryDescription, id]
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

    async function deleteCountries(id) {
        const conn = await db.connect()
        try {
            const sql = "UPDATE country SET excluded = ? WHERE id = ?"
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

module.exports = {selectCountries, insertCountries, updateCountries, deleteCountries, countSelect}

