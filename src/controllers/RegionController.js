const Region = require("../model/RegionModel");
console.log("RegionController file starts...");
module.exports = {






//------------------------------------------------
//                SHOW PAGE ROTINE
//------------------------------------------------

    async loadShowPage(req, res) {
        const filterStatus = {
            status:1,
            search:'%',
            currentPage:1,
            itemsPerPage:10,
            pageStartItem:0,
            continentFilter:'%',
            countryFilter:'%',
        }
        const [continents] = await Region.filterSelectContinents(filterStatus)
        const [countries] = await Region.filterSelectCountries(filterStatus)
        const [regions] = await Region.selectRegions(filterStatus)
        const [countSelect] = await Region.countSelect(filterStatus)
        const messages = {
            display:"d-none",
            alertType:"",
            textMessage: "Página inicial de consulta carregada.",
        }
        return res.render("../views/cms/cms-Region-Q",{filterStatus, countSelect,messages,continents,countries,regions});
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
        }
        
            if (filterStatus.prevBtn === "prevBtnClicked") {
                if (filterStatus.currentPage > 1) {
                    filterStatus.currentPage--
                    filterStatus.pageStartItem = filterStatus.pageStartItem - filterStatus.itemsPerPage 
                }
            }
        
        const [countSelect] = await Region.countSelect(filterStatus)

            if (filterStatus.nextBtn === "nextBtnClicked") {
                if ((filterStatus.pageStartItem + filterStatus.itemsPerPage) < countSelect[0].totalRegister) {
                    filterStatus.currentPage++
                    filterStatus.pageStartItem = filterStatus.pageStartItem + filterStatus.itemsPerPage
                }
            }
        const [continents] = await Region.filterSelectContinents(filterStatus)
        const [countries] = await Region.filterSelectCountries(filterStatus)

        const [regions] = await Region.selectRegions(filterStatus)
        const messages = {
            display:"d-none",
            alertType:"",
            textMessage: ("Página " + filterStatus.currentPage + " selecionada."),
        }
        return res.render("../views/cms/cms-Region-Q",{filterStatus, countSelect, messages, continents, countries, regions});
    },

//------------------------------------------------
//                 INSERT ROTINE
//------------------------------------------------

    async loadInsertPage(req, res) {  
        const filterStatus = {
            status:1,
            search:'%',
            currentPage:1,
            itemsPerPage:10,
            pageStartItem:0,
            continentFilter:'%',
            countryFilter:'%',
        }         
        const messages = {
            display:"d-none",
            alertType:"",
            textMessage: "Página inserir carregada.",
        }
        const [continents] = await Region.filterSelectContinents(filterStatus)
        const [countries] = await Region.filterSelectCountries(filterStatus)

        return res.render("../views/cms/cms-Region-C", {messages,continents,countries})            
    },

    async insertRegionPage(req,res) {

        console.log("entrou no insertRegionPage")
        const filterStatus = {
            status:1,
            search:'%',
            currentPage:1,
            itemsPerPage:10,
            pageStartItem:0,
            continentFilter:'%',
            countryFilter:'%',
        }        
        const insert = await Region.insertRegions({
            regionName: req.body.regionName,
            regionDescription: req.body.regionDescription,
            regionIdContinent: req.body.id_Continent,
            regionIdCountry: req.body.id_Country,
            regionStatus: req.body.regionStatus,
        });
        const messages = {
            display:"",
            alertType:insert.alertTypeResult,
            textMessage: insert.textResult,
        }
        const [continents] = await Region.filterSelectContinents(filterStatus)
        const [countries] = await Region.filterSelectCountries(filterStatus)
        const [regions] = await Region.selectRegions(filterStatus)
        const [countSelect] = await Region.countSelect(filterStatus)
        return res.render('../views/cms/cms-Region-Q', {filterStatus,countSelect,messages,continents,countries, regions})
    },

    async continentListener(req, res)  {

        const { continentId } = req.body;
        const [countries] = await Region.getCountriesByContinent(continentId);
        res.json(countries);  
     },

