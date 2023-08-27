const Continent = require("../model/ContinentModel");
console.log("ContinentController file starts...");

module.exports = {

//------------------------------------------------
//                SHOW PAGE ROTINE
//------------------------------------------------

    async loadShowPage(req, res) {        
        console.log("Louding Show Page...")

        const filterStatus = {
            continentStatus:1,
            continentSearch:'%',
            currentPage:Number(1),
            itemsPerPage:Number(5),
            pageStartItem:Number(1),
        }
        console.log("Página " + filterStatus.currentPage)

        const [continents] = await Continent.selectContinents(filterStatus)
        return res.render("../views/cms/cms-Continent-Q",{continents, filterStatus});
    },

//------------------------------------------------
//              PAGINATION CONTROL
//------------------------------------------------

async paginationView(req, res) {        
    console.log("Louding Pagination View...")

    const filterStatus = {
        continentStatus: req.body.continentStatus,
        continentSearch: req.body.continentSearch,
        currentPage: Number(req.body.currentPage),
        itemsPerPage: Number(req.body.itemsPerPag),
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
            console.log("Página atual " + filterStatus.currentPage)
        }

        if (filterStatus.nextBtn === "nextBtnClicked") {
            console.log("NEXT Button clicked")
                filterStatus.currentPage++
                filterStatus.pageStartItem = filterStatus.pageStartItem + filterStatus.itemsPerPage
            console.log("Página atual " + filterStatus.currentPage)
        }      

    const [continents] = await Continent.selectContinents(filterStatus)
    return res.render("../views/cms/cms-Continent-Q",{continents, filterStatus});
},

//------------------------------------------------
//                 INSERT ROTINE
//------------------------------------------------

    async loadInsertPage(req, res) {        
        console.log("Louding Insert Page...")
        return res.render("../views/cms/cms-Continent-C")            
    },

    async insertContinentPage(req,res) {        
        const insert = await Continent.insertContinents( {
            continentStatus: req.body.continentStatus,
            continentName: req.body.continentName,
            continentDescription: req.body.continentDescription,});
        console.log(insert)
        return res.redirect('/cms-Continent-Q')
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
            itemsPerPage:Number(5),
            pageStartItem:Number(1),
        }
        const [continents] = await Continent.selectContinents(filterStatus)
        const continent = continents.find(continent => Number(continent.id) === Number(continentId))
            if (!continent) {
                return res.send('Continente não encontrado')
            }
        return res.render("../views/cms/cms-Continent-U", {continent})     
    },

    async updateContinentPage(req,res) {
        const continentId = req.params.id
        const updatedContinent = {
            continentStatus: req.body.continentStatus,
            continentName: req.body.continentName,
            continentDescription: req.body.continentDescription,}
        const update = await Continent.updateContinents(continentId,updatedContinent)
        console.log(update)
        res.redirect('/cms-Continent-Q')
    },

//------------------------------------------------
//                DELETE ROTINE
//------------------------------------------------

    async deleteContinentPage(req,res) {
        const continentId = req.params.id
        const deleted = await Continent.deleteContinents(continentId)
        console.log(deleted)
        res.redirect('/cms-Continent-Q')
    },

//------------------------------------------------
//               FILTER ROUTINE
//------------------------------------------------

async filterContinentPage(req,res) {
    const filterStatus = {
        continentStatus: Number(req.body.filterStatus),
        continentSearch: req.body.filterSearch,
        currentPage:Number(1),
        itemsPerPage:Number(5),
        pageStartItem:Number(1),
    }
    
        if (filterStatus.continentStatus === Number(2)) {
        filterStatus.continentStatus = '%'
    }
        if (filterStatus.continentSearch === "") {
            filterStatus.continentSearch = '%'
        }


    const [continents] = await Continent.selectContinents(filterStatus)
    return res.render("../views/cms/cms-Continent-Q",{continents, filterStatus});
    }
}


