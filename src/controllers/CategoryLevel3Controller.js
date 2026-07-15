const CategoryLevel3 = require("../model/CategoryLevel3Model");
console.log("CategoryLevel3Controller file starts...");

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
        };
        const [historicalPerspectives] = await CategoryLevel3.filterSelectHistoricalPerspectives();
        const [categoryLevel1List] = await CategoryLevel3.filterSelectCategoryLevel1();
        const [categoryLevel2List] = await CategoryLevel3.filterSelectCategoryLevel2();
        const [categoryLevel3List] = await CategoryLevel3.selectCategoryLevel3(filterStatus);
        const [countSelect] = await CategoryLevel3.countSelect(filterStatus);
        const messages = { display: "d-none", alertType: "", textMessage: "Página inicial de consulta carregada." };
        return res.render("../views/cms/cms-CategoryLevel3-Q", {
            historicalPerspectives,
            categoryLevel1List,
            categoryLevel2List,
            categoryLevel3List,
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
        };
        if (filterStatus.prevBtn === "prevBtnClicked" && filterStatus.currentPage > 1) {
            filterStatus.currentPage--;
            filterStatus.pageStartItem = filterStatus.pageStartItem - filterStatus.itemsPerPage;
        }
        const [countSelect] = await CategoryLevel3.countSelect(filterStatus);
        if (
            filterStatus.nextBtn === "nextBtnClicked" &&
            filterStatus.pageStartItem + filterStatus.itemsPerPage < countSelect[0].totalRegister
        ) {
            filterStatus.currentPage++;
            filterStatus.pageStartItem = filterStatus.pageStartItem + filterStatus.itemsPerPage;
        }
        const [historicalPerspectives] = await CategoryLevel3.filterSelectHistoricalPerspectives();
        const [categoryLevel1List] = await CategoryLevel3.filterSelectCategoryLevel1();
        const [categoryLevel2List] = await CategoryLevel3.filterSelectCategoryLevel2();
        const [categoryLevel3List] = await CategoryLevel3.selectCategoryLevel3(filterStatus);
        const messages = { display: "d-none", alertType: "", textMessage: "Página " + filterStatus.currentPage + " selecionada." };
        return res.render("../views/cms/cms-CategoryLevel3-Q", {
            historicalPerspectives,
            categoryLevel1List,
            categoryLevel2List,
            categoryLevel3List,
            filterStatus,
            countSelect,
            messages,
        });
    },

    async loadInsertPage(req, res) {
        const [historicalPerspectives] = await CategoryLevel3.filterSelectHistoricalPerspectives();
        const [categoryLevel1List] = await CategoryLevel3.filterSelectCategoryLevel1();
        const [categoryLevel2List] = await CategoryLevel3.filterSelectCategoryLevel2();
        const messages = { display: "d-none", alertType: "", textMessage: "Página inserir carregada." };
        return res.render("../views/cms/cms-CategoryLevel3-C", {
            messages,
            historicalPerspectives,
            categoryLevel1List,
            categoryLevel2List,
        });
    },

    async insertCategoryLevel3Page(req, res) {
        const filterStatus = {
            status: 1,
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
            historicalPerspectiveFilter: "%",
            categoryLevel1Filter: "%",
            categoryLevel2Filter: "%",
        };
        const insert = await CategoryLevel3.insertCategoryLevel3({
            status: req.body.categoryLevel3Status,
            name: req.body.categoryLevel3Name,
            description: req.body.categoryLevel3Description,
            idHistoricalPerspective: req.body.id_HistoricalPerspective,
            idCategoryLevel2: req.body.id_CategoryLevel2,
        });
        const messages = { display: "", alertType: insert.alertTypeResult, textMessage: insert.textResult };
        const [historicalPerspectives] = await CategoryLevel3.filterSelectHistoricalPerspectives();
        const [categoryLevel1List] = await CategoryLevel3.filterSelectCategoryLevel1();
        const [categoryLevel2List] = await CategoryLevel3.filterSelectCategoryLevel2();
        const [categoryLevel3List] = await CategoryLevel3.selectCategoryLevel3(filterStatus);
        const [countSelect] = await CategoryLevel3.countSelect(filterStatus);
        return res.render("../views/cms/cms-CategoryLevel3-Q", {
            historicalPerspectives,
            categoryLevel1List,
            categoryLevel2List,
            categoryLevel3List,
            filterStatus,
            countSelect,
            messages,
        });
    },

    async level1Listener(req, res) {
        const { categoryLevel1Id } = req.body;
        const [categoryLevel2List] = await CategoryLevel3.getCategoryLevel2ByLevel1(categoryLevel1Id);
        res.json(categoryLevel2List);
    },

    async historicalPerspectiveListener(req, res) {
        const { historicalPerspectiveId } = req.body;
        const [categoryLevel1List] =
            await CategoryLevel3.getCategoryLevel1ByHistoricalPerspective(
                historicalPerspectiveId
            );
        res.json(categoryLevel1List);
    },

    async loadUpdatePage(req, res) {
        const categoryLevel3Id = req.params.id;
        const filterStatus = {
            status: "%",
            search: "%",
            currentPage: 1,
            itemsPerPage: 200,
            pageStartItem: 0,
            historicalPerspectiveFilter: "%",
            categoryLevel1Filter: "%",
            categoryLevel2Filter: "%",
        };
        const [historicalPerspectives] = await CategoryLevel3.filterSelectHistoricalPerspectives();
        const [categoryLevel1List] = await CategoryLevel3.filterSelectCategoryLevel1();
        const [categoryLevel2List] = await CategoryLevel3.filterSelectCategoryLevel2();
        const [categoryLevel3List] = await CategoryLevel3.selectCategoryLevel3(filterStatus);
        const categoryLevel3 = categoryLevel3List.find((item) => Number(item.id) === Number(categoryLevel3Id));
        if (!categoryLevel3) {
            return res.send("Category Level 3 not found");
        }
        return res.render("../views/cms/cms-CategoryLevel3-U", {
            categoryLevel3,
            historicalPerspectives,
            categoryLevel1List,
            categoryLevel2List,
        });
    },

    async updateCategoryLevel3Page(req, res) {
        const filterStatus = {
            status: 1,
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
            historicalPerspectiveFilter: "%",
            categoryLevel1Filter: "%",
            categoryLevel2Filter: "%",
        };
        const categoryLevel3Id = req.params.id;
        const update = await CategoryLevel3.updateCategoryLevel3(categoryLevel3Id, {
            status: req.body.categoryLevel3Status,
            name: req.body.categoryLevel3Name,
            description: req.body.categoryLevel3Description,
            idHistoricalPerspective: req.body.id_HistoricalPerspective,
            idCategoryLevel2: req.body.id_CategoryLevel2,
        });
        const messages = { display: "", alertType: update.alertTypeResult, textMessage: update.textResult };
        const [historicalPerspectives] = await CategoryLevel3.filterSelectHistoricalPerspectives();
        const [categoryLevel1List] = await CategoryLevel3.filterSelectCategoryLevel1();
        const [categoryLevel2List] = await CategoryLevel3.filterSelectCategoryLevel2();
        const [categoryLevel3List] = await CategoryLevel3.selectCategoryLevel3(filterStatus);
        const [countSelect] = await CategoryLevel3.countSelect(filterStatus);
        return res.render("../views/cms/cms-CategoryLevel3-Q", {
            historicalPerspectives,
            categoryLevel1List,
            categoryLevel2List,
            categoryLevel3List,
            filterStatus,
            countSelect,
            messages,
        });
    },

    async deleteCategoryLevel3Page(req, res) {
        const filterStatus = {
            status: "1",
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
            historicalPerspectiveFilter: "%",
            categoryLevel1Filter: "%",
            categoryLevel2Filter: "%",
        };
        const categoryLevel3Id = req.params.id;
        const deleted = await CategoryLevel3.deleteCategoryLevel3(categoryLevel3Id);
        const messages = { display: "", alertType: deleted.alertTypeResult, textMessage: deleted.textResult };
        const [historicalPerspectives] = await CategoryLevel3.filterSelectHistoricalPerspectives();
        const [categoryLevel1List] = await CategoryLevel3.filterSelectCategoryLevel1();
        const [categoryLevel2List] = await CategoryLevel3.filterSelectCategoryLevel2();
        const [categoryLevel3List] = await CategoryLevel3.selectCategoryLevel3(filterStatus);
        const [countSelect] = await CategoryLevel3.countSelect(filterStatus);
        return res.render("../views/cms/cms-CategoryLevel3-Q", {
            historicalPerspectives,
            categoryLevel1List,
            categoryLevel2List,
            categoryLevel3List,
            filterStatus,
            countSelect,
            messages,
        });
    },

    async filterCategoryLevel3Page(req, res) {
        const filterStatus = {
            status: Number(req.body.filterStatus),
            search: req.body.filterSearch,
            currentPage: 1,
            itemsPerPage: Number(req.body.itemsPerPageFilter),
            pageStartItem: 0,
            historicalPerspectiveFilter: req.body.historicalPerspectiveFilter,
            categoryLevel1Filter: req.body.categoryLevel1Filter,
            categoryLevel2Filter: req.body.categoryLevel2Filter,
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
        const messages = { display: "d-none", alertType: "", textMessage: "Filtro aplicado na tela de consulta." };
        const [historicalPerspectives] = await CategoryLevel3.filterSelectHistoricalPerspectives();
        const [categoryLevel1List] = await CategoryLevel3.filterSelectCategoryLevel1();
        const [categoryLevel2List] = await CategoryLevel3.filterSelectCategoryLevel2();
        const [categoryLevel3List] = await CategoryLevel3.selectCategoryLevel3(filterStatus);
        const [countSelect] = await CategoryLevel3.countSelect(filterStatus);
        return res.render("../views/cms/cms-CategoryLevel3-Q", {
            historicalPerspectives,
            categoryLevel1List,
            categoryLevel2List,
            categoryLevel3List,
            filterStatus,
            countSelect,
            messages,
        });
    },
};
