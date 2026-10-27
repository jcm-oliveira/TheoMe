const db = require("../db/config");

//--------------------------------------------
//                  SELECT
//--------------------------------------------

async function selectBannerSliders(filterStatus){
    const conn = await db.connect()
    var sql = `
        SELECT * 
        FROM banner_slider 
        WHERE excluded = ? 
            AND status LIKE ? 
            AND (title LIKE ? OR id LIKE ?) 
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
    var sql = `
        SELECT COUNT (*) AS totalRegister 
        FROM banner_slider 
        WHERE excluded = ? 
            AND status LIKE ? 
            AND (title LIKE ? OR id LIKE ?)`
    const values = [
        0,
        filterStatus.status, 
        "%"+filterStatus.search+"%", 
        "%"+filterStatus.search+"%"
    ]
    const result = conn.query(sql,values)
    return result  
}

//---------------------------------------------
//                   INSERT
//---------------------------------------------

async function insertBannerSlider(newBannerSlider) {
    const conn = await db.connect()
    try {  
        const sql = `
            INSERT INTO banner_slider(title, description, status, language, image_url, call_to_action_url, call_to_action_text) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`
        const values = [
            newBannerSlider.bannerTitle, 
            newBannerSlider.bannerDescription, 
            newBannerSlider.bannerStatus,
            newBannerSlider.bannerLanguage,
            newBannerSlider.bannerImageUrl || null,
            newBannerSlider.bannerCtaUrl || null,
            newBannerSlider.bannerCtaText || null
        ]    
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

async function updateBannerSlider(id, bannerSlider) {
    const conn = await db.connect()
    try { 
        const sql = `
            UPDATE banner_slider 
            SET status = ?, title = ?, description = ?, language = ?, image_url = ?, call_to_action_url = ?, call_to_action_text = ? 
            WHERE id = ?`
        const values = [
            bannerSlider.bannerStatus,
            bannerSlider.bannerTitle, 
            bannerSlider.bannerDescription,
            bannerSlider.bannerLanguage,
            bannerSlider.bannerImageUrl || null,
            bannerSlider.bannerCtaUrl || null,
            bannerSlider.bannerCtaText || null,
            id
        ]
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
            textResult: ("Um erro ocorreu durante a tentativa de alteração. O registro não foi atualizado."),
        };
        return result
    } 
}

//------------------------------------------------
//                    DELETE
//------------------------------------------------

async function deleteBannerSlider(id) {
    const conn = await db.connect()
    try {
        const sql = `
            UPDATE banner_slider 
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
            textResult: ("Um erro ocorreu durante a tentativa de exclusão. O registro não foi apagado."),
        };
        return result
    }
}

module.exports = {
    selectBannerSliders, 
    insertBannerSlider, 
    updateBannerSlider, 
    deleteBannerSlider, 
    countSelect
}
