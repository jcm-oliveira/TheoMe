const db = require("../db/config");

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

async function filterSelectSection() {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM section
        WHERE excluded = ? AND status LIKE ?
        ORDER BY name
    `;
    return conn.query(sql, [0, 1]);
}

async function filterSelectAttributeTypes() {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM attribute_type
        WHERE excluded = ? AND status LIKE ?
        ORDER BY name
    `;
    return conn.query(sql, [0, 1]);
}

async function filterSelectAttributes() {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM attribute
        WHERE excluded = ? AND status LIKE ?
        ORDER BY name
    `;
    return conn.query(sql, [0, 1]);
}

async function filterSelectContinents() {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM continent
        WHERE excluded = ? AND status LIKE ?
        ORDER BY name
    `;
    return conn.query(sql, [0, 1]);
}

async function filterSelectCountries() {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM country
        WHERE excluded = ? AND status LIKE ?
        ORDER BY name
    `;
    return conn.query(sql, [0, 1]);
}

async function filterSelectRegions() {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM region
        WHERE excluded = ? AND status LIKE ?
        ORDER BY name
    `;
    return conn.query(sql, [0, 1]);
}

async function filterSelectStates() {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM state
        WHERE excluded = ? AND status LIKE ?
        ORDER BY name
    `;
    return conn.query(sql, [0, 1]);
}

async function filterSelectCities() {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM city
        WHERE excluded = ? AND status LIKE ?
        ORDER BY name
    `;
    return conn.query(sql, [0, 1]);
}

