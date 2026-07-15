const db = require("../db/config");
console.log("CategoryModel file starts...");

//--------------------------------------------
//                  SELECT
//--------------------------------------------

async function selectCategories(filterStatus) {
    const conn = await db.connect();
    const sql = `
        SELECT
            category_level_1.id AS id,
            category_level_1.name AS name,
            category_level_1.status AS status,
            category_level_1.description AS description,
            category_level_1.id_historical_perspective AS id_historical_perspective,
            historical_perspective.name AS historical_perspective
        FROM category_level_1
        INNER JOIN historical_perspective
            ON category_level_1.id_historical_perspective = historical_perspective.id
        WHERE category_level_1.excluded = ?
            AND category_level_1.status LIKE ?
            AND (category_level_1.name LIKE ? OR category_level_1.id LIKE ?)
            AND category_level_1.id_historical_perspective LIKE ?
        ORDER BY category_level_1.id DESC LIMIT ? OFFSET ?
    `;
    const values = [
        0,
        filterStatus.status,
        "%" + filterStatus.search + "%",
        "%" + filterStatus.search + "%",
        filterStatus.historicalPerspectiveFilter,
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
        FROM category_level_1
        WHERE excluded = ?
            AND status LIKE ?
            AND id_historical_perspective LIKE ?
            AND (name LIKE ? OR id LIKE ?)
    `;
    const values = [
        0,
        filterStatus.status,
        filterStatus.historicalPerspectiveFilter,
        "%" + filterStatus.search + "%",
        "%" + filterStatus.search + "%",
    ];
    const result = conn.query(sql, values);
    return result;
}

async function filterSelectHistoricalPerspectives() {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM historical_perspective
        WHERE excluded = ?
            AND status LIKE ?
        ORDER BY name
    `;
    const values = [0, 1];
    const result = conn.query(sql, values);
    return result;
}

//---------------------------------------------
//                   INSERT
//---------------------------------------------

async function insertCategories(newCategory) {
    const conn = await db.connect();
    try {
        const sql = `
            INSERT INTO category_level_1(name, description, id_historical_perspective, status)
            VALUES (?, ?, ?, ?)
        `;
        const values = [
            newCategory.categoryName,
            newCategory.categoryDescription,
            newCategory.categoryIdHistoricalPerspective,
            newCategory.categoryStatus,
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

async function updateCategories(id, category) {
    const conn = await db.connect();
    try {
        const sql = `
            UPDATE category_level_1
            SET status = ?, name = ?, description = ?, id_historical_perspective = ?
            WHERE id = ?
        `;
        const values = [
            category.categoryStatus,
            category.categoryName,
            category.categoryDescription,
            category.categoryIdHistoricalPerspective,
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

async function deleteCategories(id) {
    const conn = await db.connect();
    try {
        const sql = `
            UPDATE category_level_1
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
    selectCategories,
    insertCategories,
    updateCategories,
    deleteCategories,
    countSelect,
    filterSelectHistoricalPerspectives,
};
