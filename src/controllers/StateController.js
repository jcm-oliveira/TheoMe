const State = require("../model/StateModel");
console.log("StateController file starts...");

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
            continentFilter: "%",
            countryFilter: "%",
            regionFilter: "%",
        };

        const [continents] = await State.filterSelectContinents(filterStatus);
        const [countries] = await State.filterSelectCountries(filterStatus);
        const [regions] = await State.filterSelectRegions(filterStatus);
        const [states] = await State.selectStates(filterStatus);
        const [countSelect] = await State.countSelect(filterStatus);

        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Página inicial de consulta carregada.",
        };

        return res.render("../views/cms/cms-State-Q", {
            filterStatus,
            countSelect,
            messages,
            continents,
            countries,
            regions,
            states,
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
            continentFilter: req.body.continentFilter,
            countryFilter: req.body.countryFilter,
            regionFilter: req.body.regionFilter,
        };

        if (filterStatus.prevBtn === "prevBtnClicked") {
            if (filterStatus.currentPage > 1) {
                filterStatus.currentPage--;
                filterStatus.pageStartItem =
                    filterStatus.pageStartItem - filterStatus.itemsPerPage;
            }
        }

        const [countSelect] = await State.countSelect(filterStatus);

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

        const [continents] = await State.filterSelectContinents(filterStatus);
        const [countries] = await State.filterSelectCountries(filterStatus);
        const [regions] = await State.filterSelectRegions(filterStatus);
        const [states] = await State.selectStates(filterStatus);

        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Página " + filterStatus.currentPage + " selecionada.",
        };

        return res.render("../views/cms/cms-State-Q", {
            filterStatus,
            countSelect,
            messages,
            continents,
            countries,
            regions,
            states,
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
            continentFilter: "%",
            countryFilter: "%",
            regionFilter: "%",
        };

        const [continents] = await State.filterSelectContinents(filterStatus);
        const [countries] = await State.filterSelectCountries(filterStatus);
        const [regions] = await State.filterSelectRegions(filterStatus);

        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Página inserir carregada.",
        };

        return res.render("../views/cms/cms-State-C", {
            messages,
            continents,
            countries,
            regions,
        });
    },

    async insertStatePage(req, res) {
        const filterStatus = {
            status: 1,
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
            continentFilter: "%",
            countryFilter: "%",
            regionFilter: "%",
        };

        const insert = await State.insertStates({
            stateName: req.body.stateName,
            stateDescription: req.body.stateDescription,
            stateIdRegion: req.body.id_Region,
            stateStatus: req.body.stateStatus,
        });

        const messages = {
            display: "",
            alertType: insert.alertTypeResult,
            textMessage: insert.textResult,
        };

        const [continents] = await State.filterSelectContinents(filterStatus);
        const [countries] = await State.filterSelectCountries(filterStatus);
        const [regions] = await State.filterSelectRegions(filterStatus);
        const [states] = await State.selectStates(filterStatus);
        const [countSelect] = await State.countSelect(filterStatus);

        return res.render("../views/cms/cms-State-Q", {
            filterStatus,
            countSelect,
            messages,
            continents,
            countries,
            regions,
            states,
        });
    },

    async continentListener(req, res) {
        const { continentId } = req.body;
        const [countries] = await State.getCountriesByContinent(continentId);
        res.json(countries);
    },

    async countryListener(req, res) {
        const { countryId } = req.body;
        const [regions] = await State.getRegionsByCountry(countryId);
        res.json(regions);
    },

    //------------------------------------------------
    //                 UPDATE ROUTINE
    //------------------------------------------------

    async loadUpdatePage(req, res) {
        const stateId = req.params.id;
        const filterStatus = {
            status: "%",
            search: "%",
            currentPage: 1,
            itemsPerPage: 100,
            pageStartItem: 0,
            continentFilter: "%",
            countryFilter: "%",
            regionFilter: "%",
        };

        const [continents] = await State.filterSelectContinents(filterStatus);
        const [countries] = await State.filterSelectCountries(filterStatus);
        const [regions] = await State.filterSelectRegions(filterStatus);
        const [states] = await State.selectStates(filterStatus);

        const state = states.find(
            (stateItem) => Number(stateItem.id) === Number(stateId)
        );

        if (!state) {
            return res.send("State not found");
        }

        return res.render("../views/cms/cms-State-U", {
            state,
            continents,
            countries,
            regions,
        });
    },

    async updateStatePage(req, res) {
        const filterStatus = {
            status: 1,
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
            continentFilter: "%",
            countryFilter: "%",
            regionFilter: "%",
        };

        const stateId = req.params.id;
        const updatedState = {
            stateStatus: req.body.stateStatus,
            stateName: req.body.stateName,
            stateDescription: req.body.stateDescription,
            stateIdRegion: req.body.id_Region,
        };

        const update = await State.updateStates(stateId, updatedState);

        const messages = {
            display: "",
            alertType: update.alertTypeResult,
            textMessage: update.textResult,
        };

        const [continents] = await State.filterSelectContinents(filterStatus);
        const [countries] = await State.filterSelectCountries(filterStatus);
        const [regions] = await State.filterSelectRegions(filterStatus);
        const [states] = await State.selectStates(filterStatus);
        const [countSelect] = await State.countSelect(filterStatus);

        return res.render("../views/cms/cms-State-Q", {
            filterStatus,
            countSelect,
            messages,
            continents,
            countries,
            regions,
            states,
        });
    },

    //------------------------------------------------
    //                DELETE ROUTINE
    //------------------------------------------------

    async deleteStatePage(req, res) {
        const filterStatus = {
            status: "1",
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
            continentFilter: "%",
            countryFilter: "%",
            regionFilter: "%",
        };

        const stateId = req.params.id;
        const deleted = await State.deleteStates(stateId);

        const messages = {
            display: "",
            alertType: deleted.alertTypeResult,
            textMessage: deleted.textResult,
        };

        const [continents] = await State.filterSelectContinents(filterStatus);
        const [countries] = await State.filterSelectCountries(filterStatus);
        const [regions] = await State.filterSelectRegions(filterStatus);
        const [states] = await State.selectStates(filterStatus);
        const [countSelect] = await State.countSelect(filterStatus);

        return res.render("../views/cms/cms-State-Q", {
            filterStatus,
            countSelect,
            messages,
            continents,
            countries,
            regions,
            states,
        });
    },

    //------------------------------------------------
    //               FILTER ROUTINE
    //------------------------------------------------

    async filterStatePage(req, res) {
        const filterStatus = {
            status: Number(req.body.filterStatus),
            search: req.body.filterSearch,
            currentPage: 1,
            itemsPerPage: Number(req.body.itemsPerPageFilter),
            pageStartItem: 0,
            continentFilter: req.body.continentFilter,
            countryFilter: req.body.countryFilter,
            regionFilter: req.body.regionFilter,
        };

        if (filterStatus.status === Number(2)) {
            filterStatus.status = "%";
        }
        if (filterStatus.search === "") {
            filterStatus.search = "%";
        }
        if (filterStatus.continentFilter === "0") {
            filterStatus.continentFilter = "%";
        }
        if (filterStatus.countryFilter === "0") {
            filterStatus.countryFilter = "%";
        }
        if (filterStatus.regionFilter === "0") {
            filterStatus.regionFilter = "%";
        }

        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Filtro aplicado na tela de consulta.",
        };

        const [continents] = await State.filterSelectContinents(filterStatus);
        const [countries] = await State.filterSelectCountries(filterStatus);
        const [regions] = await State.filterSelectRegions(filterStatus);
        const [states] = await State.selectStates(filterStatus);
        const [countSelect] = await State.countSelect(filterStatus);

        return res.render("../views/cms/cms-State-Q", {
            filterStatus,
            countSelect,
            messages,
            continents,
            countries,
            regions,
            states,
        });
    },
};

