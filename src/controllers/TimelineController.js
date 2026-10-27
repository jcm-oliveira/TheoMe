const Timeline = require("../model/TimelineModel");

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
            await Timeline.filterSelectHistoricalPerspectives(filterStatus);
        const [timelines] = await Timeline.selectTimelines(filterStatus);
        const [countSelect] = await Timeline.countSelect(filterStatus);

        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Página inicial de consulta carregada.",
        };

        return res.render("../views/cms/cms-Timeline-Q", {
            timelines,
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

        const [countSelect] = await Timeline.countSelect(filterStatus);

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
            await Timeline.filterSelectHistoricalPerspectives(filterStatus);
        const [timelines] = await Timeline.selectTimelines(filterStatus);

        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Página " + filterStatus.currentPage + " selecionada.",
        };

        return res.render("../views/cms/cms-Timeline-Q", {
            timelines,
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

        const [historicalPerspectives] =
            await Timeline.filterSelectHistoricalPerspectives(filterStatus);

        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Página inserir carregada.",
        };

        return res.render("../views/cms/cms-Timeline-C", {
            messages,
            historicalPerspectives,
        });
    },

    async insertTimelinePage(req, res) {
        const filterStatus = {
            status: 1,
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
            historicalPerspectiveFilter: "%",
        };

        const insert = await Timeline.insertTimelines({
            timelineStatus: req.body.timelineStatus,
            timelineName: req.body.timelineName,
            timelineDescription: req.body.timelineDescription,
            timelineIdHistoricalPerspective: req.body.id_HistoricalPerspective,
            timelineVisualization: req.body.timelineVisualization,
            timelineBackgroundColor: req.body.timelineBackgroundColor,
            timelineIcon: req.body.timelineIcon,
        });

        const messages = {
            display: "",
            alertType: insert.alertTypeResult,
            textMessage: insert.textResult,
        };

        const [historicalPerspectives] =
            await Timeline.filterSelectHistoricalPerspectives(filterStatus);
        const [timelines] = await Timeline.selectTimelines(filterStatus);
        const [countSelect] = await Timeline.countSelect(filterStatus);

        return res.render("../views/cms/cms-Timeline-Q", {
            timelines,
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
        const timelineId = req.params.id;
        const [historicalPerspectives] =
            await Timeline.filterSelectHistoricalPerspectives();
        const [timelineSelect] = await Timeline.selectTimelineById(timelineId);
        const timeline = timelineSelect[0];

        if (!timeline) {
            return res.send("Timeline not found");
        }

        return res.render("../views/cms/cms-Timeline-U", {
            timeline,
            historicalPerspectives,
        });
    },

    async updateTimelinePage(req, res) {
        const filterStatus = {
            status: 1,
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
            historicalPerspectiveFilter: "%",
        };

        const timelineId = req.params.id;
        const update = await Timeline.updateTimelines(timelineId, {
            timelineStatus: req.body.timelineStatus,
            timelineName: req.body.timelineName,
            timelineDescription: req.body.timelineDescription,
            timelineIdHistoricalPerspective: req.body.id_HistoricalPerspective,
            timelineVisualization: req.body.timelineVisualization,
            timelineBackgroundColor: req.body.timelineBackgroundColor,
            timelineIcon: req.body.timelineIcon,
        });

        const messages = {
            display: "",
            alertType: update.alertTypeResult,
            textMessage: update.textResult,
        };

        const [historicalPerspectives] =
            await Timeline.filterSelectHistoricalPerspectives(filterStatus);
        const [timelines] = await Timeline.selectTimelines(filterStatus);
        const [countSelect] = await Timeline.countSelect(filterStatus);

        return res.render("../views/cms/cms-Timeline-Q", {
            timelines,
            historicalPerspectives,
            filterStatus,
            countSelect,
            messages,
        });
    },

    //------------------------------------------------
    //                DELETE ROUTINE
    //------------------------------------------------

    async deleteTimelinePage(req, res) {
        const filterStatus = {
            status: "1",
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
            historicalPerspectiveFilter: "%",
        };

        const timelineId = req.params.id;
        const deleted = await Timeline.deleteTimelines(timelineId);

        const messages = {
            display: "",
            alertType: deleted.alertTypeResult,
            textMessage: deleted.textResult,
        };

        const [historicalPerspectives] =
            await Timeline.filterSelectHistoricalPerspectives(filterStatus);
        const [timelines] = await Timeline.selectTimelines(filterStatus);
        const [countSelect] = await Timeline.countSelect(filterStatus);

        return res.render("../views/cms/cms-Timeline-Q", {
            timelines,
            historicalPerspectives,
            filterStatus,
            countSelect,
            messages,
        });
    },

    //------------------------------------------------
    //               FILTER ROUTINE
    //------------------------------------------------

    async filterTimelinePage(req, res) {
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
            await Timeline.filterSelectHistoricalPerspectives(filterStatus);
        const [timelines] = await Timeline.selectTimelines(filterStatus);
        const [countSelect] = await Timeline.countSelect(filterStatus);

        return res.render("../views/cms/cms-Timeline-Q", {
            timelines,
            historicalPerspectives,
            filterStatus,
            countSelect,
            messages,
        });
    },
};
