const Country = require("../model/CountryModel");
const Continent = require("../model/ContinentModel");
console.log("CountryController file starts...");
module.exports = {

//------------------------------------------------
//                SHOW PAGE ROTINE
//------------------------------------------------

    async loadShowPage(req, res) {
        const filterStatus = {
            countryStatus:1,
            countrySearch:'%',
            currentPage:1,
            itemsPerPage:10,
            pageStartItem:0,
        }
        const [countries] = await Country.selectCountries(filterStatus)
        const [countSelect] = await Country.countSelect(filterStatus)
        const messages = {
            display:"d-none",
            alertType:"",
            textMessage: "Página inicial de consulta carregada.",
        }
        return res.render("../views/cms/cms-Country-Q",{countries, filterStatus, countSelect,messages});
    },

//------------------------------------------------
//              PAGINATION CONTROL
//------------------------------------------------

    async paginationView(req, res) {

        const filterStatus = {
            countryStatus: Number(req.body.countryStatus),
            countrySearch: req.body.countrySearch,
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
        const [countries] = await Country.selectCountries(filterStatus)
        const messages = {
            display:"d-none",
            alertType:"",
            textMessage: ("Página " + filterStatus.currentPage + " selecionada."),
        }
        return res.render("../views/cms/cms-Country-Q",{countries, filterStatus, countSelect, messages});
    },

//------------------------------------------------
//                 INSERT ROTINE
//------------------------------------------------

    async loadInsertPage(req, res) {  
        const ContinentFilterStatus = {
            continentStatus:1,
            continentSearch:'%',
            currentPage:1,
            itemsPerPage:10,
            pageStartItem:0,
        }         
        const messages = {
            display:"d-none",
            alertType:"",
            textMessage: "Página inserir carregada.",
        }
        const [continents] = await Continent.selectContinents(ContinentFilterStatus)
        return res.render("../views/cms/cms-Country-C", {messages,continents})            
    },

    async insertCountryPage(req,res) {
        const filterStatus = {
            countryStatus:1,
            countrySearch:'%',
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
        const [countries] = await Country.selectCountries(filterStatus)
        const [countSelect] = await Country.countSelect(filterStatus)
        return res.render('../views/cms/cms-Country-Q', {countries,filterStatus,countSelect,messages})
    },

//------------------------------------------------
//                 UPDATE ROTINE
//------------------------------------------------

    async loadUpdatePage(req, res) {        
        const countryId = req.params.id
        const filterStatus = {
            countryStatus:'%',
            countrySearch:'%',
            currentPage:1,
            itemsPerPage:100,
            pageStartItem:0,
        }
        const [countries] = await Country.selectCountries(filterStatus)
        const country = countries.find(country => Number(country.id) === Number(countryId))
            if (!country) {
                return res.send('Country not found')
            }
        return res.render("../views/cms/cms-Country-U", {country})     
    },

    async updateCountryPage(req,res) {
        const filterStatus = {
            countryStatus:1,
            countrySearch:'%',
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
        const [countries] = await Country.selectCountries(filterStatus)
        const [countSelect] = await Country.countSelect(filterStatus)
        return res.render('../views/cms/cms-Country-Q', {countries,filterStatus,countSelect,messages})
    },

//------------------------------------------------
//                DELETE ROTINE
//------------------------------------------------

    async deleteCountryPage(req,res) {
        const filterStatus = {
            countryStatus:'1',
            countrySearch:'%',
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
        const [countries] = await Country.selectCountries(filterStatus)
        const [countSelect] = await Country.countSelect(filterStatus)
        return res.render('../views/cms/cms-Country-Q', {countries,filterStatus,countSelect,messages})
    },

//------------------------------------------------
//               FILTER ROUTINE
//------------------------------------------------

    async filterCountryPage(req,res) {
        const filterStatus = {
            countryStatus: Number(req.body.filterStatus),
            countrySearch: req.body.filterSearch,
            currentPage:1,
            itemsPerPage:Number(req.body.itemsPerPageFilter),
            pageStartItem:0,
        }        
            if (filterStatus.countryStatus === Number(2)) {
            filterStatus.countryStatus = '%'
            }
            if (filterStatus.countrySearch === "") {
                filterStatus.countrySearch = '%'
            }
        const messages = {
            display:"d-none",
            alertType:"",
            textMessage: "Filtro aplicado na tela de consulta.",
        }
        const [countries] = await Country.selectCountries(filterStatus)
        console.log(countries)
        const [countSelect] = await Country.countSelect(filterStatus)
        return res.render("../views/cms/cms-Country-Q",{countries, filterStatus, countSelect,messages});
        }
    }


