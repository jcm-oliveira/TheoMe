const db = require("../db/config");

//--------------------------------------------
//                  SELECT
//--------------------------------------------

async function selectPermissions(filterStatus) {
    const conn = await db.connect();
    const sql = `
        SELECT
            permission.id AS id,
            permission.code AS code,
            permission.name AS name,
            permission.status AS status,
            permission.description AS description
        FROM permission
        WHERE permission.excluded = ?
            AND permission.status LIKE ?
            AND (permission.name LIKE ? OR permission.code LIKE ? OR permission.id LIKE ?)
        ORDER BY permission.id DESC LIMIT ? OFFSET ?
    `;
    const values = [
        0,
        filterStatus.status,
        "%" + filterStatus.search + "%",
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
        FROM permission
        WHERE excluded = ?
            AND status LIKE ?
            AND (name LIKE ? OR code LIKE ? OR id LIKE ?)
    `;
    const values = [
        0,
        filterStatus.status,
        "%" + filterStatus.search + "%",
        "%" + filterStatus.search + "%",
        "%" + filterStatus.search + "%",
    ];
    return conn.query(sql, values);
}

async function selectPermissionById(id) {
    const conn = await db.connect();
    const sql = `
        SELECT
            permission.id AS id,
            permission.code AS code,
            permission.name AS name,
            permission.status AS status,
            permission.description AS description
        FROM permission
        WHERE permission.id = ?
            AND permission.excluded = ?
        LIMIT 1
    `;
    return conn.query(sql, [id, 0]);
}

// lista usada na tela de usuário para vincular permissões
async function selectPermissionOptions() {
    const conn = await db.connect();
    const sql = `
        SELECT
            permission.id AS id,
            permission.code AS code,
            permission.name AS name,
            permission.status AS status
        FROM permission
        WHERE permission.excluded = ?
        ORDER BY permission.name ASC
    `;
    return conn.query(sql, [0]);
}

async function selectPermissionCodesByIds(permissionIds) {
    if (permissionIds.length === 0) {
        return [];
    }
    const conn = await db.connect();
    const sql = `SELECT code FROM permission WHERE excluded = ? AND status = ? AND id IN (?)`;
    const [rows] = await conn.query(sql, [0, 1, permissionIds]);
    return rows.map((row) => row.code);
}

//---------------------------------------------
//                   INSERT
//---------------------------------------------

async function insertPermissions(newPermission) {
    const conn = await db.connect();
    try {
        const sql = `
            INSERT INTO permission(code, name, description, status)
            VALUES (?, ?, ?, ?)
        `;
        const values = [
            newPermission.permissionCode,
            newPermission.permissionName,
            newPermission.permissionDescription,
            newPermission.permissionStatus,
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
            textResult: err.code === "ER_DUP_ENTRY"
                ? "Já existe uma permissão com este código. O registro não foi inserido."
                : "Um erro ocorreu durante a tentativa de inserção. O registro não foi inserido.",
        };
    }
}

//----------------------------------------------
//                  UPDATE
//----------------------------------------------

async function updatePermissions(id, permission) {
    const conn = await db.connect();
    try {
        const sql = `
            UPDATE permission
            SET status = ?, code = ?, name = ?, description = ?
            WHERE id = ? AND excluded = ?
        `;
        const values = [
            permission.permissionStatus,
            permission.permissionCode,
            permission.permissionName,
            permission.permissionDescription,
            id,
            0,
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
            textResult: err.code === "ER_DUP_ENTRY"
                ? "Já existe uma permissão com este código. O registro não foi alterado."
                : "Um erro ocorreu durante a tentativa de alteração. O registro não foi alterado.",
        };
    }
}

//------------------------------------------------
//                    DELETE
//------------------------------------------------

async function deletePermissions(id) {
    try {
        return await db.transaction(async (conn) => {
            await conn.query(`UPDATE permission SET excluded = ? WHERE id = ?`, [1, id]);
            // permissão excluída deixa de valer para todos os usuários
            await conn.query(`DELETE FROM user_account_permission WHERE id_permission = ?`, [id]);
            return {
                alertTypeResult: "alert-warning",
                textResult: "Registro n° " + id + " apagado com sucesso.",
            };
        });
    } catch (err) {
        console.log(err);
        return {
            alertTypeResult: "alert-danger",
            textResult: "Um erro ocorreu durante a tentativa de exclusão. O registro não foi apagado.",
        };
    }
}

module.exports = {
    selectPermissions,
    insertPermissions,
    updatePermissions,
    deletePermissions,
    countSelect,
    selectPermissionById,
    selectPermissionOptions,
    selectPermissionCodesByIds,
};
