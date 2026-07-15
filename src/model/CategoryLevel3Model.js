const db = require("../db/config");
console.log("CategoryLevel3Model file starts...");

async function selectCategoryLevel3(filterStatus) {
    const conn = await db.connect();
    const sql = `
        SELECT
            category_level_3.id AS id,
            category_level_3.name AS name,
            category_level_3.status AS status,
            category_level_3.description AS description,
            category_level_3.id_historical_perspective AS id_historical_perspective,
            category_level_3.id_category_level_2 AS id_category_level_2,
            category_level_2.name AS category_level_2,
            category_level_2.id_category_level_1 AS id_category_level_1,
            category_level_1.name AS category_level_1,
            historical_perspective.name AS historical_perspective
        FROM category_level_3
        INNER JOIN category_level_2 ON category_level_3.id_category_level_2 = category_level_2.id
        INNER JOIN category_level_1 ON category_level_2.id_category_level_1 = category_level_1.id
        INNER JOIN historical_perspective ON category_level_3.id_historical_perspective = historical_perspective.id
        WHERE category_level_3.excluded = ?
            AND category_level_3.status LIKE ?
            AND (category_level_3.name LIKE ? OR category_level_3.id LIKE ?)
            AND category_level_3.id_historical_perspective LIKE ?
            AND category_level_2.id_category_level_1 LIKE ?
            AND category_level_3.id_category_level_2 LIKE ?
        ORDER BY category_level_3.id DESC LIMIT ? OFFSET ?
    `;
    const values = [
        0,
        filterStatus.status,
        "%" + filterStatus.search + "%",
        "%" + filterStatus.search + "%",
        filterStatus.historicalPerspectiveFilter,
        filterStatus.categoryLevel1Filter,
        filterStatus.categoryLevel2Filter,
        filterStatus.itemsPerPage,
        filterStatus.pageStartItem,
    ];
    return conn.query(sql, values);
}

async function countSelect(filterStatus) {
    const conn = await db.connect();
    const sql = `
        SELECT COUNT(*) AS totalRegister
        FROM category_level_3
        INNER JOIN category_level_2 ON category_level_3.id_category_level_2 = category_level_2.id
        WHERE category_level_3.excluded = ?
            AND category_level_3.status LIKE ?
            AND category_level_3.id_historical_perspective LIKE ?
            AND category_level_2.id_category_level_1 LIKE ?
            AND category_level_3.id_category_level_2 LIKE ?
            AND (category_level_3.name LIKE ? OR category_level_3.id LIKE ?)
    `;
    const values = [
        0,
        filterStatus.status,
        filterStatus.historicalPerspectiveFilter,
        filterStatus.categoryLevel1Filter,
        filterStatus.categoryLevel2Filter,
        "%" + filterStatus.search + "%",
        "%" + filterStatus.search + "%",
    ];
    return conn.query(sql, values);
}

async function filterSelectCategoryLevel1() {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM category_level_1
        WHERE excluded = ? AND status LIKE ?
        ORDER BY name
    `;
    return conn.query(sql, [0, 1]);
}

async function filterSelectCategoryLevel2() {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM category_level_2
        WHERE excluded = ? AND status LIKE ?
        ORDER BY name
    `;
    return conn.query(sql, [0, 1]);
}

async function filterSelectHistoricalPerspectives() {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM historical_perspective
        WHERE excluded = ? AND status LIKE ?
        ORDER BY name
    `;
    return conn.query(sql, [0, 1]);
}

async function getCategoryLevel1ByHistoricalPerspective(historicalPerspectiveId) {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM category_level_1
        WHERE excluded = ? AND status LIKE ? AND id_historical_perspective = ?
        ORDER BY name
    `;
    return conn.query(sql, [0, 1, historicalPerspectiveId]);
}

async function getCategoryLevel2ByLevel1(level1Id) {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM category_level_2
        WHERE excluded = ? AND status LIKE ? AND id_category_level_1 = ?
        ORDER BY name
    `;
    return conn.query(sql, [0, 1, level1Id]);
}

async function insertCategoryLevel3(newItem) {
    const conn = await db.connect();
    try {
        const sql = `
            INSERT INTO category_level_3(name, description, id_historical_perspective, id_category_level_2, status)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [
            newItem.name,
            newItem.description,
            newItem.idHistoricalPerspective,
            newItem.idCategoryLevel2,
            newItem.status,
        ];
        const [queryResult] = await conn.query(sql, values);
        return {
            alertTypeResult: "alert-success",
            textResult: "Registro n° " + queryResult.insertId + " inserido com sucesso.",
        };
    } catch (err) {
        console.log(err);
        return {
            alertTypeResult: "alert-danger",
            textResult: "Um erro ocorreu durante a tentativa de inserção. O registro não foi inserido.",
        };
    }
}

async function updateCategoryLevel3(id, item) {
    const conn = await db.connect();
    try {
        const sql = `
            UPDATE category_level_3
            SET status = ?, name = ?, description = ?, id_historical_perspective = ?, id_category_level_2 = ?
            WHERE id = ?
        `;
        const values = [
            item.status,
            item.name,
            item.description,
            item.idHistoricalPerspective,
            item.idCategoryLevel2,
            id,
        ];
        const [queryResult] = await conn.query(sql, values);
        return {
            alertTypeResult: "alert-success",
            textResult:
                "Registro " +
                id +
                " alterado com sucesso. Ocorreu " +
                queryResult.affectedRows +
                " alteração no Banco de Dados.",
        };
    } catch (err) {
        console.log(err);
        return {
            alertTypeResult: "alert-danger",
            textResult: "Um erro ocorreu durante a tentativa de inserção. O registro não foi inserido.",
        };
    }
}

async function deleteCategoryLevel3(id) {
    const conn = await db.connect();
    try {
        const sql = `
            UPDATE category_level_3
            SET excluded = ?
            WHERE id = ?
        `;
        await conn.query(sql, [1, id]);
        return {
            alertTypeResult: "alert-warning",
            textResult: "Registro n° " + id + " apagado com sucesso.",
        };
    } catch (err) {
        console.log(err);
        return {
            alertTypeResult: "alert-danger",
            textResult: "Um erro ocorreu durante a tentativa de inserção. O registro não foi inserido.",
        };
    }
}

module.exports = {
    selectCategoryLevel3,
    countSelect,
    filterSelectCategoryLevel1,
    filterSelectCategoryLevel2,
    filterSelectHistoricalPerspectives,
    getCategoryLevel2ByLevel1,
    getCategoryLevel1ByHistoricalPerspective,
    insertCategoryLevel3,
    updateCategoryLevel3,
    deleteCategoryLevel3,
};
