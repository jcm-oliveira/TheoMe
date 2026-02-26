const City = require("../model/CityModel");
console.log("CityController file starts...");

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
            stateFilter: "%",
        };

        const [continents] = await City.filterSelectContinents(filterStatus);
        const [countries] = await City.filterSelectCountries(filterStatus);
        const [regions] = await City.filterSelectRegions(filterStatus);
        const [states] = await City.filterSelectStates(filterStatus);
        const [cities] = await City.selectCities(filterStatus);
        const [countSelect] = await City.countSelect(filterStatus);

        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Página inicial de consulta carregada.",
        };

        return res.render("../views/cms/cms-City-Q", {
            filterStatus,
            countSelect,
            messages,
            continents,
            countries,
            regions,
            states,
            cities,
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
            stateFilter: req.body.stateFilter,
        };

        if (filterStatus.prevBtn === "prevBtnClicked") {
            if (filterStatus.currentPage > 1) {
                filterStatus.currentPage--;
                filterStatus.pageStartItem =
                    filterStatus.pageStartItem - filterStatus.itemsPerPage;
            }
        }

        const [countSelect] = await City.countSelect(filterStatus);

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

        const [continents] = await City.filterSelectContinents(filterStatus);
        const [countries] = await City.filterSelectCountries(filterStatus);
        const [regions] = await City.filterSelectRegions(filterStatus);
        const [states] = await City.filterSelectStates(filterStatus);
        const [cities] = await City.selectCities(filterStatus);

        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Página " + filterStatus.currentPage + " selecionada.",
        };

        return res.render("../views/cms/cms-City-Q", {
            filterStatus,
            countSelect,
            messages,
            continents,
            countries,
            regions,
            states,
            cities,
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
            stateFilter: "%",
        };

        const [continents] = await City.filterSelectContinents(filterStatus);
        const [countries] = await City.filterSelectCountries(filterStatus);
        const [regions] = await City.filterSelectRegions(filterStatus);
        const [states] = await City.filterSelectStates(filterStatus);

        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Página inserir carregada.",
        };

        return res.render("../views/cms/cms-City-C", {
            messages,
            continents,
            countries,
            regions,
            states,
        });
    },

    async insertCityPage(req, res) {
        const filterStatus = {
            status: 1,
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
            continentFilter: "%",
            countryFilter: "%",
            regionFilter: "%",
            stateFilter: "%",
        };

        const insert = await City.insertCities({
            cityName: req.body.cityName,
            cityDescription: req.body.cityDescription,
            cityIdState: req.body.id_State,
            cityStatus: req.body.cityStatus,
        });

        const messages = {
            display: "",
            alertType: insert.alertTypeResult,
            textMessage: insert.textResult,
        };

        const [continents] = await City.filterSelectContinents(filterStatus);
        const [countries] = await City.filterSelectCountries(filterStatus);
        const [regions] = await City.filterSelectRegions(filterStatus);
        const [states] = await City.filterSelectStates(filterStatus);
        const [cities] = await City.selectCities(filterStatus);
        const [countSelect] = await City.countSelect(filterStatus);

        return res.render("../views/cms/cms-City-Q", {
            filterStatus,
            countSelect,
            messages,
            continents,
            countries,
            regions,
            states,
            cities,
        });
    },

    async continentListener(req, res) {
        const { continentId } = req.body;
        const [countries] = await City.getCountriesByContinent(continentId);
        res.json(countries);
    },

    async countryListener(req, res) {
        const { countryId } = req.body;
        const [regions] = await City.getRegionsByCountry(countryId);
        res.json(regions);
    },

    async regionListener(req, res) {
        const { regionId } = req.body;
        const [states] = await City.getStatesByRegion(regionId);
        res.json(states);
    },

    //------------------------------------------------
    //                 UPDATE ROUTINE
    //------------------------------------------------

    async loadUpdatePage(req, res) {
        const cityId = req.params.id;
        const filterStatus = {
            status: "%",
            search: "%",
            currentPage: 1,
            itemsPerPage: 100,
            pageStartItem: 0,
            continentFilter: "%",
            countryFilter: "%",
            regionFilter: "%",
            stateFilter: "%",
        };

        const [continents] = await City.filterSelectContinents(filterStatus);
        const [countries] = await City.filterSelectCountries(filterStatus);
        const [regions] = await City.filterSelectRegions(filterStatus);
        const [states] = await City.filterSelectStates(filterStatus);
        const [cities] = await City.selectCities(filterStatus);

        const city = cities.find(
            (cityItem) => Number(cityItem.id) === Number(cityId)
        );

        if (!city) {
            return res.send("City not found");
        }

        return res.render("../views/cms/cms-City-U", {
            city,
            continents,
            countries,
            regions,
            states,
        });
    },

    async updateCityPage(req, res) {
        const filterStatus = {
            status: 1,
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
            continentFilter: "%",
            countryFilter: "%",
            regionFilter: "%",
            stateFilter: "%",
        };

        const cityId = req.params.id;
        const updatedCity = {
            cityStatus: req.body.cityStatus,
            cityName: req.body.cityName,
            cityDescription: req.body.cityDescription,
            cityIdState: req.body.id_State,
        };

        const update = await City.updateCities(cityId, updatedCity);

        const messages = {
            display: "",
            alertType: update.alertTypeResult,
            textMessage: update.textResult,
        };

        const [continents] = await City.filterSelectContinents(filterStatus);
        const [countries] = await City.filterSelectCountries(filterStatus);
        const [regions] = await City.filterSelectRegions(filterStatus);
        const [states] = await City.filterSelectStates(filterStatus);
        const [cities] = await City.selectCities(filterStatus);
        const [countSelect] = await City.countSelect(filterStatus);

        return res.render("../views/cms/cms-City-Q", {
            filterStatus,
            countSelect,
            messages,
            continents,
            countries,
            regions,
            states,
            cities,
        });
    },

    //------------------------------------------------
    //                DELETE ROUTINE
    //------------------------------------------------

    async deleteCityPage(req, res) {
        const filterStatus = {
            status: "1",
            search: "%",
            currentPage: 1,
            itemsPerPage: 10,
            pageStartItem: 0,
            continentFilter: "%",
            countryFilter: "%",
            regionFilter: "%",
            stateFilter: "%",
        };

        const cityId = req.params.id;
        const deleted = await City.deleteCities(cityId);

        const messages = {
            display: "",
            alertType: deleted.alertTypeResult,
            textMessage: deleted.textResult,
        };

        const [continents] = await City.filterSelectContinents(filterStatus);
        const [countries] = await City.filterSelectCountries(filterStatus);
        const [regions] = await City.filterSelectRegions(filterStatus);
        const [states] = await City.filterSelectStates(filterStatus);
        const [cities] = await City.selectCities(filterStatus);
        const [countSelect] = await City.countSelect(filterStatus);

        return res.render("../views/cms/cms-City-Q", {
            filterStatus,
            countSelect,
            messages,
            continents,
            countries,
            regions,
            states,
            cities,
        });
    },

    //------------------------------------------------
    //               FILTER ROUTINE
    //------------------------------------------------

    async filterCityPage(req, res) {
        const filterStatus = {
            status: Number(req.body.filterStatus),
            search: req.body.filterSearch,
            currentPage: 1,
            itemsPerPage: Number(req.body.itemsPerPageFilter),
            pageStartItem: 0,
            continentFilter: req.body.continentFilter,
            countryFilter: req.body.countryFilter,
            regionFilter: req.body.regionFilter,
            stateFilter: req.body.stateFilter,
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
        if (filterStatus.stateFilter === "0") {
            filterStatus.stateFilter = "%";
        }

        const messages = {
            display: "d-none",
            alertType: "",
            textMessage: "Filtro aplicado na tela de consulta.",
        };

        const [continents] = await City.filterSelectContinents(filterStatus);
        const [countries] = await City.filterSelectCountries(filterStatus);
        const [regions] = await City.filterSelectRegions(filterStatus);
        const [states] = await City.filterSelectStates(filterStatus);
        const [cities] = await City.selectCities(filterStatus);
        const [countSelect] = await City.countSelect(filterStatus);

        return res.render("../views/cms/cms-City-Q", {
            filterStatus,
            countSelect,
            messages,
            continents,
            countries,
            regions,
            states,
            cities,
        });
    },
};

