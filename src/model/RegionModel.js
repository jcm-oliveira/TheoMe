const db = require("../db/config");
console.log("RegionModel file starts...")

//--------------------------------------------
//                  SELECT
//--------------------------------------------

    async function selectRegions(filterStatus){
        const conn = await db.connect()
        var sql =`
            SELECT region.id AS id, region.name AS name, country.name AS country, region.status AS status, region.description AS description, region.id_country AS id_country
            FROM country 
            INNER JOIN country ON region.id_country = country.id 
            WHERE region.excluded = ? 
                AND region.status LIKE ? 
                AND (region.name LIKE ? OR region.id LIKE ?)
                AND region.id_country LIKE ?
            ORDER BY region.id 
            DESC LIMIT ? 
            OFFSET ?
        `
        const values = [
            0,
            filterStatus.status, 
            "%"+filterStatus.search+"%", 
            "%"+filterStatus.search+"%",
            filterStatus.countryFilter, 
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
            FROM region 
            WHERE excluded = ? 
                AND status LIKE ?
                AND id_country LIKE ?   
                AND (region.name LIKE ? OR region.id LIKE ?)                           
                `
        const values = [
            0,
            filterStatus.status, 
            filterStatus.countryFilter, 
            "%"+filterStatus.search+"%", 
            "%"+filterStatus.search+"%"
        ]
        const result = conn.query(sql,values)
        return result  
    }

    async function filterSelectContinents(filterStatus){
        const conn = await db.connect()
        var sql = `
            SELECT * 
            FROM continent 
            WHERE excluded = ? 
                AND status LIKE ? 
            ORDER BY name`
        const values = [
            0,
            1,
        ]
        const result = conn.query(sql,values)
        return result  
    }

    async function filterSelectCountries(filterStatus){
        const conn = await db.connect()
        var sql = `
            SELECT * 
            FROM country 
            WHERE excluded = ? 
                AND status LIKE ? 
            ORDER BY name`
        const values = [
            0,
            1,
        ]
        const result = conn.query(sql,values)
        return result  
    }
    
//---------------------------------------------
//                   INSERT
//---------------------------------------------

    async function insertRegions(newRegion) {
        const conn = await db.connect()
        try {  
            const sql = `
                INSERT INTO region(name, description, id_country, status) 
                VALUES (?, ?, ?, ?)`
            const values = [newRegion.regionName, newRegion.regionDescription, newRegion.regionIdCountry, newRegion.regionStatus]
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

    async function updateRegions(id, region) {
        const conn = await db.connect()
        try { 
            const sql = `
                UPDATE region SET status = ?, name = ?, description = ?, id_country = ? 
                WHERE id = ?`
            const values = [region.regionStatus,region.regionName, region.regionDescription, region.regionIdCountry, id]
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

    async function deleteRegions(id) {
        const conn = await db.connect()
        try {
            const sql = `
                UPDATE region 
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

module.exports = {
    selectRegions, 
    insertRegions, 
    updateRegions, 
    deleteRegions, 
    countSelect,
    filterSelectContinents,
    filterSelectCountries,
}

