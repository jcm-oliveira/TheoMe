const Category = require("../model/CategoryModel");
console.log("CategoryController file starts...");

module.exports = {
    //------------------------------------------------
    //                SHOW PAGE ROUTINE
    //------------------------------------------------

    async loadShowPage(req, res) {
        const filterStatus = {
            status: 1,
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
            historicalPerspectiveFilter: "%",
        };

        const [historicalPerspectives] =
            await Category.filterSelectHistoricalPerspectives(filterStatus);
        const [categories] = await Category.selectCategories(filterStatus);
        const [countSelect] = await Category.countSelect(filterStatus);

        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Página inicial de consulta carregada.",
        };

        return res.render("../views/cms/cms-Category-Q", {
            categories,
            historicalPerspectives,
            filterStatus,
            countSelect,
            messages,
        });
    },

    //------------------------------------------------
    //              PAGINATION CONTROL
    //------------------------------------------------

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
        };

        if (filterStatus.prevBtn === "prevBtnClicked") {
            if (filterStatus.currentPage > 1) {
                filterStatus.currentPage--;
                filterStatus.pageStartItem =
                    filterStatus.pageStartItem - filterStatus.itemsPerPage;
            }
        }

        const [countSelect] = await Category.countSelect(filterStatus);

        if (filterStatus.nextBtn === "nextBtnClicked") {
            if (
                filterStatus.pageStartItem + filterStatus.itemsPerPage <
                countSelect[0].totalRegister
            ) {
                filterStatus.currentPage++;
                filterStatus.pageStartItem =
                    filterStatus.pageStartItem + filterStatus.itemsPerPage;
            }
        }

        const [historicalPerspectives] =
            await Category.filterSelectHistoricalPerspectives(filterStatus);
        const [categories] = await Category.selectCategories(filterStatus);

        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Página " + filterStatus.currentPage + " selecionada.",
        };

        return res.render("../views/cms/cms-Category-Q", {
            categories,
            historicalPerspectives,
            filterStatus,
            countSelect,
            messages,
        });
    },

    //------------------------------------------------
    //                 INSERT ROUTINE
    //------------------------------------------------

    async loadInsertPage(req, res) {
        const filterStatus = {
            status: 1,
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
            historicalPerspectiveFilter: "%",
        };

        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Página inserir carregada.",
        };

        const [historicalPerspectives] =
            await Category.filterSelectHistoricalPerspectives(filterStatus);
        return res.render("../views/cms/cms-Category-C", {
            messages,
            historicalPerspectives,
        });
    },

    async insertCategoryPage(req, res) {
        const filterStatus = {
            status: 1,
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
            historicalPerspectiveFilter: "%",
        };

        const insert = await Category.insertCategories({
            categoryStatus: req.body.categoryStatus,
            categoryName: req.body.categoryName,
            categoryDescription: req.body.categoryDescription,
            categoryIdHistoricalPerspective: req.body.id_HistoricalPerspective,
        });

        const messages = {
            display: "",
            alertType: insert.alertTypeResult,
            textMessage: insert.textResult,
        };

        const [historicalPerspectives] =
            await Category.filterSelectHistoricalPerspectives(filterStatus);
        const [categories] = await Category.selectCategories(filterStatus);
        const [countSelect] = await Category.countSelect(filterStatus);

        return res.render("../views/cms/cms-Category-Q", {
            categories,
            historicalPerspectives,
            filterStatus,
            countSelect,
            messages,
        });
    },

    //------------------------------------------------
    //                 UPDATE ROUTINE
    //------------------------------------------------

    async loadUpdatePage(req, res) {
        const categoryId = req.params.id;
        const filterStatus = {
            status: "%",
            search: "%",
            currentPage: 1,
            itemsPerPage: 100,
            pageStartItem: 0,
            historicalPerspectiveFilter: "%",
        };

        const [historicalPerspectives] =
            await Category.filterSelectHistoricalPerspectives(filterStatus);
        const [categories] = await Category.selectCategories(filterStatus);

        const category = categories.find(
            (categoryItem) => Number(categoryItem.id) === Number(categoryId)
        );

        if (!category) {
            return res.send("Category not found");
        }

        return res.render("../views/cms/cms-Category-U", {
            category,
            historicalPerspectives,
        });
    },

    async updateCategoryPage(req, res) {
        const filterStatus = {
            status: 1,
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
            historicalPerspectiveFilter: "%",
        };

        const categoryId = req.params.id;
        const updatedCategory = {
            categoryStatus: req.body.categoryStatus,
            categoryName: req.body.categoryName,
            categoryDescription: req.body.categoryDescription,
            categoryIdHistoricalPerspective: req.body.id_HistoricalPerspective,
        };

        const update = await Category.updateCategories(categoryId, updatedCategory);

        const messages = {
            display: "",
            alertType: update.alertTypeResult,
            textMessage: update.textResult,
        };

        const [historicalPerspectives] =
            await Category.filterSelectHistoricalPerspectives(filterStatus);
        const [categories] = await Category.selectCategories(filterStatus);
        const [countSelect] = await Category.countSelect(filterStatus);

        return res.render("../views/cms/cms-Category-Q", {
            categories,
            historicalPerspectives,
            filterStatus,
            countSelect,
            messages,
        });
    },

    //------------------------------------------------
    //                DELETE ROUTINE
    //------------------------------------------------

    async deleteCategoryPage(req, res) {
        const filterStatus = {
            status: "1",
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
            historicalPerspectiveFilter: "%",
        };

        const categoryId = req.params.id;
        const deleted = await Category.deleteCategories(categoryId);

        const messages = {
            display: "",
            alertType: deleted.alertTypeResult,
            textMessage: deleted.textResult,
        };

        const [historicalPerspectives] =
            await Category.filterSelectHistoricalPerspectives(filterStatus);
        const [categories] = await Category.selectCategories(filterStatus);
        const [countSelect] = await Category.countSelect(filterStatus);

        return res.render("../views/cms/cms-Category-Q", {
            categories,
            historicalPerspectives,
            filterStatus,
            countSelect,
            messages,
        });
    },

    //------------------------------------------------
    //               FILTER ROUTINE
    //------------------------------------------------

    async filterCategoryPage(req, res) {
        const filterStatus = {
            status: Number(req.body.filterStatus),
            search: req.body.filterSearch,
            currentPage: 1,
            itemsPerPage: Number(req.body.itemsPerPageFilter),
            pageStartItem: 0,
            historicalPerspectiveFilter: req.body.historicalPerspectiveFilter,
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

        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Filtro aplicado na tela de consulta.",
        };

        const [historicalPerspectives] =
            await Category.filterSelectHistoricalPerspectives(filterStatus);
        const [categories] = await Category.selectCategories(filterStatus);
        const [countSelect] = await Category.countSelect(filterStatus);

        return res.render("../views/cms/cms-Category-Q", {
            categories,
            historicalPerspectives,
            filterStatus,
            countSelect,
            messages,
        });
    },
};
