const db = require("../db/config");
console.log("CityModel file starts...");

//------------------------------------------------
//                     SELECT
//------------------------------------------------

async function selectCities(filterStatus) {
    const conn = await db.connect();
    const sql = `
        SELECT
            city.id AS id,
            city.name AS name,
            city.status AS status,
            city.description AS description,
            city.id_state AS id_state,
            state.name AS state,
            region.id AS id_region,
            region.name AS region,
            country.id AS id_country,
            country.name AS country,
            continent.id AS id_continent,
            continent.name AS continent
        FROM city
        INNER JOIN state ON city.id_state = state.id
        INNER JOIN region ON state.id_region = region.id
        INNER JOIN country ON region.id_country = country.id
        INNER JOIN continent ON country.id_continent = continent.id
        WHERE city.excluded = ?
            AND city.status LIKE ?
            AND (city.name LIKE ? OR city.id LIKE ?)
            AND city.id_state LIKE ?
        ORDER BY city.id
        DESC LIMIT ?
        OFFSET ?
    `;

    const values = [
        0,
        filterStatus.status,
        "%" + filterStatus.search + "%",
        "%" + filterStatus.search + "%",
        filterStatus.stateFilter,
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
        FROM city
        WHERE excluded = ?
            AND status LIKE ?
            AND id_state LIKE ?
            AND (name LIKE ? OR id LIKE ?)
    `;

    const values = [
        0,
        filterStatus.status,
        filterStatus.stateFilter,
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

async function filterSelectStates() {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM state
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

async function getStatesByRegion(regionId) {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM state
        WHERE id_region = ?
    `;
    const values = [regionId];
    const result = conn.query(sql, values);
    return result;
}

//------------------------------------------------
//                     INSERT
//------------------------------------------------

async function insertCities(newCity) {
    const conn = await db.connect();
    try {
        const sql = `
            INSERT INTO city(name, description, id_state, status)
            VALUES (?, ?, ?, ?)
        `;
        const values = [
            newCity.cityName,
            newCity.cityDescription,
            newCity.cityIdState,
            newCity.cityStatus,
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

async function updateCities(id, city) {
    const conn = await db.connect();
    try {
        const sql = `
            UPDATE city
            SET status = ?, name = ?, description = ?, id_state = ?
            WHERE id = ?
        `;
        const values = [
            city.cityStatus,
            city.cityName,
            city.cityDescription,
            city.cityIdState,
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

async function deleteCities(id) {
    const conn = await db.connect();
    try {
        const sql = `
            UPDATE city
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
    selectCities,
    insertCities,
    updateCities,
    deleteCities,
    countSelect,
    filterSelectContinents,
    filterSelectCountries,
    filterSelectRegions,
    filterSelectStates,
    getCountriesByContinent,
    getRegionsByCountry,
    getStatesByRegion,
};

