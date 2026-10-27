const StudyItem = require("../model/StudyItemModel");

function parseCollectionJson(payload) {
    if (!payload) {
        return [];
    }

    try {
        const parsed = JSON.parse(payload);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

// código do erro de gravação mostrado na tela (só letras, números e "_", nada do erro em si)
function readSaveError(query) {
    return typeof query.erro === "string" && /^[A-Z0-9_]{1,40}$/.test(query.erro) ? query.erro : null;
}

function saveErrorQuery(error) {
    return "?erro=" + encodeURIComponent(String(error.code || "ERRO").replace(/[^A-Z0-9_]/gi, "").toUpperCase().slice(0, 40) || "ERRO");
}

function formatChronologyDate(day, month, year, reference, dateFormat) {
    if (dateFormat === "Somente Ano") {
        return [year, reference].filter(Boolean).join(" ");
    }
    if (dateFormat === "Somente Mês e Ano") {
        return [month, year, reference].filter(Boolean).join(" ");
    }
    return [day, month, year, reference].filter(Boolean).join(" ");
}

async function loadFormDependencies() {
    const [historicalPerspectives] = await StudyItem.filterSelectHistoricalPerspectives();
    const [categoryLevel1List] = await StudyItem.filterSelectCategoryLevel1();
    const [categoryLevel2List] = await StudyItem.filterSelectCategoryLevel2();
    const [categoryLevel3List] = await StudyItem.filterSelectCategoryLevel3();
    const [sectionList] = await StudyItem.filterSelectSection();
    const [continents] = await StudyItem.filterSelectContinents();
    const [countries] = await StudyItem.filterSelectCountries();
    const [regions] = await StudyItem.filterSelectRegions();
    const [states] = await StudyItem.filterSelectStates();
    const [cities] = await StudyItem.filterSelectCities();
    const [timelines] = await StudyItem.filterSelectTimelines();
    const [books] = await StudyItem.filterSelectBooks();
    const [studyItems] = await StudyItem.filterSelectStudyItems();
    const [attributeTypes] = await StudyItem.filterSelectAttributeTypes();
    const [attributes] = await StudyItem.filterSelectAttributes();

    return {
        historicalPerspectives,
        categoryLevel1List,
        categoryLevel2List,
        categoryLevel3List,
        sectionList,
        continents,
        countries,
        regions,
        states,
        cities,
        timelines,
        books,
        studyItems,
        attributeTypes,
        attributes,
    };
}

module.exports = {
    async loadShowPage(req, res) {
        const filterStatus = {
            status: "%",
            language: "%",
            search: "",
            historicalPerspectiveFilter: "%",
            categoryLevel1Filter: "%",
            categoryLevel2Filter: "%",
            categoryLevel3Filter: "%",
            sectionFilter: "%",
            continentFilter: "%",
            countryFilter: "%",
            regionFilter: "%",
            stateFilter: "%",
            cityFilter: "%",
        };
        const [historicalPerspectives] = await StudyItem.filterSelectHistoricalPerspectives();
        const [categoryLevel1List] = await StudyItem.filterSelectCategoryLevel1();
        const [categoryLevel2List] = await StudyItem.filterSelectCategoryLevel2();
        const [categoryLevel3List] = await StudyItem.filterSelectCategoryLevel3();
        const [sectionList] = await StudyItem.filterSelectSection();
        const [continents] = await StudyItem.filterSelectContinents();
        const [countries] = await StudyItem.filterSelectCountries();
        const [regions] = await StudyItem.filterSelectRegions();
        const [states] = await StudyItem.filterSelectStates();
        const [cities] = await StudyItem.filterSelectCities();
        const [studyItemList] = await StudyItem.selectStudyItems(filterStatus);

        return res.render("../views/cms/cms-StudyItem-Q", {
            studyItemList,
            filterStatus,
            historicalPerspectives,
            categoryLevel1List,
            categoryLevel2List,
            categoryLevel3List,
            sectionList,
            continents,
            countries,
            regions,
            states,
            cities,
        });
    },

    async filterStudyItemPage(req, res) {
        const mapToLike = (value) => {
            if (value === undefined || value === null || value === "" || value === "0" || value === "2") {
                return "%";
            }
            return value;
        };

        const mapStatusToLike = (value) => {
            if (value === undefined || value === null || value === "" || value === "2") {
                return "%";
            }
            return value;
        };

        const filterStatus = {
            status: mapStatusToLike(req.body.filterStatus),
            language: mapToLike(req.body.filterLanguage),
            search: req.body.filterSearch ? req.body.filterSearch.trim() : "",
            historicalPerspectiveFilter: mapToLike(req.body.historicalPerspectiveFilter),
            categoryLevel1Filter: mapToLike(req.body.categoryLevel1Filter),
            categoryLevel2Filter: mapToLike(req.body.categoryLevel2Filter),
            categoryLevel3Filter: mapToLike(req.body.categoryLevel3Filter),
            sectionFilter: mapToLike(req.body.sectionFilter),
            continentFilter: mapToLike(req.body.continentFilter),
            countryFilter: mapToLike(req.body.countryFilter),
            regionFilter: mapToLike(req.body.regionFilter),
            stateFilter: mapToLike(req.body.stateFilter),
            cityFilter: mapToLike(req.body.cityFilter),
        };

        const [historicalPerspectives] = await StudyItem.filterSelectHistoricalPerspectives();
        const [categoryLevel1List] = await StudyItem.filterSelectCategoryLevel1();
        const [categoryLevel2List] = await StudyItem.filterSelectCategoryLevel2();
        const [categoryLevel3List] = await StudyItem.filterSelectCategoryLevel3();
        const [sectionList] = await StudyItem.filterSelectSection();
        const [continents] = await StudyItem.filterSelectContinents();
        const [countries] = await StudyItem.filterSelectCountries();
        const [regions] = await StudyItem.filterSelectRegions();
        const [states] = await StudyItem.filterSelectStates();
        const [cities] = await StudyItem.filterSelectCities();
        const [studyItemList] = await StudyItem.selectStudyItems(filterStatus);

        return res.render("../views/cms/cms-StudyItem-Q", {
            studyItemList,
            filterStatus,
            historicalPerspectives,
            categoryLevel1List,
            categoryLevel2List,
            categoryLevel3List,
            sectionList,
            continents,
            countries,
            regions,
            states,
            cities,
        });
    },

    async loadInsertPage(req, res) {
        const dependencies = await loadFormDependencies();
        const nextStudyItemCode = await StudyItem.getNextStudyItemCode();

        return res.render("../views/cms/cms-StudyItem-C", {
            ...dependencies,
            nextStudyItemCode,
            formMode: "create",
            formAction: "/cms-StudyItem-C",
            saveError: readSaveError(req.query),
            studyItem: null,
            initialAttributeItems: [],
            initialChronologyItems: [],
            initialAssociationItems: [],
            initialHierarchyItems: [],
            initialBibleMarkupItems: [],
        });
    },

    async loadUpdatePage(req, res) {
        const studyItemId = req.params.id;
        const dependencies = await loadFormDependencies();
        const [studyItemSelect] = await StudyItem.selectStudyItemById(studyItemId);
        const studyItem = studyItemSelect[0];

        if (!studyItem) {
            return res.redirect("/cms-StudyItem-Q");
        }

        const [initialAttributeItems] = await StudyItem.selectStudyItemAttributeItems(studyItemId);
        const [chronologyItemsRaw] = await StudyItem.selectStudyItemChronologyItems(studyItemId);
        const [initialAssociationItems] = await StudyItem.selectStudyItemAssociationItems(studyItemId);
        const [initialHierarchyItems] = await StudyItem.selectStudyItemHierarchyItems(studyItemId);
        const [initialBibleMarkupItems] = await StudyItem.selectStudyItemBibleMarkupItems(studyItemId);

        const initialChronologyItems = chronologyItemsRaw.map((item) => {
            const startLabel = formatChronologyDate(
                item.startDay,
                item.startMonth,
                item.startYear,
                item.startReference,
                item.dateFormat
            );

            const endLabel = item.registerType === "Período"
                ? formatChronologyDate(
                    item.endDay,
                    item.endMonth,
                    item.endYear,
                    item.endReference,
                    item.dateFormat
                )
                : null;

            return {
                ...item,
                startLabel,
                endLabel,
            };
        });

        return res.render("../views/cms/cms-StudyItem-C", {
            ...dependencies,
            nextStudyItemCode: studyItem.id,
            formMode: "update",
            formAction: `/cms-StudyItem-U/${studyItemId}`,
            saveError: readSaveError(req.query),
            studyItem,
            initialAttributeItems,
            initialChronologyItems,
            initialAssociationItems,
            initialHierarchyItems,
            initialBibleMarkupItems,
        });
    },

    async historicalPerspectiveListener(req, res) {
        const { historicalPerspectiveId } = req.body;
        const [categoryLevel1List] = await StudyItem.getCategoryLevel1ByHistoricalPerspective(historicalPerspectiveId);
        return res.json(categoryLevel1List);
    },

    async level1Listener(req, res) {
        const { categoryLevel1Id } = req.body;
        const [categoryLevel2List] = await StudyItem.getCategoryLevel2ByLevel1(categoryLevel1Id);
        return res.json(categoryLevel2List);
    },

    async level2Listener(req, res) {
        const { categoryLevel2Id } = req.body;
        const [categoryLevel3List] = await StudyItem.getCategoryLevel3ByLevel2(categoryLevel2Id);
        return res.json(categoryLevel3List);
    },

    async level3Listener(req, res) {
        const { categoryLevel3Id } = req.body;
        const [sectionList] = await StudyItem.getSectionByLevel3(categoryLevel3Id);
        return res.json(sectionList);
    },

    async continentListener(req, res) {
        const { continentId } = req.body;
        const [countries] = await StudyItem.getCountriesByContinent(continentId);
        return res.json(countries);
    },

    async countryListener(req, res) {
        const { countryId } = req.body;
        const [regions] = await StudyItem.getRegionsByCountry(countryId);
        return res.json(regions);
    },

    async regionListener(req, res) {
        const { regionId } = req.body;
        const [states] = await StudyItem.getStatesByRegion(regionId);
        return res.json(states);
    },

    async stateListener(req, res) {
        const { stateId } = req.body;
        const [cities] = await StudyItem.getCitiesByState(stateId);
        return res.json(cities);
    },

    async attributeTypeListener(req, res) {
        const { attributeTypeId } = req.body;
        const [attributes] = await StudyItem.getAttributesByType(attributeTypeId);
        return res.json(attributes);
    },

    async associationSectionListener(req, res) {
        const { sectionId } = req.body;
        const [studyItems] = await StudyItem.getStudyItemsBySection(sectionId);
        return res.json(studyItems);
    },

    async uploadAttributeImage(req, res) {
        if (!req.file) {
            return res.status(400).json({ message: "Arquivo não enviado." });
        }

        return res.json({
            imagePath: "/uploads/study-item-attributes/" + req.file.filename,
        });
    },

    async insertStudyItemPage(req, res) {
        try {
            const optionalId = (value) => (value === undefined || value === null || value === "" ? null : value);
            const attributeItems = parseCollectionJson(req.body.attributeItemsJson);
            const chronologyItems = parseCollectionJson(req.body.chronologyItemsJson);
            const associationItems = parseCollectionJson(req.body.associationItemsJson);
            const hierarchyItems = parseCollectionJson(req.body.hierarchyItemsJson);
            const bibleMarkupItems = parseCollectionJson(req.body.bibleMarkupItemsJson);

            await StudyItem.insertStudyItem({
                status: req.body.studyItemStatus,
                language: req.body.studyItemLanguage,
                name: req.body.studyItemName,
                idHistoricalPerspective: req.body.id_HistoricalPerspective,
                idCategoryLevel1: req.body.id_CategoryLevel1,
                idCategoryLevel2: req.body.id_CategoryLevel2,
                idCategoryLevel3: req.body.id_CategoryLevel3,
                idSection: req.body.id_Section,
                idContinent: optionalId(req.body.id_Continent),
                idCountry: optionalId(req.body.id_Country),
                idRegion: optionalId(req.body.id_Region),
                idState: optionalId(req.body.id_State),
                idCity: optionalId(req.body.id_City),
                district: req.body.district ? req.body.district.trim() : null,
                attributeItems,
                chronologyItems,
                associationItems,
                hierarchyItems,
                bibleMarkupItems,
            });

            if (req.body.submitAction === "saveNew") {
                return res.redirect("/cms-StudyItem-C");
            }

            return res.redirect("/cms-StudyItem-Q");
        } catch (error) {
            console.error("StudyItem.insert:", error.code || "", error.message);
            return res.redirect("/cms-StudyItem-C" + saveErrorQuery(error));
        }
    },

    async updateStudyItemPage(req, res) {
        const studyItemId = req.params.id;
        try {
            const optionalId = (value) => (value === undefined || value === null || value === "" ? null : value);
            const attributeItems = parseCollectionJson(req.body.attributeItemsJson);
            const chronologyItems = parseCollectionJson(req.body.chronologyItemsJson);
            const associationItems = parseCollectionJson(req.body.associationItemsJson);
            const hierarchyItems = parseCollectionJson(req.body.hierarchyItemsJson);
            const bibleMarkupItems = parseCollectionJson(req.body.bibleMarkupItemsJson);

            await StudyItem.updateStudyItem(studyItemId, {
                status: req.body.studyItemStatus,
                language: req.body.studyItemLanguage,
                name: req.body.studyItemName,
                idHistoricalPerspective: req.body.id_HistoricalPerspective,
                idCategoryLevel1: req.body.id_CategoryLevel1,
                idCategoryLevel2: req.body.id_CategoryLevel2,
                idCategoryLevel3: req.body.id_CategoryLevel3,
                idSection: req.body.id_Section,
                idContinent: optionalId(req.body.id_Continent),
                idCountry: optionalId(req.body.id_Country),
                idRegion: optionalId(req.body.id_Region),
                idState: optionalId(req.body.id_State),
                idCity: optionalId(req.body.id_City),
                district: req.body.district ? req.body.district.trim() : null,
                attributeItems,
                chronologyItems,
                associationItems,
                hierarchyItems,
                bibleMarkupItems,
            });

            if (req.body.submitAction === "saveNew") {
                return res.redirect("/cms-StudyItem-C");
            }

            return res.redirect("/cms-StudyItem-Q");
        } catch (error) {
            console.error("StudyItem.update:", error.code || "", error.message);
            return res.redirect(`/cms-StudyItem-C/${studyItemId}` + saveErrorQuery(error));
        }
    },

    async deleteStudyItemPage(req, res) {
        const studyItemId = req.params.id;
        try {
            await StudyItem.deleteStudyItem(studyItemId);
        } catch (error) {
            console.error("StudyItem.delete:", error.code || "", error.message);
            return res.redirect("/cms-StudyItem-Q");
        }
        return res.redirect("/cms-StudyItem-Q");
    },
};
