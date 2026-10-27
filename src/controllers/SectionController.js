const Section = require("../model/SectionModel");

module.exports = {
    async loadShowPage(req, res) {
        const filterStatus = {
            status: 1,
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
            historicalPerspectiveFilter: "%",
            categoryLevel1Filter: "%",
            categoryLevel2Filter: "%",
            categoryLevel3Filter: "%",
        };
        const [historicalPerspectives] = await Section.filterSelectHistoricalPerspectives();
        const [categoryLevel1List] = await Section.filterSelectCategoryLevel1();
        const [categoryLevel2List] = await Section.filterSelectCategoryLevel2();
        const [categoryLevel3List] = await Section.filterSelectCategoryLevel3();
        const [sectionList] = await Section.selectSections(filterStatus);
        const [countSelect] = await Section.countSelect(filterStatus);
        const messages = { display: "d-none", alertType: "", textMessage: "Página inicial de consulta carregada." };
        return res.render("../views/cms/cms-Section-Q", {
            historicalPerspectives,
            categoryLevel1List,
            categoryLevel2List,
            categoryLevel3List,
            sectionList,
            filterStatus,
            countSelect,
            messages,
        });
    },

    async paginationView(req, res) {
        const filterStatus = {
            status: req.body.status,
            search: req.body.search,
            currentPage: Number(req.body.currentPage),
            itemsPerPage: Number(req.body.itemsPerPage),
            pageStartItem: Number(req.body.pageStartItem),
            prevBtn: req.body.previousButton,
            nextBtn: req.body.nextButton,
            historicalPerspectiveFilter: req.body.historicalPerspectiveFilter,
            categoryLevel1Filter: req.body.categoryLevel1Filter,
            categoryLevel2Filter: req.body.categoryLevel2Filter,
            categoryLevel3Filter: req.body.categoryLevel3Filter,
        };
        if (filterStatus.prevBtn === "prevBtnClicked" && filterStatus.currentPage > 1) {
            filterStatus.currentPage--;
            filterStatus.pageStartItem = filterStatus.pageStartItem - filterStatus.itemsPerPage;
        }
        const [countSelect] = await Section.countSelect(filterStatus);
        if (
            filterStatus.nextBtn === "nextBtnClicked" &&
            filterStatus.pageStartItem + filterStatus.itemsPerPage < countSelect[0].totalRegister
        ) {
            filterStatus.currentPage++;
            filterStatus.pageStartItem = filterStatus.pageStartItem + filterStatus.itemsPerPage;
        }
        const [historicalPerspectives] = await Section.filterSelectHistoricalPerspectives();
        const [categoryLevel1List] = await Section.filterSelectCategoryLevel1();
        const [categoryLevel2List] = await Section.filterSelectCategoryLevel2();
        const [categoryLevel3List] = await Section.filterSelectCategoryLevel3();
        const [sectionList] = await Section.selectSections(filterStatus);
        const messages = { display: "d-none", alertType: "", textMessage: "Página " + filterStatus.currentPage + " selecionada." };
        return res.render("../views/cms/cms-Section-Q", {
            historicalPerspectives,
            categoryLevel1List,
            categoryLevel2List,
            categoryLevel3List,
            sectionList,
            filterStatus,
            countSelect,
            messages,
        });
    },

    async loadInsertPage(req, res) {
        const [historicalPerspectives] = await Section.filterSelectHistoricalPerspectives();
        const [categoryLevel1List] = await Section.filterSelectCategoryLevel1();
        const [categoryLevel2List] = await Section.filterSelectCategoryLevel2();
        const [categoryLevel3List] = await Section.filterSelectCategoryLevel3();
        const messages = { display: "d-none", alertType: "", textMessage: "Página inserir carregada." };
        return res.render("../views/cms/cms-Section-C", {
            messages,
            historicalPerspectives,
            categoryLevel1List,
            categoryLevel2List,
            categoryLevel3List,
        });
    },

    async insertSectionPage(req, res) {
        const filterStatus = {
            status: 1,
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
            historicalPerspectiveFilter: "%",
            categoryLevel1Filter: "%",
            categoryLevel2Filter: "%",
            categoryLevel3Filter: "%",
        };
        const insert = await Section.insertSections({
            status: req.body.sectionStatus,
            name: req.body.sectionName,
            description: req.body.sectionDescription,
            idHistoricalPerspective: req.body.id_HistoricalPerspective,
            idCategoryLevel3: req.body.id_CategoryLevel3,
        });
        const messages = { display: "", alertType: insert.alertTypeResult, textMessage: insert.textResult };
        const [historicalPerspectives] = await Section.filterSelectHistoricalPerspectives();
        const [categoryLevel1List] = await Section.filterSelectCategoryLevel1();
        const [categoryLevel2List] = await Section.filterSelectCategoryLevel2();
        const [categoryLevel3List] = await Section.filterSelectCategoryLevel3();
        const [sectionList] = await Section.selectSections(filterStatus);
        const [countSelect] = await Section.countSelect(filterStatus);
        return res.render("../views/cms/cms-Section-Q", {
            historicalPerspectives,
            categoryLevel1List,
            categoryLevel2List,
            categoryLevel3List,
            sectionList,
            filterStatus,
            countSelect,
            messages,
        });
    },

    async level1Listener(req, res) {
        const { categoryLevel1Id } = req.body;
        const [categoryLevel2List] = await Section.getCategoryLevel2ByLevel1(categoryLevel1Id);
        res.json(categoryLevel2List);
    },

    async historicalPerspectiveListener(req, res) {
        const { historicalPerspectiveId } = req.body;
        const [categoryLevel1List] = await Section.getCategoryLevel1ByHistoricalPerspective(historicalPerspectiveId);
        res.json(categoryLevel1List);
    },

    async level2Listener(req, res) {
        const { categoryLevel2Id } = req.body;
        const [categoryLevel3List] = await Section.getCategoryLevel3ByLevel2(categoryLevel2Id);
        res.json(categoryLevel3List);
    },

    async loadUpdatePage(req, res) {
        const sectionId = req.params.id;
        const [historicalPerspectives] = await Section.filterSelectHistoricalPerspectives();
        const [categoryLevel1List] = await Section.filterSelectCategoryLevel1();
        const [categoryLevel2List] = await Section.filterSelectCategoryLevel2();
        const [categoryLevel3List] = await Section.filterSelectCategoryLevel3();
        const [sectionSelect] = await Section.selectSectionById(sectionId);
        const section = sectionSelect[0];
        if (!section) {
            return res.send("Section not found");
        }
        return res.render("../views/cms/cms-Section-U", {
            section,
            historicalPerspectives,
            categoryLevel1List,
            categoryLevel2List,
            categoryLevel3List,
        });
    },

    async updateSectionPage(req, res) {
        const filterStatus = {
            status: 1,
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
            historicalPerspectiveFilter: "%",
            categoryLevel1Filter: "%",
            categoryLevel2Filter: "%",
            categoryLevel3Filter: "%",
        };
        const sectionId = req.params.id;
        const update = await Section.updateSections(sectionId, {
            status: req.body.sectionStatus,
            name: req.body.sectionName,
            description: req.body.sectionDescription,
            idHistoricalPerspective: req.body.id_HistoricalPerspective,
            idCategoryLevel3: req.body.id_CategoryLevel3,
        });
        const messages = { display: "", alertType: update.alertTypeResult, textMessage: update.textResult };
        const [historicalPerspectives] = await Section.filterSelectHistoricalPerspectives();
        const [categoryLevel1List] = await Section.filterSelectCategoryLevel1();
        const [categoryLevel2List] = await Section.filterSelectCategoryLevel2();
        const [categoryLevel3List] = await Section.filterSelectCategoryLevel3();
        const [sectionList] = await Section.selectSections(filterStatus);
        const [countSelect] = await Section.countSelect(filterStatus);
        return res.render("../views/cms/cms-Section-Q", {
            historicalPerspectives,
            categoryLevel1List,
            categoryLevel2List,
            categoryLevel3List,
            sectionList,
            filterStatus,
            countSelect,
            messages,
        });
    },

    async deleteSectionPage(req, res) {
        const filterStatus = {
            status: "1",
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
            historicalPerspectiveFilter: "%",
            categoryLevel1Filter: "%",
            categoryLevel2Filter: "%",
            categoryLevel3Filter: "%",
        };
        const sectionId = req.params.id;
        const deleted = await Section.deleteSections(sectionId);
        const messages = { display: "", alertType: deleted.alertTypeResult, textMessage: deleted.textResult };
        const [historicalPerspectives] = await Section.filterSelectHistoricalPerspectives();
        const [categoryLevel1List] = await Section.filterSelectCategoryLevel1();
        const [categoryLevel2List] = await Section.filterSelectCategoryLevel2();
        const [categoryLevel3List] = await Section.filterSelectCategoryLevel3();
        const [sectionList] = await Section.selectSections(filterStatus);
        const [countSelect] = await Section.countSelect(filterStatus);
        return res.render("../views/cms/cms-Section-Q", {
            historicalPerspectives,
            categoryLevel1List,
            categoryLevel2List,
            categoryLevel3List,
            sectionList,
            filterStatus,
            countSelect,
            messages,
        });
    },

    async filterSectionPage(req, res) {
        const filterStatus = {
            status: Number(req.body.filterStatus),
            search: req.body.filterSearch,
            currentPage: 1,
            itemsPerPage: Number(req.body.itemsPerPageFilter),
            pageStartItem: 0,
            historicalPerspectiveFilter: req.body.historicalPerspectiveFilter,
            categoryLevel1Filter: req.body.categoryLevel1Filter,
            categoryLevel2Filter: req.body.categoryLevel2Filter,
            categoryLevel3Filter: req.body.categoryLevel3Filter,
        };
        if (filterStatus.status === Number(2)) {
            filterStatus.status = "%";
        }
        if (filterStatus.search === "") {
            filterStatus.search = "%";
        }
        if (filterStatus.historicalPerspectiveFilter === "0") {
            filterStatus.historicalPerspectiveFilter = "%";
        }
        if (filterStatus.categoryLevel1Filter === "0") {
            filterStatus.categoryLevel1Filter = "%";
        }
        if (filterStatus.categoryLevel2Filter === "0") {
            filterStatus.categoryLevel2Filter = "%";
        }
        if (filterStatus.categoryLevel3Filter === "0") {
            filterStatus.categoryLevel3Filter = "%";
        }
        const messages = { display: "d-none", alertType: "", textMessage: "Filtro aplicado na tela de consulta." };
        const [historicalPerspectives] = await Section.filterSelectHistoricalPerspectives();
        const [categoryLevel1List] = await Section.filterSelectCategoryLevel1();
        const [categoryLevel2List] = await Section.filterSelectCategoryLevel2();
        const [categoryLevel3List] = await Section.filterSelectCategoryLevel3();
        const [sectionList] = await Section.selectSections(filterStatus);
        const [countSelect] = await Section.countSelect(filterStatus);
        return res.render("../views/cms/cms-Section-Q", {
            historicalPerspectives,
            categoryLevel1List,
            categoryLevel2List,
            categoryLevel3List,
            sectionList,
            filterStatus,
            countSelect,
            messages,
        });
    },
};
