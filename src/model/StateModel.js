const db = require("../db/config");

//------------------------------------------------
//                     SELECT
//------------------------------------------------

async function selectStates(filterStatus) {
    const conn = await db.connect();
    const sql = `
        SELECT
            state.id AS id,
            state.name AS name,
            state.status AS status,
            state.description AS description,
            state.id_region AS id_region,
            region.name AS region,
            country.id AS id_country,
            country.name AS country,
            continent.id AS id_continent,
            continent.name AS continent
        FROM state
        INNER JOIN region ON state.id_region = region.id
        INNER JOIN country ON region.id_country = country.id
        INNER JOIN continent ON country.id_continent = continent.id
        WHERE state.excluded = ?
            AND state.status LIKE ?
            AND (state.name LIKE ? OR state.id LIKE ?)
            AND state.id_region LIKE ?
        ORDER BY state.id
        DESC LIMIT ?
        OFFSET ?
    `;

    const values = [
        0,
        filterStatus.status,
        "%" + filterStatus.search + "%",
        "%" + filterStatus.search + "%",
        filterStatus.regionFilter,
        filterStatus.itemsPerPage,
        filterStatus.pageStartItem,
    ];

    const result = conn.query(sql, values);
    return result;
}

async function countSelect(filterStatus) {
    const conn = await db.connect();
    const sql = `
        SELECT COUNT(*) AS totalRegister
        FROM state
        WHERE excluded = ?
            AND status LIKE ?
            AND id_region LIKE ?
            AND (name LIKE ? OR id LIKE ?)
    `;

    const values = [
        0,
        filterStatus.status,
        filterStatus.regionFilter,
        "%" + filterStatus.search + "%",
        "%" + filterStatus.search + "%",
    ];

    const result = conn.query(sql, values);
    return result;
}

async function filterSelectContinents() {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM continent
        WHERE excluded = ?
            AND status LIKE ?
        ORDER BY name
    `;
    const values = [0, 1];
    const result = conn.query(sql, values);
    return result;
}

async function filterSelectCountries() {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM country
        WHERE excluded = ?
            AND status LIKE ?
        ORDER BY name
    `;
    const values = [0, 1];
    const result = conn.query(sql, values);
    return result;
}

async function filterSelectRegions() {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM region
        WHERE excluded = ?
            AND status LIKE ?
        ORDER BY name
    `;
    const values = [0, 1];
    const result = conn.query(sql, values);
    return result;
}

async function getCountriesByContinent(continentId) {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM country
        WHERE id_continent = ?
    `;
    const values = [continentId];
    const result = conn.query(sql, values);
    return result;
}

async function getRegionsByCountry(countryId) {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM region
        WHERE id_country = ?
    `;
    const values = [countryId];
    const result = conn.query(sql, values);
    return result;
}

//------------------------------------------------
//                     INSERT
//------------------------------------------------

async function insertStates(newState) {
    const conn = await db.connect();
    try {
        const sql = `
            INSERT INTO state(name, description, id_region, status)
            VALUES (?, ?, ?, ?)
        `;
        const values = [
            newState.stateName,
            newState.stateDescription,
            newState.stateIdRegion,
            newState.stateStatus,
        ];
        const [queryResult] = await conn.query(sql, values);
        const result = {
            alertTypeResult: "alert-success",
            textResult:
                "Registro n° " + queryResult.insertId + " inserido com sucesso.",
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
//                     UPDATE
//------------------------------------------------

async function updateStates(id, state) {
    const conn = await db.connect();
    try {
        const sql = `
            UPDATE state
            SET status = ?, name = ?, description = ?, id_region = ?
            WHERE id = ?
        `;
        const values = [
            state.stateStatus,
            state.stateName,
            state.stateDescription,
            state.stateIdRegion,
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
//                     DELETE
//------------------------------------------------

async function deleteStates(id) {
    const conn = await db.connect();
    try {
        const sql = `
            UPDATE state
            SET excluded = ?
            WHERE id = ?
        `;
        const values = [1, id];
        const [queryResult] = await conn.query(sql, values);
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
    selectStates,
    insertStates,
    updateStates,
    deleteStates,
    countSelect,
    filterSelectContinents,
    filterSelectCountries,
    filterSelectRegions,
    getCountriesByContinent,
    getRegionsByCountry,
};