async function filterSelectTimelines() {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM timeline
        WHERE excluded = ? AND status LIKE ?
        ORDER BY name
    `;
    return conn.query(sql, [0, 1]);
}

async function filterSelectStudyItems() {
    const conn = await db.connect();
    const sql = `
        SELECT id, name, id_section
        FROM study_item
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

async function getSectionByLevel3(level3Id) {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM section
        WHERE excluded = ? AND status LIKE ? AND id_category_level_3 = ?
        ORDER BY name
    `;
    return conn.query(sql, [0, 1, level3Id]);
}

async function getCountriesByContinent(continentId) {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM country
        WHERE excluded = ? AND status LIKE ? AND id_continent = ?
        ORDER BY name
    `;
    return conn.query(sql, [0, 1, continentId]);
}

async function getRegionsByCountry(countryId) {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM region
        WHERE excluded = ? AND status LIKE ? AND id_country = ?
        ORDER BY name
    `;
    return conn.query(sql, [0, 1, countryId]);
}

async function getStatesByRegion(regionId) {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM state
        WHERE excluded = ? AND status LIKE ? AND id_region = ?
        ORDER BY name
    `;
    return conn.query(sql, [0, 1, regionId]);
}

async function getCitiesByState(stateId) {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM city
        WHERE excluded = ? AND status LIKE ? AND id_state = ?
        ORDER BY name
    `;
    return conn.query(sql, [0, 1, stateId]);
}

async function getAttributesByType(attributeTypeId) {
    const conn = await db.connect();
    const sql = `
        SELECT *
        FROM attribute
        WHERE excluded = ? AND status LIKE ? AND id_attribute_type = ?
        ORDER BY name
    `;
    return conn.query(sql, [0, 1, attributeTypeId]);
}

async function getStudyItemsBySection(sectionId) {
    const conn = await db.connect();
    const sql = `
        SELECT id, name, id_section
        FROM study_item
        WHERE excluded = ? AND status LIKE ? AND id_section = ?
        ORDER BY name
    `;
    return conn.query(sql, [0, 1, sectionId]);
}

async function getNextStudyItemCode() {
    const conn = await db.connect();
    try {
        const [tableExistsRows] = await conn.query(
            `
                SELECT COUNT(*) AS total
                FROM information_schema.tables
                WHERE table_schema = DATABASE() AND table_name = ?
            `,
            ["study_item"]
        );

        if (!tableExistsRows[0] || Number(tableExistsRows[0].total) === 0) {
            return 1;
        }

        const [rows] = await conn.query("SELECT IFNULL(MAX(id), 0) + 1 AS nextCode FROM study_item");
        return Number(rows[0].nextCode || 1);
    } catch (error) {
        return 1;
    }
}

async function insertStudyItem(item) {
    const conn = await db.connect();
    await conn.beginTransaction();
    try {
        const sql = `
            INSERT INTO study_item(
                status,
                language,
                name,
                id_historical_perspective,
                id_category_level_1,
                id_category_level_2,
                id_category_level_3,
                id_section,
                id_continent,
                id_country,
                id_region,
                id_state,
                id_city,
                district
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            item.status,
            item.language,
            item.name,
            item.idHistoricalPerspective,
            item.idCategoryLevel1,
            item.idCategoryLevel2,
            item.idCategoryLevel3,
            item.idSection,
            item.idContinent,
            item.idCountry,
            item.idRegion,
            item.idState,
            item.idCity,
            item.district,
        ];
        const [studyItemInsert] = await conn.query(sql, values);

        if (Array.isArray(item.attributeItems) && item.attributeItems.length > 0) {
            const sqlAttributeItem = `
                INSERT INTO study_item_attribute(
                    id_study_item,
                    id_attribute_type,
                    id_attribute,
                    description,
                    image,
                    layout_figure,
                    video_url,
                    layout_video
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            for (const attributeItem of item.attributeItems) {
                const attributeValues = [
                    studyItemInsert.insertId,
                    attributeItem.idAttributeType,
                    attributeItem.idAttribute,
                    attributeItem.description,
                    attributeItem.image,
                    attributeItem.figureLayout,
                    attributeItem.videoUrl,
                    attributeItem.videoLayout,
                ];
                await conn.query(sqlAttributeItem, attributeValues);
            }
        }

        if (Array.isArray(item.chronologyItems) && item.chronologyItems.length > 0) {
            const sqlChronologyItem = `
                INSERT INTO study_item_chronology(
                    id_study_item,
                    id_timeline,
                    register_type,
                    bar_color,
                    date_format,
                    start_day,
                    start_month,
                    start_year,
                    start_reference,
                    end_day,
                    end_month,
                    end_year,
                    end_reference
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            for (const chronologyItem of item.chronologyItems) {
                const chronologyValues = [
                    studyItemInsert.insertId,
                    chronologyItem.idTimeline,
                    chronologyItem.registerType,
                    chronologyItem.barColor,
                    chronologyItem.dateFormat,
                    chronologyItem.startDay,
                    chronologyItem.startMonth,
                    chronologyItem.startYear,
                    chronologyItem.startReference,
                    chronologyItem.endDay,
                    chronologyItem.endMonth,
                    chronologyItem.endYear,
                    chronologyItem.endReference,
                ];
                await conn.query(sqlChronologyItem, chronologyValues);
            }
        }

        if (Array.isArray(item.associationItems) && item.associationItems.length > 0) {
            const sqlAssociationItem = `
                INSERT INTO study_item_association(
                    id_study_item,
                    id_historical_perspective,
                    id_category_level_1,
                    id_category_level_2,
                    id_category_level_3,
                    id_section,
                    id_associated_study_item
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            for (const associationItem of item.associationItems) {
                const associationValues = [
                    studyItemInsert.insertId,
                    associationItem.idHistoricalPerspective,
                    associationItem.idCategoryLevel1,
                    associationItem.idCategoryLevel2,
                    associationItem.idCategoryLevel3,
                    associationItem.idSection,
                    associationItem.idAssociatedStudyItem,
                ];
                await conn.query(sqlAssociationItem, associationValues);
            }
        }

        if (Array.isArray(item.hierarchyItems) && item.hierarchyItems.length > 0) {
            const sqlHierarchyItem = `
                INSERT INTO study_item_hierarchy(
                    id_study_item,
                    id_superior_study_item,
                    id_inferior_study_item,
                    id_previous_study_item,
                    id_next_study_item
                )
                VALUES (?, ?, ?, ?, ?)
            `;

            for (const hierarchyItem of item.hierarchyItems) {
                const hierarchyValues = [
                    studyItemInsert.insertId,
                    hierarchyItem.idSuperiorStudyItem,
                    hierarchyItem.idInferiorStudyItem,
                    hierarchyItem.idPreviousStudyItem,
                    hierarchyItem.idNextStudyItem,
                ];
                await conn.query(sqlHierarchyItem, hierarchyValues);
            }
        }

        await conn.commit();
        return { insertedId: studyItemInsert.insertId };
    } catch (error) {
        await conn.rollback();
        throw error;
    }
}

module.exports = {
    filterSelectHistoricalPerspectives,
    filterSelectCategoryLevel1,
    filterSelectCategoryLevel2,
    filterSelectCategoryLevel3,
    filterSelectSection,
    filterSelectAttributeTypes,
    filterSelectAttributes,
    filterSelectContinents,
    filterSelectCountries,
    filterSelectRegions,
    filterSelectStates,
    filterSelectCities,
    filterSelectTimelines,
    filterSelectStudyItems,
    getCategoryLevel1ByHistoricalPerspective,
    getCategoryLevel2ByLevel1,
    getCategoryLevel3ByLevel2,
    getSectionByLevel3,
    getCountriesByContinent,
    getRegionsByCountry,
    getStatesByRegion,
    getCitiesByState,
    getAttributesByType,
    getStudyItemsBySection,
    getNextStudyItemCode,
    insertStudyItem,
};
