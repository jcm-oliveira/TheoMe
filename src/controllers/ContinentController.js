const Continent = require("../model/ContinentModel");
console.log("ContinentController file starts...");
module.exports = {

//------------------------------------------------
//                SHOW PAGE ROTINE
//------------------------------------------------

    async loadShowPage(req, res) {
        const filterStatus = {
            status:Number(1),
            search:'%',
            currentPage:1,
            itemsPerPage:10,
            pageStartItem:0,
        }
        const [continents] = await Continent.selectContinents(filterStatus)
        const [countSelect] = await Continent.countSelect(filterStatus)
        const messages = {
            display:"d-none",
            alertType:"",
            textMessage: "Página inicial de consulta carregada.",
        }
        return res.render("../views/cms/cms-Continent-Q",{continents, filterStatus, countSelect,messages});
    },

//------------------------------------------------
//              PAGINATION CONTROL
//------------------------------------------------

    async paginationView(req, res) {

        const filterStatus = {
            status: req.body.continentStatus,
            search: req.body.continentSearch,
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
        const [countSelect] = await Continent.countSelect(filterStatus)
            if (filterStatus.nextBtn === "nextBtnClicked") {
                if ((filterStatus.pageStartItem + filterStatus.itemsPerPage) < countSelect[0].totalRegister) {
                    filterStatus.currentPage++
                    filterStatus.pageStartItem = filterStatus.pageStartItem + filterStatus.itemsPerPage
                }
            }      
        const [continents] = await Continent.selectContinents(filterStatus)
        const messages = {
            display:"d-none",
            alertType:"",
            textMessage: ("Página " + filterStatus.currentPage + " selecionada."),
        }
        return res.render("../views/cms/cms-Continent-Q",{continents, filterStatus, countSelect, messages});
    },

//------------------------------------------------
//                 INSERT ROTINE
//------------------------------------------------

    async loadInsertPage(req, res) {        
        const messages = {
            display:"d-none",
            alertType:"",
            textMessage: "Página inserir carregada.",
        }
        return res.render("../views/cms/cms-Continent-C", {messages})            
    },

    async insertContinentPage(req,res) {
        const filterStatus = {
            status:1,
            search:'%',
            currentPage:1,
            itemsPerPage:10,
            pageStartItem:0,
        }     
        const insert = await Continent.insertContinents({
            continentStatus: req.body.continentStatus,
            continentName: req.body.continentName,
            continentDescription: req.body.continentDescription,});
        const messages = {
            display:"",
            alertType:insert.alertTypeResult,
            textMessage: insert.textResult,
        }
        const [continents] = await Continent.selectContinents(filterStatus)
        const [countSelect] = await Continent.countSelect(filterStatus)
        return res.render('../views/cms/cms-Continent-Q', {continents,filterStatus,countSelect,messages})
    },

//------------------------------------------------
//                 UPDATE ROTINE
//------------------------------------------------

    async loadUpdatePage(req, res) {        
        const continentId = req.params.id
        const filterStatus = {
            status:'%',
            search:'%',
            currentPage:1,
            itemsPerPage:100,
            pageStartItem:0,
        }
        const [continents] = await Continent.selectContinents(filterStatus)
        const continent = continents.find(continent => Number(continent.id) === Number(continentId))
            if (!continent) {
                return res.send('Continent not found')
            }
        return res.render("../views/cms/cms-Continent-U", {continent})     
    },

    async updateContinentPage(req,res) {
        const filterStatus = {
            status:1,
            search:'%',
            currentPage:1,
            itemsPerPage:10,
            pageStartItem:0,
        } 
        const continentId = req.params.id
        const updatedContinent = {
            continentStatus: req.body.continentStatus,
            continentName: req.body.continentName,
            continentDescription: req.body.continentDescription,}
        const update = await Continent.updateContinents(continentId,updatedContinent)
        const messages = {
            display:"",
            alertType:update.alertTypeResult,
            textMessage: update.textResult,
        }
        const [continents] = await Continent.selectContinents(filterStatus)
        const [countSelect] = await Continent.countSelect(filterStatus)
        return res.render('../views/cms/cms-Continent-Q', {continents,filterStatus,countSelect,messages})
    },

//------------------------------------------------
//                DELETE ROTINE
//------------------------------------------------

    async deleteContinentPage(req,res) {
        const filterStatus = {
            status:'1',
            search:'%',
            currentPage:1,
            itemsPerPage:10,
            pageStartItem:0,
        } 
        const continentId = req.params.id
        const deleted = await Continent.deleteContinents(continentId)
        const messages = {
            display:"",
            alertType:deleted.alertTypeResult,
            textMessage: deleted.textResult,
        }
        const [continents] = await Continent.selectContinents(filterStatus)
        const [countSelect] = await Continent.countSelect(filterStatus)
        return res.render('../views/cms/cms-Continent-Q', {continents,filterStatus,countSelect,messages})
    },

//------------------------------------------------
//               FILTER ROUTINE
//------------------------------------------------

    async filterContinentPage(req,res) {
        const filterStatus = {
            status: Number(req.body.filterStatus),
            search: req.body.filterSearch,
            currentPage:1,
            itemsPerPage:Number(req.body.itemsPerPageFilter),
            pageStartItem:0,
        }
        console.log(filterStatus);        
            if (filterStatus.continentStatus === Number(2)) {
            filterStatus.continentStatus = '%'
            }
            if (filterStatus.continentSearch === "") {
                filterStatus.continentSearch = '%'
            }
        const messages = {
            display:"d-none",
            alertType:"",
            textMessage: "Filtro aplicado na tela de consulta.",
        }
        const [continents] = await Continent.selectContinents(filterStatus)
        const [countSelect] = await Continent.countSelect(filterStatus)
        return res.render("../views/cms/cms-Continent-Q",{continents, filterStatus, countSelect,messages});
        }
    }


