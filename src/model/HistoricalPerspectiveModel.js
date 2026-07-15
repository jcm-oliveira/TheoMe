const db = require("../db/config");
console.log("HistoricalPerspectiveModel file starts...");

//--------------------------------------------
//                  SELECT
//--------------------------------------------

async function selectHistoricalPerspectives(filterStatus) {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM historical_perspective
        WHERE excluded = ?
            AND status LIKE ?
            AND (name LIKE ? OR id LIKE ?)
        ORDER BY id DESC LIMIT ? OFFSET ?
    `;
    const values = [
        0,
        filterStatus.status,
        "%" + filterStatus.search + "%",
        "%" + filterStatus.search + "%",
        filterStatus.itemsPerPage,
        filterStatus.pageStartItem,
    ];
    const result = conn.query(sql, values);
    return result;
}

async function countSelect(filterStatus) {
    const conn = await db.connect();
    const sql = `
        SELECT COUNT (*) AS totalRegister
        FROM historical_perspective
        WHERE excluded = ?
            AND status LIKE ?
            AND (name LIKE ? OR id LIKE ?)
    `;
    const values = [
        0,
        filterStatus.status,
        "%" + filterStatus.search + "%",
        "%" + filterStatus.search + "%",
    ];
    const result = conn.query(sql, values);
    return result;
}

//---------------------------------------------
//                   INSERT
//---------------------------------------------

async function insertHistoricalPerspectives(newHistoricalPerspective) {
    const conn = await db.connect();
    try {
        const sql = `
            INSERT INTO historical_perspective(name, description, status)
            VALUES (?, ?, ?)
        `;
        const values = [
            newHistoricalPerspective.historicalPerspectiveName,
            newHistoricalPerspective.historicalPerspectiveDescription,
            newHistoricalPerspective.historicalPerspectiveStatus,
        ];
        const [queryResult] = await conn.query(sql, values);
        const result = {
            alertTypeResult: "alert-success",
            textResult: "Registro n° " + queryResult.insertId + " inserido com sucesso.",
        };
        return result;
    } catch (err) {
        console.log(err);
        const result = {
            alertTypeResult: "alert-danger",
            textResult:
                "Um erro ocorreu durante a tentativa de inserção. O registro não foi inserido.",
        };
        return result;
    }
}

//----------------------------------------------
//                  UPDATE
//----------------------------------------------

async function updateHistoricalPerspectives(id, historicalPerspective) {
    const conn = await db.connect();
    try {
        const sql = `
            UPDATE historical_perspective
            SET status = ?, name = ?, description = ?
            WHERE id = ?
        `;
        const values = [
            historicalPerspective.historicalPerspectiveStatus,
            historicalPerspective.historicalPerspectiveName,
            historicalPerspective.historicalPerspectiveDescription,
            id,
        ];
        const [queryResult] = await conn.query(sql, values);
        const result = {
            alertTypeResult: "alert-success",
            textResult:
                "Registro " +
                id +
                " alterado com sucesso. Ocorreu " +
                queryResult.affectedRows +
                " alteração no Banco de Dados.",
        };
        return result;
    } catch (err) {
        console.log(err);
        const result = {
            alertTypeResult: "alert-danger",
            textResult:
                "Um erro ocorreu durante a tentativa de inserção. O registro não foi inserido.",
        };
        return result;
    }
}

//------------------------------------------------
//                    DELETE
//------------------------------------------------

async function deleteHistoricalPerspectives(id) {
    const conn = await db.connect();
    try {
        const sql = `
            UPDATE historical_perspective
            SET excluded = ?
            WHERE id = ?
        `;
        const values = [1, id];
        await conn.query(sql, values);
        const result = {
            alertTypeResult: "alert-warning",
            textResult: "Registro n° " + id + " apagado com sucesso.",
        };
        return result;
    } catch (err) {
        console.log(err);
        const result = {
            alertTypeResult: "alert-danger",
            textResult:
                "Um erro ocorreu durante a tentativa de inserção. O registro não foi inserido.",
        };
        return result;
    }
}

module.exports = {
    selectHistoricalPerspectives,
    insertHistoricalPerspectives,
    updateHistoricalPerspectives,
    deleteHistoricalPerspectives,
    countSelect,
};
