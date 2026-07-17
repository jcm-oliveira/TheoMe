const db = require("../db/config");
console.log("AttributeModel file starts...");

//--------------------------------------------
//                  SELECT
//--------------------------------------------

async function selectAttributes(filterStatus) {
    const conn = await db.connect();
    const sql = `
        SELECT
            attribute.id AS id,
            attribute.name AS name,
            attribute.status AS status,
            attribute.description AS description,
            attribute.image AS image,
            attribute.id_attribute_type AS id_attribute_type,
            attribute_type.name AS attribute_type
        FROM attribute
        INNER JOIN attribute_type
            ON attribute.id_attribute_type = attribute_type.id
        WHERE attribute.excluded = ?
            AND attribute.status LIKE ?
            AND (attribute.name LIKE ? OR attribute.id LIKE ?)
            AND attribute.id_attribute_type LIKE ?
        ORDER BY attribute.id DESC LIMIT ? OFFSET ?
    `;
    const values = [
        0,
        filterStatus.status,
        "%" + filterStatus.search + "%",
        "%" + filterStatus.search + "%",
        filterStatus.attributeTypeFilter,
        filterStatus.itemsPerPage,
        filterStatus.pageStartItem,
    ];
    return conn.query(sql, values);
}

async function countSelect(filterStatus) {
    const conn = await db.connect();
    const sql = `
        SELECT COUNT(*) AS totalRegister
        FROM attribute
        WHERE excluded = ?
            AND status LIKE ?
            AND id_attribute_type LIKE ?
            AND (name LIKE ? OR id LIKE ?)
    `;
    const values = [
        0,
        filterStatus.status,
        filterStatus.attributeTypeFilter,
        "%" + filterStatus.search + "%",
        "%" + filterStatus.search + "%",
    ];
    return conn.query(sql, values);
}

async function filterSelectAttributeTypes() {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM attribute_type
        WHERE excluded = ?
            AND status LIKE ?
        ORDER BY name
    `;
    return conn.query(sql, [0, 1]);
}

async function selectAttributeById(id) {
    const conn = await db.connect();
    const sql = `
        SELECT
            attribute.id AS id,
            attribute.name AS name,
            attribute.status AS status,
            attribute.description AS description,
            attribute.image AS image,
            attribute.id_attribute_type AS id_attribute_type,
            attribute_type.name AS attribute_type
        FROM attribute
        INNER JOIN attribute_type
            ON attribute.id_attribute_type = attribute_type.id
        WHERE attribute.id = ?
            AND attribute.excluded = ?
        LIMIT 1
    `;
    return conn.query(sql, [id, 0]);
}

//---------------------------------------------
//                   INSERT
//---------------------------------------------

async function insertAttributes(newAttribute) {
    const conn = await db.connect();
    try {
        const sql = `
            INSERT INTO attribute(name, description, image, id_attribute_type, status)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [
            newAttribute.attributeName,
            newAttribute.attributeDescription,
            newAttribute.attributeImage,
            newAttribute.attributeIdType,
            newAttribute.attributeStatus,
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

async function updateAttributes(id, attribute) {
    const conn = await db.connect();
    try {
        const sql = `
            UPDATE attribute
            SET status = ?, name = ?, description = ?, image = ?, id_attribute_type = ?
            WHERE id = ?
        `;
        const values = [
            attribute.attributeStatus,
            attribute.attributeName,
            attribute.attributeDescription,
            attribute.attributeImage,
            attribute.attributeIdType,
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

async function deleteAttributes(id) {
    const conn = await db.connect();
    try {
        const sql = `
            UPDATE attribute
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
    selectAttributes,
    insertAttributes,
    updateAttributes,
    deleteAttributes,
    countSelect,
    filterSelectAttributeTypes,
    selectAttributeById,
};
