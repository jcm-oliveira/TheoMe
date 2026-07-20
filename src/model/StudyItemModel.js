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

async function filterSelectBooks() {
    const conn = await db.connect();
    const [tableExistsRows] = await conn.query(
        `
            SELECT COUNT(*) AS total
            FROM information_schema.tables
            WHERE table_schema = DATABASE() AND table_name = ?
        `,
        ["book"]
    );

    if (!tableExistsRows[0] || Number(tableExistsRows[0].total) === 0) {
        return [[]];
    }

    const [columnExistsRows] = await conn.query(
        `
            SELECT COUNT(*) AS total
            FROM information_schema.columns
            WHERE table_schema = DATABASE()
              AND table_name = ?
              AND column_name = ?
        `,
        ["book", "canonical_order"]
    );

    const hasCanonicalOrder = columnExistsRows[0] && Number(columnExistsRows[0].total) > 0;

    if (hasCanonicalOrder) {
        const sql = `
            SELECT id, name, canonical_order
            FROM book
            WHERE excluded = ? AND status LIKE ?
            ORDER BY canonical_order ASC, name ASC
        `;
        return conn.query(sql, [0, 1]);
    }

    const sql = `
        SELECT id, name
        FROM book
        WHERE excluded = ? AND status LIKE ?
        ORDER BY name ASC
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

async function selectStudyItems(filterStatus = {}) {
    const conn = await db.connect();
    const statusFilter = filterStatus.status === undefined ? "%" : filterStatus.status;
    const languageFilter = filterStatus.language === undefined ? "%" : filterStatus.language;
    const searchFilter = filterStatus.search === undefined ? "%" : `%${filterStatus.search}%`;
    const historicalPerspectiveFilter = filterStatus.historicalPerspectiveFilter === undefined ? "%" : filterStatus.historicalPerspectiveFilter;
    const categoryLevel1Filter = filterStatus.categoryLevel1Filter === undefined ? "%" : filterStatus.categoryLevel1Filter;
    const categoryLevel2Filter = filterStatus.categoryLevel2Filter === undefined ? "%" : filterStatus.categoryLevel2Filter;
    const categoryLevel3Filter = filterStatus.categoryLevel3Filter === undefined ? "%" : filterStatus.categoryLevel3Filter;
    const sectionFilter = filterStatus.sectionFilter === undefined ? "%" : filterStatus.sectionFilter;
    const continentFilter = filterStatus.continentFilter === undefined ? "%" : filterStatus.continentFilter;
    const countryFilter = filterStatus.countryFilter === undefined ? "%" : filterStatus.countryFilter;
    const regionFilter = filterStatus.regionFilter === undefined ? "%" : filterStatus.regionFilter;
    const stateFilter = filterStatus.stateFilter === undefined ? "%" : filterStatus.stateFilter;
    const cityFilter = filterStatus.cityFilter === undefined ? "%" : filterStatus.cityFilter;

    const sql = `
        SELECT
            si.id,
            si.status,
            si.language,
            si.name,
            hp.name AS historical_perspective,
            cl1.name AS category_level_1,
            cl2.name AS category_level_2,
            cl3.name AS category_level_3,
            s.name AS section
        FROM study_item si
        INNER JOIN historical_perspective hp ON hp.id = si.id_historical_perspective
        INNER JOIN category_level_1 cl1 ON cl1.id = si.id_category_level_1
        INNER JOIN category_level_2 cl2 ON cl2.id = si.id_category_level_2
        INNER JOIN category_level_3 cl3 ON cl3.id = si.id_category_level_3
        INNER JOIN section s ON s.id = si.id_section
        WHERE si.excluded = ?
            AND si.status LIKE ?
            AND si.language LIKE ?
            AND (si.name LIKE ? OR si.id LIKE ?)
            AND si.id_historical_perspective LIKE ?
            AND si.id_category_level_1 LIKE ?
            AND si.id_category_level_2 LIKE ?
            AND si.id_category_level_3 LIKE ?
            AND si.id_section LIKE ?
            AND IFNULL(si.id_continent, 0) LIKE ?
            AND IFNULL(si.id_country, 0) LIKE ?
            AND IFNULL(si.id_region, 0) LIKE ?
            AND IFNULL(si.id_state, 0) LIKE ?
            AND IFNULL(si.id_city, 0) LIKE ?
        ORDER BY si.id DESC
    `;
    return conn.query(sql, [
        0,
        statusFilter,
        languageFilter,
        searchFilter,
        searchFilter,
        historicalPerspectiveFilter,
        categoryLevel1Filter,
        categoryLevel2Filter,
        categoryLevel3Filter,
        sectionFilter,
        continentFilter,
        countryFilter,
        regionFilter,
        stateFilter,
        cityFilter,
    ]);
}

async function selectStudyItemById(studyItemId) {
    const conn = await db.connect();
    const sql = `
        SELECT
            id,
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
        FROM study_item
        WHERE id = ? AND excluded = ?
        LIMIT 1
    `;
    return conn.query(sql, [studyItemId, 0]);
}

async function selectStudyItemAttributeItems(studyItemId) {
    const conn = await db.connect();
    const sql = `
        SELECT
            sia.id_attribute_type AS idAttributeType,
            at.name AS attributeTypeName,
            sia.id_attribute AS idAttribute,
            a.name AS attributeName,
            sia.description,
            sia.image,
            sia.layout_figure AS figureLayout,
            sia.video_url AS videoUrl,
            sia.layout_video AS videoLayout
        FROM study_item_attribute sia
        LEFT JOIN attribute_type at ON at.id = sia.id_attribute_type
        LEFT JOIN attribute a ON a.id = sia.id_attribute
        WHERE sia.id_study_item = ? AND sia.excluded = ?
        ORDER BY sia.id ASC
    `;
    return conn.query(sql, [studyItemId, 0]);
}

async function selectStudyItemChronologyItems(studyItemId) {
    const conn = await db.connect();
    const sql = `
        SELECT
            sic.id_timeline AS idTimeline,
            t.name AS timelineName,
            sic.register_type AS registerType,
            sic.bar_color AS barColor,
            sic.date_format AS dateFormat,
            sic.start_day AS startDay,
            sic.start_month AS startMonth,
            sic.start_year AS startYear,
            sic.start_reference AS startReference,
            sic.end_day AS endDay,
            sic.end_month AS endMonth,
            sic.end_year AS endYear,
            sic.end_reference AS endReference
        FROM study_item_chronology sic
        LEFT JOIN timeline t ON t.id = sic.id_timeline
        WHERE sic.id_study_item = ? AND sic.excluded = ?
        ORDER BY sic.id ASC
    `;
    return conn.query(sql, [studyItemId, 0]);
}

async function selectStudyItemAssociationItems(studyItemId) {
    const conn = await db.connect();
    const sql = `
        SELECT
            sia.id_historical_perspective AS idHistoricalPerspective,
            hp.name AS historicalPerspectiveName,
            sia.id_category_level_1 AS idCategoryLevel1,
            cl1.name AS categoryLevel1Name,
            sia.id_category_level_2 AS idCategoryLevel2,
            cl2.name AS categoryLevel2Name,
            sia.id_category_level_3 AS idCategoryLevel3,
            cl3.name AS categoryLevel3Name,
            sia.id_section AS idSection,
            s.name AS sectionName,
            sia.id_associated_study_item AS idAssociatedStudyItem,
            asi.name AS associatedStudyItemName
        FROM study_item_association sia
        LEFT JOIN historical_perspective hp ON hp.id = sia.id_historical_perspective
        LEFT JOIN category_level_1 cl1 ON cl1.id = sia.id_category_level_1
        LEFT JOIN category_level_2 cl2 ON cl2.id = sia.id_category_level_2
        LEFT JOIN category_level_3 cl3 ON cl3.id = sia.id_category_level_3
        LEFT JOIN section s ON s.id = sia.id_section
        LEFT JOIN study_item asi ON asi.id = sia.id_associated_study_item
        WHERE sia.id_study_item = ? AND sia.excluded = ?
        ORDER BY sia.id ASC
    `;
    return conn.query(sql, [studyItemId, 0]);
}

async function selectStudyItemHierarchyItems(studyItemId) {
    const conn = await db.connect();
    const sql = `
        SELECT
            si.name AS referenceItemName,
            sih.id_superior_study_item AS idSuperiorStudyItem,
            superior.name AS superiorStudyItemName,
            sih.id_inferior_study_item AS idInferiorStudyItem,
            inferior.name AS inferiorStudyItemName,
            sih.id_previous_study_item AS idPreviousStudyItem,
            previous_item.name AS previousStudyItemName,
            sih.id_next_study_item AS idNextStudyItem,
            next_item.name AS nextStudyItemName
        FROM study_item_hierarchy sih
        INNER JOIN study_item si ON si.id = sih.id_study_item
        LEFT JOIN study_item superior ON superior.id = sih.id_superior_study_item
        LEFT JOIN study_item inferior ON inferior.id = sih.id_inferior_study_item
        LEFT JOIN study_item previous_item ON previous_item.id = sih.id_previous_study_item
        LEFT JOIN study_item next_item ON next_item.id = sih.id_next_study_item
        WHERE sih.id_study_item = ? AND sih.excluded = ?
        ORDER BY sih.id ASC
    `;
    return conn.query(sql, [studyItemId, 0]);
}

async function selectStudyItemBibleMarkupItems(studyItemId) {
    const conn = await db.connect();
    const sql = `
        SELECT
            sibm.id_book AS idBook,
            b.name AS bookName,
            sibm.chapter,
            sibm.verse_start AS verseStart,
            sibm.verse_end AS verseEnd
        FROM study_item_bible_markup sibm
        LEFT JOIN book b ON b.id = sibm.id_book
        WHERE sibm.id_study_item = ? AND sibm.excluded = ?
        ORDER BY sibm.id ASC
    `;
    return conn.query(sql, [studyItemId, 0]);
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

async function softDeleteChildCollections(conn, studyItemId) {
    await conn.query(`UPDATE study_item_attribute SET excluded = ? WHERE id_study_item = ?`, [1, studyItemId]);
    await conn.query(`UPDATE study_item_chronology SET excluded = ? WHERE id_study_item = ?`, [1, studyItemId]);
    await conn.query(`UPDATE study_item_association SET excluded = ? WHERE id_study_item = ?`, [1, studyItemId]);
    await conn.query(`UPDATE study_item_hierarchy SET excluded = ? WHERE id_study_item = ?`, [1, studyItemId]);
    await conn.query(`UPDATE study_item_bible_markup SET excluded = ? WHERE id_study_item = ?`, [1, studyItemId]);
}

async function insertChildCollections(conn, studyItemId, item) {
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
                studyItemId,
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
                studyItemId,
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
                studyItemId,
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
                studyItemId,
                hierarchyItem.idSuperiorStudyItem,
                hierarchyItem.idInferiorStudyItem,
                hierarchyItem.idPreviousStudyItem,
                hierarchyItem.idNextStudyItem,
            ];
            await conn.query(sqlHierarchyItem, hierarchyValues);
        }
    }

    if (Array.isArray(item.bibleMarkupItems) && item.bibleMarkupItems.length > 0) {
        const sqlBibleMarkupItem = `
            INSERT INTO study_item_bible_markup(
                id_study_item,
                id_book,
                chapter,
                verse_start,
                verse_end
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        for (const bibleMarkupItem of item.bibleMarkupItems) {
            const bibleMarkupValues = [
                studyItemId,
                bibleMarkupItem.idBook,
                bibleMarkupItem.chapter,
                bibleMarkupItem.verseStart,
                bibleMarkupItem.verseEnd,
            ];
            await conn.query(sqlBibleMarkupItem, bibleMarkupValues);
        }
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

        await insertChildCollections(conn, studyItemInsert.insertId, item);

        await conn.commit();
        return { insertedId: studyItemInsert.insertId };
    } catch (error) {
        await conn.rollback();
        throw error;
    }
}

