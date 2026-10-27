const HistoricalPerspective = require("../model/HistoricalPerspectiveModel");

module.exports = {
    //------------------------------------------------
    //                SHOW PAGE ROUTINE
    //------------------------------------------------

    async loadShowPage(req, res) {
        const filterStatus = {
            status: Number(1),
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
        };

        const [historicalPerspectives] =
            await HistoricalPerspective.selectHistoricalPerspectives(filterStatus);
        const [countSelect] = await HistoricalPerspective.countSelect(filterStatus);

        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Página inicial de consulta carregada.",
        };

        return res.render("../views/cms/cms-HistoricalPerspective-Q", {
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
        };

        if (filterStatus.prevBtn === "prevBtnClicked") {
            if (filterStatus.currentPage > 1) {
                filterStatus.currentPage--;
                filterStatus.pageStartItem =
                    filterStatus.pageStartItem - filterStatus.itemsPerPage;
            }
        }

        const [countSelect] = await HistoricalPerspective.countSelect(filterStatus);

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
            await HistoricalPerspective.selectHistoricalPerspectives(filterStatus);

        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Página " + filterStatus.currentPage + " selecionada.",
        };

        return res.render("../views/cms/cms-HistoricalPerspective-Q", {
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
        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Página inserir carregada.",
        };

        return res.render("../views/cms/cms-HistoricalPerspective-C", {
            messages,
        });
    },

    async insertHistoricalPerspectivePage(req, res) {
        const filterStatus = {
            status: 1,
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
        };

        const insert = await HistoricalPerspective.insertHistoricalPerspectives({
            historicalPerspectiveStatus: req.body.historicalPerspectiveStatus,
            historicalPerspectiveName: req.body.historicalPerspectiveName,
            historicalPerspectiveDescription:
                req.body.historicalPerspectiveDescription,
        });

        const messages = {
            display: "",
            alertType: insert.alertTypeResult,
            textMessage: insert.textResult,
        };

        const [historicalPerspectives] =
            await HistoricalPerspective.selectHistoricalPerspectives(filterStatus);
        const [countSelect] = await HistoricalPerspective.countSelect(filterStatus);

        return res.render("../views/cms/cms-HistoricalPerspective-Q", {
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
        const historicalPerspectiveId = req.params.id;
        const filterStatus = {
            status: "%",
            search: "%",
            currentPage: 1,
            itemsPerPage: 100,
            pageStartItem: 0,
        };

        const [historicalPerspectives] =
            await HistoricalPerspective.selectHistoricalPerspectives(filterStatus);

        const historicalPerspective = historicalPerspectives.find(
            (item) => Number(item.id) === Number(historicalPerspectiveId)
        );

        if (!historicalPerspective) {
            return res.send("Historical Perspective not found");
        }

        return res.render("../views/cms/cms-HistoricalPerspective-U", {
            historicalPerspective,
        });
    },

    async updateHistoricalPerspectivePage(req, res) {
        const filterStatus = {
            status: 1,
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
        };

        const historicalPerspectiveId = req.params.id;
        const updatedHistoricalPerspective = {
            historicalPerspectiveStatus: req.body.historicalPerspectiveStatus,
            historicalPerspectiveName: req.body.historicalPerspectiveName,
            historicalPerspectiveDescription:
                req.body.historicalPerspectiveDescription,
        };

        const update = await HistoricalPerspective.updateHistoricalPerspectives(
            historicalPerspectiveId,
            updatedHistoricalPerspective
        );

        const messages = {
            display: "",
            alertType: update.alertTypeResult,
            textMessage: update.textResult,
        };

        const [historicalPerspectives] =
            await HistoricalPerspective.selectHistoricalPerspectives(filterStatus);
        const [countSelect] = await HistoricalPerspective.countSelect(filterStatus);

        return res.render("../views/cms/cms-HistoricalPerspective-Q", {
            historicalPerspectives,
            filterStatus,
            countSelect,
            messages,
        });
    },

    //------------------------------------------------
    //                DELETE ROUTINE
    //------------------------------------------------

    async deleteHistoricalPerspectivePage(req, res) {
        const filterStatus = {
            status: "1",
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
        };

        const historicalPerspectiveId = req.params.id;
        const deleted = await HistoricalPerspective.deleteHistoricalPerspectives(
            historicalPerspectiveId
        );

        const messages = {
            display: "",
            alertType: deleted.alertTypeResult,
            textMessage: deleted.textResult,
        };

        const [historicalPerspectives] =
            await HistoricalPerspective.selectHistoricalPerspectives(filterStatus);
        const [countSelect] = await HistoricalPerspective.countSelect(filterStatus);

        return res.render("../views/cms/cms-HistoricalPerspective-Q", {
            historicalPerspectives,
            filterStatus,
            countSelect,
            messages,
        });
    },

    //------------------------------------------------
    //               FILTER ROUTINE
    //------------------------------------------------

    async filterHistoricalPerspectivePage(req, res) {
        const filterStatus = {
            status: Number(req.body.filterStatus),
            search: req.body.filterSearch,
            currentPage: 1,
            itemsPerPage: Number(req.body.itemsPerPageFilter),
            pageStartItem: 0,
        };

        if (filterStatus.status === Number(2)) {
            filterStatus.status = "%";
        }
        if (filterStatus.search === "") {
            filterStatus.search = "%";
        }

        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Filtro aplicado na tela de consulta.",
        };

        const [historicalPerspectives] =
            await HistoricalPerspective.selectHistoricalPerspectives(filterStatus);
        const [countSelect] = await HistoricalPerspective.countSelect(filterStatus);

        return res.render("../views/cms/cms-HistoricalPerspective-Q", {
            historicalPerspectives,
            filterStatus,
            countSelect,
            messages,
        });
    },
};
