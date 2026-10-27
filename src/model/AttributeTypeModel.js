const db = require("../db/config");

//--------------------------------------------
//                  SELECT
//--------------------------------------------

async function selectAttributeTypes(filterStatus) {
    const conn = await db.connect();
    const sql = `
        SELECT
            attribute_type.id AS id,
            attribute_type.name AS name,
            attribute_type.status AS status,
            attribute_type.description AS description,
            attribute_type.image AS image
        FROM attribute_type
        WHERE attribute_type.excluded = ?
            AND attribute_type.status LIKE ?
            AND (attribute_type.name LIKE ? OR attribute_type.id LIKE ?)
        ORDER BY attribute_type.id DESC LIMIT ? OFFSET ?
    `;
    const values = [
        0,
        filterStatus.status,
        "%" + filterStatus.search + "%",
        "%" + filterStatus.search + "%",
        filterStatus.itemsPerPage,
        filterStatus.pageStartItem,
    ];
    return conn.query(sql, values);
}

async function countSelect(filterStatus) {
    const conn = await db.connect();
    const sql = `
        SELECT COUNT(*) AS totalRegister
        FROM attribute_type
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
    return conn.query(sql, values);
}

async function selectAttributeTypeById(id) {
    const conn = await db.connect();
    const sql = `
        SELECT
            attribute_type.id AS id,
            attribute_type.name AS name,
            attribute_type.status AS status,
            attribute_type.description AS description,
            attribute_type.image AS image
        FROM attribute_type
        WHERE attribute_type.id = ?
            AND attribute_type.excluded = ?
        LIMIT 1
    `;
    return conn.query(sql, [id, 0]);
}

//---------------------------------------------
//                   INSERT
//---------------------------------------------

async function insertAttributeTypes(newAttributeType) {
    const conn = await db.connect();
    try {
        const sql = `
            INSERT INTO attribute_type(name, description, image, status)
            VALUES (?, ?, ?, ?)
        `;
        const values = [
            newAttributeType.attributeTypeName,
            newAttributeType.attributeTypeDescription,
            newAttributeType.attributeTypeImage,
            newAttributeType.attributeTypeStatus,
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
            textResult:
                "Um erro ocorreu durante a tentativa de inserção. O registro não foi inserido.",
        };
    }
}

//----------------------------------------------
//                  UPDATE
//----------------------------------------------

async function updateAttributeTypes(id, attributeType) {
    const conn = await db.connect();
    try {
        const sql = `
            UPDATE attribute_type
            SET status = ?, name = ?, description = ?, image = ?
            WHERE id = ?
        `;
        const values = [
            attributeType.attributeTypeStatus,
            attributeType.attributeTypeName,
            attributeType.attributeTypeDescription,
            attributeType.attributeTypeImage,
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
            textResult:
                "Um erro ocorreu durante a tentativa de inserção. O registro não foi inserido.",
        };
    }
}

//------------------------------------------------
//                    DELETE
//------------------------------------------------

async function deleteAttributeTypes(id) {
    const conn = await db.connect();
    try {
        const sql = `
            UPDATE attribute_type
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
            textResult:
                "Um erro ocorreu durante a tentativa de inserção. O registro não foi inserido.",
        };
    }
}

module.exports = {
    selectAttributeTypes,
    insertAttributeTypes,
    updateAttributeTypes,
    deleteAttributeTypes,
    countSelect,
    selectAttributeTypeById,
};