async function updateStudyItem(studyItemId, item) {
    const conn = await db.connect();
    await conn.beginTransaction();
    try {
        const sql = `
            UPDATE study_item
            SET
                status = ?,
                language = ?,
                name = ?,
                id_historical_perspective = ?,
                id_category_level_1 = ?,
                id_category_level_2 = ?,
                id_category_level_3 = ?,
                id_section = ?,
                id_continent = ?,
                id_country = ?,
                id_region = ?,
                id_state = ?,
                id_city = ?,
                district = ?
            WHERE id = ?
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
            studyItemId,
        ];
        await conn.query(sql, values);

        await softDeleteChildCollections(conn, studyItemId);
        await insertChildCollections(conn, studyItemId, item);

        await conn.commit();
        return { updatedId: Number(studyItemId) };
    } catch (error) {
        await conn.rollback();
        throw error;
    }
}

async function deleteStudyItem(studyItemId) {
    const conn = await db.connect();
    await conn.beginTransaction();
    try {
        await conn.query(`UPDATE study_item SET excluded = ? WHERE id = ?`, [1, studyItemId]);
        await softDeleteChildCollections(conn, studyItemId);
        await conn.commit();
        return { deletedId: Number(studyItemId) };
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
    filterSelectBooks,
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
    selectStudyItems,
    selectStudyItemById,
    selectStudyItemAttributeItems,
    selectStudyItemChronologyItems,
    selectStudyItemAssociationItems,
    selectStudyItemHierarchyItems,
    selectStudyItemBibleMarkupItems,
    getNextStudyItemCode,
    insertStudyItem,
    updateStudyItem,
    deleteStudyItem,
};