//------------------------------------------------
//                 UPDATE ROTINE
//------------------------------------------------

    async loadUpdatePage(req, res) {        
        const regionId = req.params.id
        const filterStatus = {
            status:'%',
            search:'%',
            currentPage:1,
            itemsPerPage:100,
            pageStartItem:0,
            continentFilter:'%',
            countryFilter:'%',
        }
        const [continents] = await Region.filterSelectContinents(filterStatus)
        const [countries] = await Region.filterSelectCountries(filterStatus)
        const [regions] = await Region.selectRegions(filterStatus)
        const region = regions.find(region => Number(region.id) === Number(regionId))
            if (!region) {
                return res.send('Country not found')
            }     
        return res.render("../views/cms/cms-Region-U", {region, continents, countries, regions})     
    },

    async updateRegionPage(req,res) {
        const filterStatus = {
            status:1,
            search:'%',
            currentPage:1,
            itemsPerPage:10,
            pageStartItem:0,
            continentFilter:'%',
            countryFilter:'%',
        } 
        const regionId = req.params.id
        const updatedRegion = {
            regionStatus: req.body.regionStatus,
            regionName: req.body.regionName,
            regionDescription: req.body.regionDescription,
            regionIdContinent: req.body.id_Continent,
            regionIdCountry: req.body.id_Country,
        }
        const update = await Region.updateRegions(regionId,updatedRegion)
        const messages = {
            display:"",
            alertType:update.alertTypeResult,
            textMessage: update.textResult,
        }
        const [continents] = await Region.filterSelectContinents(filterStatus)
        const [countries] = await Region.filterSelectCountries(filterStatus)
        const [regions] = await Region.selectRegions(filterStatus)
        const [countSelect] = await Region.countSelect(filterStatus)
        return res.render('../views/cms/cms-Region-Q', {regions,filterStatus,countSelect,messages,continents, countries})
    },

//------------------------------------------------
//                DELETE ROTINE
//------------------------------------------------

    async deleteRegionPage(req,res) {
        const filterStatus = {
            status:'1',
            search:'%',
            currentPage:1,
            itemsPerPage:10,
            pageStartItem:0,
            continentFilter:'%',
            countryFilter:'%',
        } 
        const regionId = req.params.id
        const deleted = await Region.deleteRegions(regionId)
        const messages = {
            display:"",
            alertType:deleted.alertTypeResult,
            textMessage: deleted.textResult,
        }
        const [continents] = await Region.filterSelectContinents(filterStatus)
        const [countries] = await Region.filterSelectCountries(filterStatus)
        const [regions] = await Region.selectRegions(filterStatus)
        const [countSelect] = await Region.countSelect(filterStatus)
        return res.render('../views/cms/cms-Region-Q', {filterStatus, countSelect, messages, continents, countries, regions})
    },

//------------------------------------------------
//               FILTER ROUTINE
//------------------------------------------------

    async filterCountryPage(req,res) {
        const filterStatus = {
            status: Number(req.body.filterStatus),
            search: req.body.filterSearch,
            currentPage:1,
            itemsPerPage:Number(req.body.itemsPerPageFilter),
            pageStartItem:0,
            continentFilter:req.body.continentFilter,
            countryFilter:req.body.countryFilter,
        }        
            if (filterStatus.status === Number(2)) {
                filterStatus.status = '%'
            }
            if (filterStatus.search === "") {
                filterStatus.search = '%'
            }
            if (filterStatus.continentFilter === '0') {
                filterStatus.continentFilter = '%'
            }
            if (filterStatus.countryFilter === '0') {
                filterStatus.countryFilter = '%'
            }
        const messages = {
            display:"d-none",
            alertType:"",
            textMessage: "Filtro aplicado na tela de consulta.",
        }

        const [continents] = await Region.filterSelectContinents(filterStatus)
        const [countries] = await Region.filterSelectCountries(filterStatus)
        const [regions] = await Region.selectRegions(filterStatus)
        const [countSelect] = await Region.countSelect(filterStatus)
        return res.render("../views/cms/cms-Region-Q",{filterStatus, countSelect, messages, continents, countries, regions});
        }
    
}


