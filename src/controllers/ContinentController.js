const Continent = require("../model/ContinentModel");
console.log("ContinentController file starts...");

module.exports = {

//------------------------------------------------
//                SHOW PAGE ROTINE
//------------------------------------------------

    async loadShowPage(req, res) {        

        const filterStatus = {
            continentStatus:Number(1),
            continentSearch:'%',
            currentPage:Number(1),
            itemsPerPage:Number(10),
            pageStartItem:Number(0),
        }

        const [continents] = await Continent.selectContinents(filterStatus)
        const [countSelect] = await Continent.countSelect(filterStatus)

        const messages = {
            display:"d-none",
            alert: "Página inicial de consulta carregada.",
        }

        return res.render("../views/cms/cms-Continent-Q",{continents, filterStatus, countSelect,messages});
    },

//------------------------------------------------
//              PAGINATION CONTROL
//------------------------------------------------

async paginationView(req, res) {        

    const filterStatus = {
        continentStatus: req.body.continentStatus,
        continentSearch: req.body.continentSearch,
        currentPage: Number(req.body.currentPage),
        itemsPerPage: Number(req.body.itemsPerPage),
        pageStartItem: Number(req.body.pageStartItem),
        prevBtn: req.body.previousButton,
        nextBtn: req.body.nextButton,
    }
    
        if (filterStatus.prevBtn === "prevBtnClicked") {
            console.log("PREVIOUS Button clicked")
            if (filterStatus.currentPage > 1) {
                filterStatus.currentPage--
                filterStatus.pageStartItem = filterStatus.pageStartItem - filterStatus.itemsPerPage 
            }
        }

    const [countSelect] = await Continent.countSelect(filterStatus)

        if (filterStatus.nextBtn === "nextBtnClicked") {
            console.log("NEXT Button clicked")
            if ((filterStatus.pageStartItem + filterStatus.itemsPerPage) < countSelect[0].totalRegister) {
                filterStatus.currentPage++
                filterStatus.pageStartItem = filterStatus.pageStartItem + filterStatus.itemsPerPage
            }
        }      

    const [continents] = await Continent.selectContinents(filterStatus)

    const messages = {
        display:"d-none",
        alert: ("Página " + filterStatus.currentPage + " selecionada."),
    }

    return res.render("../views/cms/cms-Continent-Q",{continents, filterStatus, countSelect, messages});
},

//------------------------------------------------
//                 INSERT ROTINE
//------------------------------------------------

    async loadInsertPage(req, res) {        
        const messages = {
            display:"d-none",
            alert: "Página inserir carregada.",
        }
        return res.render("../views/cms/cms-Continent-C", {messages})            
    },

    async insertContinentPage(req,res) {
        const filterStatus = {
            continentStatus:Number(1),
            continentSearch:'%',
            currentPage:Number(1),
            itemsPerPage:Number(10),
            pageStartItem:Number(0),
        }     
        const insert = await Continent.insertContinents({
            continentStatus: req.body.continentStatus,
            continentName: req.body.continentName,
            continentDescription: req.body.continentDescription,});
        const messages = {
            display:"",
            alert: insert,
        }

        const [continents] = await Continent.selectContinents(filterStatus)
        const [countSelect] = await Continent.countSelect(filterStatus)
        return res.render('../views/cms/cms-Continent-Q', {continents,filterStatus,countSelect,messages})
    },

//------------------------------------------------
//                 UPDATE ROTINE
//------------------------------------------------

    async loadUpdatePage(req, res) {        
        console.log("Louding Update Page...")
        const continentId = req.params.id
        const filterStatus = {
            continentStatus:'%',
            continentSearch:'%',
            currentPage:Number(1),
            itemsPerPage:100,
            pageStartItem:Number(0),
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
            continentStatus:'%',
            continentSearch:'%',
            currentPage:Number(1),
            itemsPerPage:100,
            pageStartItem:Number(0),
        } 
        const continentId = req.params.id
        const updatedContinent = {
            continentStatus: req.body.continentStatus,
            continentName: req.body.continentName,
            continentDescription: req.body.continentDescription,}
        const update = await Continent.updateContinents(continentId,updatedContinent)
        const messages = {
            display:"",
            alert: update,
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
            continentStatus:'%',
            continentSearch:'%',
            currentPage:Number(1),
            itemsPerPage:100,
            pageStartItem:Number(0),
        } 
        const continentId = req.params.id
        const deleted = await Continent.deleteContinents(continentId)
        const messages = {
            display:"",
            alert: deleted,
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
        continentStatus: Number(req.body.filterStatus),
        continentSearch: req.body.filterSearch,
        currentPage:Number(1),
        itemsPerPage:Number(req.body.itemsPerPageFilter),
        pageStartItem:Number(0),
    }
    
        if (filterStatus.continentStatus === Number(2)) {
        filterStatus.continentStatus = '%'
    }
        if (filterStatus.continentSearch === "") {
            filterStatus.continentSearch = '%'
        }

    const messages = {
        display:"d-none",
        alert: "Filtro aplicado na tela de consulta.",
    }

    const [continents] = await Continent.selectContinents(filterStatus)
    const [countSelect] = await Continent.countSelect(filterStatus)
    return res.render("../views/cms/cms-Continent-Q",{continents, filterStatus, countSelect,messages});
    }
}


