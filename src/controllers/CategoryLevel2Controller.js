const CategoryLevel2 = require("../model/CategoryLevel2Model");

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
        };
        const [historicalPerspectives] = await CategoryLevel2.filterSelectHistoricalPerspectives();
        const [categoryLevel1List] = await CategoryLevel2.filterSelectCategoryLevel1();
        const [categoryLevel2List] = await CategoryLevel2.selectCategoryLevel2(filterStatus);
        const [countSelect] = await CategoryLevel2.countSelect(filterStatus);
        const messages = { display: "d-none", alertType: "", textMessage: "Página inicial de consulta carregada." };
        return res.render("../views/cms/cms-CategoryLevel2-Q", {
            historicalPerspectives,
            categoryLevel1List,
            categoryLevel2List,
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
        };
        if (filterStatus.prevBtn === "prevBtnClicked" && filterStatus.currentPage > 1) {
            filterStatus.currentPage--;
            filterStatus.pageStartItem = filterStatus.pageStartItem - filterStatus.itemsPerPage;
        }
        const [countSelect] = await CategoryLevel2.countSelect(filterStatus);
        if (
            filterStatus.nextBtn === "nextBtnClicked" &&
            filterStatus.pageStartItem + filterStatus.itemsPerPage < countSelect[0].totalRegister
        ) {
            filterStatus.currentPage++;
            filterStatus.pageStartItem = filterStatus.pageStartItem + filterStatus.itemsPerPage;
        }
        const [historicalPerspectives] = await CategoryLevel2.filterSelectHistoricalPerspectives();
        const [categoryLevel1List] = await CategoryLevel2.filterSelectCategoryLevel1();
        const [categoryLevel2List] = await CategoryLevel2.selectCategoryLevel2(filterStatus);
        const messages = { display: "d-none", alertType: "", textMessage: "Página " + filterStatus.currentPage + " selecionada." };
        return res.render("../views/cms/cms-CategoryLevel2-Q", {
            historicalPerspectives,
            categoryLevel1List,
            categoryLevel2List,
            filterStatus,
            countSelect,
            messages,
        });
    },

    async loadInsertPage(req, res) {
        const [historicalPerspectives] = await CategoryLevel2.filterSelectHistoricalPerspectives();
        const [categoryLevel1List] = await CategoryLevel2.filterSelectCategoryLevel1();
        const messages = { display: "d-none", alertType: "", textMessage: "Página inserir carregada." };
        return res.render("../views/cms/cms-CategoryLevel2-C", {
            messages,
            historicalPerspectives,
            categoryLevel1List,
        });
    },

    async insertCategoryLevel2Page(req, res) {
        const filterStatus = {
            status: 1,
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
            historicalPerspectiveFilter: "%",
            categoryLevel1Filter: "%",
        };
        const insert = await CategoryLevel2.insertCategoryLevel2({
            status: req.body.categoryLevel2Status,
            name: req.body.categoryLevel2Name,
            description: req.body.categoryLevel2Description,
            idHistoricalPerspective: req.body.id_HistoricalPerspective,
            idCategoryLevel1: req.body.id_CategoryLevel1,
        });
        const messages = { display: "", alertType: insert.alertTypeResult, textMessage: insert.textResult };
        const [historicalPerspectives] = await CategoryLevel2.filterSelectHistoricalPerspectives();
        const [categoryLevel1List] = await CategoryLevel2.filterSelectCategoryLevel1();
        const [categoryLevel2List] = await CategoryLevel2.selectCategoryLevel2(filterStatus);
        const [countSelect] = await CategoryLevel2.countSelect(filterStatus);
        return res.render("../views/cms/cms-CategoryLevel2-Q", {
            historicalPerspectives,
            categoryLevel1List,
            categoryLevel2List,
            filterStatus,
            countSelect,
            messages,
        });
    },

    async historicalPerspectiveListener(req, res) {
        const { historicalPerspectiveId } = req.body;
        const [categoryLevel1List] =
            await CategoryLevel2.getCategoryLevel1ByHistoricalPerspective(
                historicalPerspectiveId
            );
        res.json(categoryLevel1List);
    },

    async loadUpdatePage(req, res) {
        const categoryLevel2Id = req.params.id;
        const filterStatus = {
            status: "%",
            search: "%",
            currentPage: 1,
            itemsPerPage: 200,
            pageStartItem: 0,
            historicalPerspectiveFilter: "%",
            categoryLevel1Filter: "%",
        };
        const [historicalPerspectives] = await CategoryLevel2.filterSelectHistoricalPerspectives();
        const [categoryLevel1List] = await CategoryLevel2.filterSelectCategoryLevel1();
        const [categoryLevel2List] = await CategoryLevel2.selectCategoryLevel2(filterStatus);
        const categoryLevel2 = categoryLevel2List.find((item) => Number(item.id) === Number(categoryLevel2Id));
        if (!categoryLevel2) {
            return res.send("Category Level 2 not found");
        }
        return res.render("../views/cms/cms-CategoryLevel2-U", {
            categoryLevel2,
            historicalPerspectives,
            categoryLevel1List,
        });
    },

    async updateCategoryLevel2Page(req, res) {
        const filterStatus = {
            status: 1,
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
            historicalPerspectiveFilter: "%",
            categoryLevel1Filter: "%",
        };
        const categoryLevel2Id = req.params.id;
        const update = await CategoryLevel2.updateCategoryLevel2(categoryLevel2Id, {
            status: req.body.categoryLevel2Status,
            name: req.body.categoryLevel2Name,
            description: req.body.categoryLevel2Description,
            idHistoricalPerspective: req.body.id_HistoricalPerspective,
            idCategoryLevel1: req.body.id_CategoryLevel1,
        });
        const messages = { display: "", alertType: update.alertTypeResult, textMessage: update.textResult };
        const [historicalPerspectives] = await CategoryLevel2.filterSelectHistoricalPerspectives();
        const [categoryLevel1List] = await CategoryLevel2.filterSelectCategoryLevel1();
        const [categoryLevel2List] = await CategoryLevel2.selectCategoryLevel2(filterStatus);
        const [countSelect] = await CategoryLevel2.countSelect(filterStatus);
        return res.render("../views/cms/cms-CategoryLevel2-Q", {
            historicalPerspectives,
            categoryLevel1List,
            categoryLevel2List,
            filterStatus,
            countSelect,
            messages,
        });
    },

    async deleteCategoryLevel2Page(req, res) {
        const filterStatus = {
            status: "1",
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
            historicalPerspectiveFilter: "%",
            categoryLevel1Filter: "%",
        };
        const categoryLevel2Id = req.params.id;
        const deleted = await CategoryLevel2.deleteCategoryLevel2(categoryLevel2Id);
        const messages = { display: "", alertType: deleted.alertTypeResult, textMessage: deleted.textResult };
        const [historicalPerspectives] = await CategoryLevel2.filterSelectHistoricalPerspectives();
        const [categoryLevel1List] = await CategoryLevel2.filterSelectCategoryLevel1();
        const [categoryLevel2List] = await CategoryLevel2.selectCategoryLevel2(filterStatus);
        const [countSelect] = await CategoryLevel2.countSelect(filterStatus);
        return res.render("../views/cms/cms-CategoryLevel2-Q", {
            historicalPerspectives,
            categoryLevel1List,
            categoryLevel2List,
            filterStatus,
            countSelect,
            messages,
        });
    },

    async filterCategoryLevel2Page(req, res) {
        const filterStatus = {
            status: Number(req.body.filterStatus),
            search: req.body.filterSearch,
            currentPage: 1,
            itemsPerPage: Number(req.body.itemsPerPageFilter),
            pageStartItem: 0,
            historicalPerspectiveFilter: req.body.historicalPerspectiveFilter,
            categoryLevel1Filter: req.body.categoryLevel1Filter,
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
        const messages = { display: "d-none", alertType: "", textMessage: "Filtro aplicado na tela de consulta." };
        const [historicalPerspectives] = await CategoryLevel2.filterSelectHistoricalPerspectives();
        const [categoryLevel1List] = await CategoryLevel2.filterSelectCategoryLevel1();
        const [categoryLevel2List] = await CategoryLevel2.selectCategoryLevel2(filterStatus);
        const [countSelect] = await CategoryLevel2.countSelect(filterStatus);
        return res.render("../views/cms/cms-CategoryLevel2-Q", {
            historicalPerspectives,
            categoryLevel1List,
            categoryLevel2List,
            filterStatus,
            countSelect,
            messages,
        });
    },
};
