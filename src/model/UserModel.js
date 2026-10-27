const db = require("../db/config");

// Os erros do MySQL podem trazer o SQL com os valores (e-mail, hash da senha).
// Por isso só o código do erro é registrado no log.
function logError(context, err) {
    console.log("UserModel." + context + ":", err.code || err.message);
}

//--------------------------------------------
//                  SELECT
//--------------------------------------------

// password_hash nunca é selecionado nas consultas de tela
async function selectUsers(filterStatus) {
    const conn = await db.connect();
    const sql = `
        SELECT
            user_account.id AS id,
            user_account.name AS name,
            user_account.email AS email,
            user_account.status AS status,
            GROUP_CONCAT(permission.name ORDER BY permission.name SEPARATOR ', ') AS permissionNames
        FROM user_account
        LEFT JOIN user_account_permission ON user_account_permission.id_user_account = user_account.id
        LEFT JOIN permission ON permission.id = user_account_permission.id_permission AND permission.excluded = 0
        WHERE user_account.excluded = ?
            AND user_account.status LIKE ?
            AND (user_account.name LIKE ? OR user_account.email LIKE ? OR user_account.id LIKE ?)
        GROUP BY user_account.id
        ORDER BY user_account.id DESC LIMIT ? OFFSET ?
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
        FROM user_account
        WHERE excluded = ?
            AND status LIKE ?
            AND (name LIKE ? OR email LIKE ? OR id LIKE ?)
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

async function selectUserById(id) {
    const conn = await db.connect();
    const sql = `
        SELECT
            user_account.id AS id,
            user_account.name AS name,
            user_account.email AS email,
            user_account.status AS status,
            user_account.contact AS contact,
            user_account.birth_year AS birthYear,
            user_account.id_city AS idCity,
            user_account.avatar AS avatar,
            user_account.newsletter_opt_in AS newsletterOptIn,
            user_account.last_login_at AS lastLoginAt
        FROM user_account
        WHERE user_account.id = ?
            AND user_account.excluded = ?
        LIMIT 1
    `;
    return conn.query(sql, [id, 0]);
}

// cidades para o campo "Local de origem", no formato Cidade / Estado / País
async function selectCityOptions() {
    const conn = await db.connect();
    const sql = `
        SELECT
            city.id AS id,
            CONCAT_WS(' / ', city.name, state.name, country.name) AS label
        FROM city
        LEFT JOIN state ON state.id = city.id_state
        LEFT JOIN region ON region.id = state.id_region
        LEFT JOIN country ON country.id = region.id_country
        WHERE city.excluded = ? AND city.status = ?
        ORDER BY label ASC
    `;
    return conn.query(sql, [0, 1]);
}

async function cityExists(cityId) {
    const conn = await db.connect();
    const [rows] = await conn.query(`SELECT COUNT(*) AS total FROM city WHERE id = ? AND excluded = ?`, [cityId, 0]);
    return Number(rows[0].total) > 0;
}

// campos pessoais gravados pelo cadastro de usuários e pela tela "Meus dados";
// a foto só é alterada quando "avatar" é informado (null remove a foto)
function profileAssignments(profile) {
    const fields = ["contact = ?", "birth_year = ?", "id_city = ?", "newsletter_opt_in = ?"];
    const values = [profile.userContact, profile.userBirthYear, profile.idCity, profile.newsletterOptIn];
    if (profile.avatar !== undefined) {
        fields.push("avatar = ?");
        values.push(profile.avatar);
    }
    return { fields, values };
}

async function updateOwnProfile(id, profile) {
    const conn = await db.connect();
    try {
        const assignments = profileAssignments(profile);
        const fields = ["name = ?", ...assignments.fields];
        const values = [profile.userName, ...assignments.values, id, 0];
        await conn.query(`UPDATE user_account SET ${fields.join(", ")} WHERE id = ? AND excluded = ?`, values);
        return {
            alertTypeResult: "alert-success",
            textResult: "Seus dados foram atualizados com sucesso.",
        };
    } catch (err) {
        logError("updateOwnProfile", err);
        return {
            alertTypeResult: "alert-danger",
            textResult: "Um erro ocorreu durante a tentativa de alteração. Seus dados não foram alterados.",
        };
    }
}

async function selectUserPermissionIds(userId) {
    const conn = await db.connect();
    const sql = `
        SELECT id_permission AS idPermission
        FROM user_account_permission
        WHERE id_user_account = ?
    `;
    const [rows] = await conn.query(sql, [userId]);
    return rows.map((row) => row.idPermission);
}

async function emailInUse(email, exceptUserId = 0) {
    const conn = await db.connect();
    const sql = `
        SELECT COUNT(*) AS total
        FROM user_account
        WHERE email = ? AND excluded = ? AND id <> ?
    `;
    const [rows] = await conn.query(sql, [email, 0, exceptUserId]);
    return Number(rows[0].total) > 0;
}

// devolve só os ids que existem e não foram excluídos
async function filterValidPermissionIds(permissionIds) {
    if (permissionIds.length === 0) {
        return [];
    }
    const conn = await db.connect();
    const sql = `SELECT id FROM permission WHERE excluded = ? AND id IN (?)`;
    const [rows] = await conn.query(sql, [0, permissionIds]);
    return rows.map((row) => row.id);
}

async function replaceUserPermissions(conn, userId, permissionIds) {
    await conn.query(`DELETE FROM user_account_permission WHERE id_user_account = ?`, [userId]);
    if (permissionIds.length > 0) {
        const rows = permissionIds.map((permissionId) => [userId, permissionId]);
        await conn.query(
            `INSERT INTO user_account_permission(id_user_account, id_permission) VALUES ?`,
            [rows]
        );
    }
}

//--------------------------------------------
//              AUTHENTICATION
//--------------------------------------------

// as duas consultas abaixo são as únicas que leem o password_hash; usadas só na verificação de senha
async function selectUserCredentialsByEmail(email) {
    const conn = await db.connect();
    const sql = `
        SELECT id, password_hash AS passwordHash, session_version AS sessionVersion
        FROM user_account
        WHERE email = ? AND status = ? AND excluded = ?
        LIMIT 1
    `;
    const [rows] = await conn.query(sql, [email, 1, 0]);
    return rows[0] || null;
}

async function selectUserCredentialsById(id) {
    const conn = await db.connect();
    const sql = `
        SELECT id, password_hash AS passwordHash, session_version AS sessionVersion
        FROM user_account
        WHERE id = ? AND status = ? AND excluded = ?
        LIMIT 1
    `;
    const [rows] = await conn.query(sql, [id, 1, 0]);
    return rows[0] || null;
}

// usuário ativo da sessão, com os códigos das permissões ativas
async function selectSessionUser(id) {
    const conn = await db.connect();
    const [rows] = await conn.query(
        `
            SELECT id, name, avatar, session_version AS sessionVersion
            FROM user_account
            WHERE id = ? AND status = ? AND excluded = ?
            LIMIT 1
        `,
        [id, 1, 0]
    );
    if (!rows[0]) {
        return null;
    }
    const [permissionRows] = await conn.query(
        `
            SELECT permission.code AS code
            FROM user_account_permission
            INNER JOIN permission ON permission.id = user_account_permission.id_permission
            WHERE user_account_permission.id_user_account = ?
                AND permission.status = ? AND permission.excluded = ?
        `,
        [id, 1, 0]
    );
    return {
        ...rows[0],
        permissions: permissionRows.map((row) => row.code),
    };
}

async function updateLastLogin(id) {
    const conn = await db.connect();
    await conn.query(`UPDATE user_account SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?`, [id]);
}

// troca a senha do próprio usuário e devolve a nova versão de sessão
async function updateOwnPassword(id, passwordHash) {
    const conn = await db.connect();
    try {
        await conn.query(
            `UPDATE user_account SET password_hash = ?, session_version = session_version + 1 WHERE id = ? AND excluded = ?`,
            [passwordHash, id, 0]
        );
        const [rows] = await conn.query(`SELECT session_version AS sessionVersion FROM user_account WHERE id = ?`, [id]);
        return rows[0] ? rows[0].sessionVersion : null;
    } catch (err) {
        logError("updateOwnPassword", err);
        return null;
    }
}

//---------------------------------------------
//                   INSERT
//---------------------------------------------

async function insertUsers(newUser) {
    const conn = await db.connect();
    await conn.beginTransaction();
    try {
        const sql = `
            INSERT INTO user_account(name, email, password_hash, status, contact, birth_year, id_city, newsletter_opt_in, avatar)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            newUser.userName,
            newUser.userEmail,
            newUser.passwordHash,
            newUser.userStatus,
            newUser.userContact || null,
            newUser.userBirthYear || null,
            newUser.idCity || null,
            newUser.newsletterOptIn || 0,
            newUser.avatar || null,
        ];
        const [queryResult] = await conn.query(sql, values);
        await replaceUserPermissions(conn, queryResult.insertId, newUser.permissionIds);
        await conn.commit();
        return {
            alertTypeResult: "alert-success",
            textResult: "Registro n° " + queryResult.insertId + " inserido com sucesso.",
        };
    } catch (err) {
        await conn.rollback();
        logError("insertUsers", err);
        return {
            alertTypeResult: "alert-danger",
            textResult: err.code === "ER_DUP_ENTRY"
                ? "Já existe um usuário com este e-mail. O registro não foi inserido."
                : "Um erro ocorreu durante a tentativa de inserção. O registro não foi inserido.",
        };
    }
}

