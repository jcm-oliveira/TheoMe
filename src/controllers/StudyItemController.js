const StudyItem = require("../model/StudyItemModel");

module.exports = {
    async loadInsertPage(req, res) {
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
        const [studyItems] = await StudyItem.filterSelectStudyItems();
        const [attributeTypes] = await StudyItem.filterSelectAttributeTypes();
        const [attributes] = await StudyItem.filterSelectAttributes();
        const nextStudyItemCode = await StudyItem.getNextStudyItemCode();

        return res.render("../views/cms/cms-StudyItem-C", {
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
            studyItems,
            attributeTypes,
            attributes,
            nextStudyItemCode,
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
            let attributeItems = [];
            if (req.body.attributeItemsJson) {
                try {
                    attributeItems = JSON.parse(req.body.attributeItemsJson);
                } catch (error) {
                    attributeItems = [];
                }
            }

            let chronologyItems = [];
            if (req.body.chronologyItemsJson) {
                try {
                    chronologyItems = JSON.parse(req.body.chronologyItemsJson);
                } catch (error) {
                    chronologyItems = [];
                }
            }

            let associationItems = [];
            if (req.body.associationItemsJson) {
                try {
                    associationItems = JSON.parse(req.body.associationItemsJson);
                } catch (error) {
                    associationItems = [];
                }
            }

            let hierarchyItems = [];
            if (req.body.hierarchyItemsJson) {
                try {
                    hierarchyItems = JSON.parse(req.body.hierarchyItemsJson);
                } catch (error) {
                    hierarchyItems = [];
                }
            }

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
            });

            if (req.body.submitAction === "saveNew") {
                return res.redirect("/cms-StudyItem-C");
            }

            return res.redirect("/cms-StudyItem-Q");
        } catch (error) {
            return res.redirect("/cms-StudyItem-C");
        }
    },
};
