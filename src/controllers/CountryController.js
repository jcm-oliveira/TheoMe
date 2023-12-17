const Country = require("../model/CountryModel");
const Continent = require("../model/ContinentModel");
console.log("CountryController file starts...");
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
        }
        const [continents] = await Continent.selectContinents(filterStatus)
        const [countries] = await Country.selectCountries(filterStatus)
        const [countSelect] = await Country.countSelect(filterStatus)
        const messages = {
            display:"d-none",
            alertType:"",
            textMessage: "Página inicial de consulta carregada.",
        }
        return res.render("../views/cms/cms-Country-Q",{countries, filterStatus, countSelect,messages,continents});
    },

//------------------------------------------------
//              PAGINATION CONTROL
//------------------------------------------------

    async paginationView(req, res) {

        const filterStatus = {
            status: Number(req.body.countryStatus),
            search: req.body.countrySearch,
            currentPage: Number(req.body.currentPage),
            itemsPerPage: Number(req.body.itemsPerPage),
            pageStartItem: Number(req.body.pageStartItem),
            prevBtn: req.body.previousButton,
            nextBtn: req.body.nextButton,
        }     
            if (filterStatus.prevBtn === "prevBtnClicked") {
                if (filterStatus.currentPage > 1) {
                    filterStatus.currentPage--
                    filterStatus.pageStartItem = filterStatus.pageStartItem - filterStatus.itemsPerPage 
                }
            }
        const [countSelect] = await Country.countSelect(filterStatus)
            if (filterStatus.nextBtn === "nextBtnClicked") {
                if ((filterStatus.pageStartItem + filterStatus.itemsPerPage) < countSelect[0].totalRegister) {
                    filterStatus.currentPage++
                    filterStatus.pageStartItem = filterStatus.pageStartItem + filterStatus.itemsPerPage
                }
            }
        const [continents] = await Continent.selectContinents(filterStatus)     
        const [countries] = await Country.selectCountries(filterStatus)
        const messages = {
            display:"d-none",
            alertType:"",
            textMessage: ("Página " + filterStatus.currentPage + " selecionada."),
        }
        return res.render("../views/cms/cms-Country-Q",{countries, filterStatus, countSelect, messages, continents});
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
        }         
        const messages = {
            display:"d-none",
            alertType:"",
            textMessage: "Página inserir carregada.",
        }
        const [continents] = await Continent.selectContinents(filterStatus)
        return res.render("../views/cms/cms-Country-C", {messages,continents})            
    },

    async insertCountryPage(req,res) {
        const filterStatus = {
            status:1,
            search:'%',
            currentPage:1,
            itemsPerPage:10,
            pageStartItem:0,
        }        
        const insert = await Country.insertCountries({
            countryName: req.body.countryName,
            countryDescription: req.body.countryDescription,
            countryIdContinent: req.body.id_Continent,
            countryStatus: req.body.countryStatus,
        });
        const messages = {
            display:"",
            alertType:insert.alertTypeResult,
            textMessage: insert.textResult,
        }
        const [continents] = await Continent.selectContinents(filterStatus)
        const [countries] = await Country.selectCountries(filterStatus)
        const [countSelect] = await Country.countSelect(filterStatus)
        return res.render('../views/cms/cms-Country-Q', {countries,filterStatus,countSelect,messages,continents})
    },

//------------------------------------------------
//                 UPDATE ROTINE
//------------------------------------------------

    async loadUpdatePage(req, res) {        
        const countryId = req.params.id
        const filterStatus = {
            status:'%',
            search:'%',
            currentPage:1,
            itemsPerPage:100,
            pageStartItem:0,
        }
        const [continents] = await Continent.selectContinents(filterStatus)
        const [countries] = await Country.selectCountries(filterStatus)
        const country = countries.find(country => Number(country.id) === Number(countryId))
            if (!country) {
                return res.send('Country not found')
            }
        console.log(country)
        console.log(country.id_content)
        
        return res.render("../views/cms/cms-Country-U", {country, continents})     
    },

    async updateCountryPage(req,res) {
        const filterStatus = {
            status:1,
            search:'%',
            currentPage:1,
            itemsPerPage:10,
            pageStartItem:0,
        } 
        const countryId = req.params.id
        const updatedCountry = {
            countryStatus: req.body.countryStatus,
            countryName: req.body.countryName,
            countryDescription: req.body.countryDescription,
            countryIdContinent: req.body.id_Continent,
        }
        const update = await Country.updateCountries(countryId,updatedCountry)
        const messages = {
            display:"",
            alertType:update.alertTypeResult,
            textMessage: update.textResult,
        }
        const [continents] = await Continent.selectContinents(filterStatus)
        const [countries] = await Country.selectCountries(filterStatus)
        const [countSelect] = await Country.countSelect(filterStatus)
        return res.render('../views/cms/cms-Country-Q', {countries,filterStatus,countSelect,messages,continents})
    },

//------------------------------------------------
//                DELETE ROTINE
//------------------------------------------------

    async deleteCountryPage(req,res) {
        const filterStatus = {
            status:'1',
            search:'%',
            currentPage:1,
            itemsPerPage:10,
            pageStartItem:0,
        } 
        const countryId = req.params.id
        const deleted = await Country.deleteCountries(countryId)
        const messages = {
            display:"",
            alertType:deleted.alertTypeResult,
            textMessage: deleted.textResult,
        }
        const [continents] = await Continent.selectContinents(filterStatus)
        const [countries] = await Country.selectCountries(filterStatus)
        const [countSelect] = await Country.countSelect(filterStatus)
        return res.render('../views/cms/cms-Country-Q', {countries,filterStatus,countSelect,messages, continents})
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
        }        
            if (filterStatus.status === Number(2)) {
            filterStatus.status = '%'
            }
            if (filterStatus.search === "") {
                filterStatus.search = '%'
            }
        const messages = {
            display:"d-none",
            alertType:"",
            textMessage: "Filtro aplicado na tela de consulta.",
        }
        const [continents] = await Continent.selectContinents(filterStatus)
        const [countries] = await Country.selectCountries(filterStatus)
        console.log(countries)
        const [countSelect] = await Country.countSelect(filterStatus)
        return res.render("../views/cms/cms-Country-Q",{countries, filterStatus, countSelect,messages, continents});
        }
    }


