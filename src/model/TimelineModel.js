const db = require("../db/config");

//--------------------------------------------
//                  SELECT
//--------------------------------------------

async function selectTimelines(filterStatus) {
    const conn = await db.connect();
    const sql = `
        SELECT
            timeline.id AS id,
            timeline.name AS name,
            timeline.status AS status,
            timeline.description AS description,
            timeline.visualization AS visualization,
            timeline.background_color AS background_color,
            timeline.icon AS icon,
            timeline.id_historical_perspective AS id_historical_perspective,
            historical_perspective.name AS historical_perspective
        FROM timeline
        INNER JOIN historical_perspective
            ON timeline.id_historical_perspective = historical_perspective.id
        WHERE timeline.excluded = ?
            AND timeline.status LIKE ?
            AND (timeline.name LIKE ? OR timeline.id LIKE ?)
            AND timeline.id_historical_perspective LIKE ?
        ORDER BY timeline.id DESC LIMIT ? OFFSET ?
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
    return conn.query(sql, values);
}

async function countSelect(filterStatus) {
    const conn = await db.connect();
    const sql = `
        SELECT COUNT(*) AS totalRegister
        FROM timeline
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
    return conn.query(sql, values);
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
    return conn.query(sql, [0, 1]);
}

async function selectTimelineById(id) {
    const conn = await db.connect();
    const sql = `
        SELECT
            timeline.id AS id,
            timeline.name AS name,
            timeline.status AS status,
            timeline.description AS description,
            timeline.visualization AS visualization,
            timeline.background_color AS background_color,
            timeline.icon AS icon,
            timeline.id_historical_perspective AS id_historical_perspective,
            historical_perspective.name AS historical_perspective
        FROM timeline
        INNER JOIN historical_perspective
            ON timeline.id_historical_perspective = historical_perspective.id
        WHERE timeline.id = ?
            AND timeline.excluded = ?
        LIMIT 1
    `;
    return conn.query(sql, [id, 0]);
}

//---------------------------------------------
//                   INSERT
//---------------------------------------------

async function insertTimelines(newTimeline) {
    const conn = await db.connect();
    try {
        const sql = `
            INSERT INTO timeline(name, description, id_historical_perspective, visualization, background_color, icon, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            newTimeline.timelineName,
            newTimeline.timelineDescription,
            newTimeline.timelineIdHistoricalPerspective,
            newTimeline.timelineVisualization,
            newTimeline.timelineBackgroundColor,
            newTimeline.timelineIcon,
            newTimeline.timelineStatus,
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

async function updateTimelines(id, timeline) {
    const conn = await db.connect();
    try {
        const sql = `
            UPDATE timeline
            SET status = ?, name = ?, description = ?, id_historical_perspective = ?, visualization = ?, background_color = ?, icon = ?
            WHERE id = ?
        `;
        const values = [
            timeline.timelineStatus,
            timeline.timelineName,
            timeline.timelineDescription,
            timeline.timelineIdHistoricalPerspective,
            timeline.timelineVisualization,
            timeline.timelineBackgroundColor,
            timeline.timelineIcon,
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

async function deleteTimelines(id) {
    const conn = await db.connect();
    try {
        const sql = `
            UPDATE timeline
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
    selectTimelines,
    selectTimelineById,
    insertTimelines,
    updateTimelines,
    deleteTimelines,
    countSelect,
    filterSelectHistoricalPerspectives,
};
