const db = require("../db/config");
console.log("CountryModel file starts...")

//--------------------------------------------
//                  SELECT
//--------------------------------------------

    async function selectCountries(filterStatus){
        const conn = await db.connect()
        var sql =`
            SELECT country.id AS id, country.name AS name, continent.name AS continent, country.status AS status, country.description AS description, country.id_continent AS id_continent 
            FROM country 
            INNER JOIN continent ON country.id_continent = continent.id 
            WHERE country.excluded = ? 
                AND country.status LIKE ? 
                AND (country.name LIKE ? OR country.id LIKE ?)
                AND country.id_continent LIKE ?
            ORDER BY country.id 
            DESC LIMIT ? 
            OFFSET ?
        `
        const values = [
            0,
            filterStatus.status, 
            "%"+filterStatus.search+"%", 
            "%"+filterStatus.search+"%",
            filterStatus.continentFilter, 
            filterStatus.itemsPerPage, 
            filterStatus.pageStartItem
        ]
        const result = conn.query(sql,values)
        return result  
    }

    async function countSelect(filterStatus){
        const conn = await db.connect()
        var sql = `
            SELECT COUNT (*) AS totalRegister 
            FROM country 
            WHERE excluded = ? 
                AND status LIKE ?
                AND id_continent LIKE ?   
                AND (country.name LIKE ? OR country.id LIKE ?)                           
                `
        const values = [0,filterStatus.status, filterStatus.continentFilter, "%"+filterStatus.search+"%", "%"+filterStatus.search+"%"]
        const result = conn.query(sql,values)
        return result  
    }
    
//---------------------------------------------
//                   INSERT
//---------------------------------------------

    async function insertCountries(newCountry) {
        const conn = await db.connect()
        try {  
            const sql = `
                INSERT INTO country(name, description, id_continent, status) 
                VALUES (?, ?, ?, ?)`
            const values = [newCountry.countryName, newCountry.countryDescription, newCountry.countryIdContinent, newCountry.countryStatus]
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
            const sql = `
                UPDATE country SET status = ?, name = ?, description = ?, id_continent = ? 
                WHERE id = ?`
            const values = [country.countryStatus,country.countryName, country.countryDescription, country.countryIdContinent, id]
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
            const sql = `
                UPDATE country 
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

module.exports = {selectCountries, insertCountries, updateCountries, deleteCountries, countSelect}

