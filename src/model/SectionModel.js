const db = require("../db/config");

async function selectSections(filterStatus) {
    const conn = await db.connect();
    const sql = `
        SELECT
            section.id AS id,
            section.name AS name,
            section.status AS status,
            section.description AS description,
            section.id_historical_perspective AS id_historical_perspective,
            section.id_category_level_3 AS id_category_level_3,
            category_level_3.name AS category_level_3,
            category_level_3.id_category_level_2 AS id_category_level_2,
            category_level_2.name AS category_level_2,
            category_level_2.id_category_level_1 AS id_category_level_1,
            category_level_1.name AS category_level_1,
            historical_perspective.name AS historical_perspective
        FROM section
        INNER JOIN category_level_3 ON section.id_category_level_3 = category_level_3.id
        INNER JOIN category_level_2 ON category_level_3.id_category_level_2 = category_level_2.id
        INNER JOIN category_level_1 ON category_level_2.id_category_level_1 = category_level_1.id
        INNER JOIN historical_perspective ON section.id_historical_perspective = historical_perspective.id
        WHERE section.excluded = ?
            AND section.status LIKE ?
            AND (section.name LIKE ? OR section.id LIKE ?)
            AND section.id_historical_perspective LIKE ?
            AND category_level_2.id_category_level_1 LIKE ?
            AND category_level_3.id_category_level_2 LIKE ?
            AND section.id_category_level_3 LIKE ?
        ORDER BY section.id DESC LIMIT ? OFFSET ?
    `;
    const values = [
        0,
        filterStatus.status,
        "%" + filterStatus.search + "%",
        "%" + filterStatus.search + "%",
        filterStatus.historicalPerspectiveFilter,
        filterStatus.categoryLevel1Filter,
        filterStatus.categoryLevel2Filter,
        filterStatus.categoryLevel3Filter,
        filterStatus.itemsPerPage,
        filterStatus.pageStartItem,
    ];
    return conn.query(sql, values);
}

async function countSelect(filterStatus) {
    const conn = await db.connect();
    const sql = `
        SELECT COUNT(*) AS totalRegister
        FROM section
        INNER JOIN category_level_3 ON section.id_category_level_3 = category_level_3.id
        INNER JOIN category_level_2 ON category_level_3.id_category_level_2 = category_level_2.id
        WHERE section.excluded = ?
            AND section.status LIKE ?
            AND section.id_historical_perspective LIKE ?
            AND category_level_2.id_category_level_1 LIKE ?
            AND category_level_3.id_category_level_2 LIKE ?
            AND section.id_category_level_3 LIKE ?
            AND (section.name LIKE ? OR section.id LIKE ?)
    `;
    const values = [
        0,
        filterStatus.status,
        filterStatus.historicalPerspectiveFilter,
        filterStatus.categoryLevel1Filter,
        filterStatus.categoryLevel2Filter,
        filterStatus.categoryLevel3Filter,
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

async function filterSelectCategoryLevel3() {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM category_level_3
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

async function getCategoryLevel3ByLevel2(level2Id) {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM category_level_3
        WHERE excluded = ? AND status LIKE ? AND id_category_level_2 = ?
        ORDER BY name
    `;
    return conn.query(sql, [0, 1, level2Id]);
}

async function selectSectionById(id) {
    const conn = await db.connect();
    const sql = `
        SELECT
            section.id AS id,
            section.name AS name,
            section.status AS status,
            section.description AS description,
            section.id_historical_perspective AS id_historical_perspective,
            section.id_category_level_3 AS id_category_level_3,
            category_level_3.name AS category_level_3,
            category_level_3.id_category_level_2 AS id_category_level_2,
            category_level_2.name AS category_level_2,
            category_level_2.id_category_level_1 AS id_category_level_1,
            category_level_1.name AS category_level_1,
            historical_perspective.name AS historical_perspective
        FROM section
        INNER JOIN category_level_3 ON section.id_category_level_3 = category_level_3.id
        INNER JOIN category_level_2 ON category_level_3.id_category_level_2 = category_level_2.id
        INNER JOIN category_level_1 ON category_level_2.id_category_level_1 = category_level_1.id
        INNER JOIN historical_perspective ON section.id_historical_perspective = historical_perspective.id
        WHERE section.id = ? AND section.excluded = ?
        LIMIT 1
    `;
    return conn.query(sql, [id, 0]);
}

async function insertSections(newItem) {
    const conn = await db.connect();
    try {
        const sql = `
            INSERT INTO section(name, description, id_historical_perspective, id_category_level_3, status)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [
            newItem.name,
            newItem.description,
            newItem.idHistoricalPerspective,
            newItem.idCategoryLevel3,
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

async function updateSections(id, item) {
    const conn = await db.connect();
    try {
        const sql = `
            UPDATE section
            SET status = ?, name = ?, description = ?, id_historical_perspective = ?, id_category_level_3 = ?
            WHERE id = ?
        `;
        const values = [
            item.status,
            item.name,
            item.description,
            item.idHistoricalPerspective,
            item.idCategoryLevel3,
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

async function deleteSections(id) {
    const conn = await db.connect();
    try {
        const sql = `
            UPDATE section
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
    selectSections,
    countSelect,
    filterSelectCategoryLevel1,
    filterSelectCategoryLevel2,
    filterSelectCategoryLevel3,
    filterSelectHistoricalPerspectives,
    getCategoryLevel1ByHistoricalPerspective,
    getCategoryLevel2ByLevel1,
    getCategoryLevel3ByLevel2,
    selectSectionById,
    insertSections,
    updateSections,
    deleteSections,
};