//----------------------------------------------
//                  UPDATE
//----------------------------------------------

// a senha só é alterada quando um novo hash é informado
async function updateUsers(id, user) {
    const conn = await db.connect();
    await conn.beginTransaction();
    try {
        const assignments = profileAssignments(user);
        const fields = ["status = ?", "name = ?", "email = ?", ...assignments.fields];
        const values = [user.userStatus, user.userName, user.userEmail, ...assignments.values];
        if (user.passwordHash) {
            fields.push("password_hash = ?", "session_version = session_version + 1");
            values.push(user.passwordHash);
        }
        values.push(id, 0);

        const sql = `UPDATE user_account SET ${fields.join(", ")} WHERE id = ? AND excluded = ?`;
        const [queryResult] = await conn.query(sql, values);
        await replaceUserPermissions(conn, id, user.permissionIds);
        await conn.commit();
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
        await conn.rollback();
        logError("updateUsers", err);
        return {
            alertTypeResult: "alert-danger",
            textResult: err.code === "ER_DUP_ENTRY"
                ? "Já existe um usuário com este e-mail. O registro não foi alterado."
                : "Um erro ocorreu durante a tentativa de alteração. O registro não foi alterado.",
        };
    }
}

//------------------------------------------------
//                    DELETE
//------------------------------------------------

async function deleteUsers(id) {
    const conn = await db.connect();
    await conn.beginTransaction();
    try {
        await conn.query(`UPDATE user_account SET excluded = ?, status = ? WHERE id = ?`, [1, 0, id]);
        // usuário excluído perde todos os acessos
        await conn.query(`DELETE FROM user_account_permission WHERE id_user_account = ?`, [id]);
        await conn.commit();
        return {
            alertTypeResult: "alert-warning",
            textResult: "Registro n° " + id + " apagado com sucesso.",
        };
    } catch (err) {
        await conn.rollback();
        logError("deleteUsers", err);
        return {
            alertTypeResult: "alert-danger",
            textResult: "Um erro ocorreu durante a tentativa de exclusão. O registro não foi apagado.",
        };
    }
}

module.exports = {
    selectUsers,
    insertUsers,
    updateUsers,
    deleteUsers,
    countSelect,
    selectUserById,
    selectUserPermissionIds,
    emailInUse,
    filterValidPermissionIds,
    selectUserCredentialsByEmail,
    selectUserCredentialsById,
    selectSessionUser,
    updateLastLogin,
    updateOwnPassword,
    updateOwnProfile,
    selectCityOptions,
    cityExists,
};
