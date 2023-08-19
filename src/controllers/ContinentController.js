const Continent = require("../model/continent");
console.log("ContinentController file starts...");

module.exports = {

//------------------------------------------------
//                    LOAD PAGES
//------------------------------------------------

     async loadShowPage(req, res) {        
        console.log("Louding Show Page...")
        const filterStatus = {
            continentStatus:1,
            continentName:'%'
        }
        const [continents] = await Continent.selectContinents(filterStatus)
        return res.render("../views/cms/cms-Continent-Q",{continents});
    },

    async loadInsertPage(req, res) {        
        console.log("Louding Insert Page...")
        return res.render("../views/cms/cms-Continent-C")            
    },

    async loadUpdatePage(req, res) {        
        console.log("Louding Update Page...")
        const continentId = req.params.id
        const filterStatus = {
            continentStatus:2,
        }
        const [continents] = await Continent.selectContinents(filterStatus)
        const continent = continents.find(continent => Number(continent.id) === Number(continentId))
            if (!continent) {
                return res.send('Continente não encontrado')
            }
        return res.render("../views/cms/cms-Continent-U", {continent})     
    },

//------------------------------------------------
//                   INSERT
//------------------------------------------------

    async insertContinentPage(req,res) {        
        const insert = await Continent.insertContinents( {
            continentStatus: req.body.continentStatus,
            continentName: req.body.continentName,
            continentDescription: req.body.continentDescription,});
        console.log(insert)
        return res.redirect('/cms-Continent-Q')
    },

//------------------------------------------------
//                    UPDATE
//------------------------------------------------

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
//                    DELETE
//------------------------------------------------
async deleteContinentPage(req,res) {
        const continentId = req.params.id
        const deleted = await Continent.deleteContinents(continentId)
        console.log(deleted)
        res.redirect('/cms-Continent-Q')
    },


//------------------------------------------------
//                    FILTER
//------------------------------------------------
async filterContinentPage(req,res) {
    const filterStatus = {
        continentStatus: Number(req.body.filterStatus),
        continentName: req.body.filterName,
    }
    
        if (filterStatus.continentName === "") {
            filterStatus.continentName = '%'
        }

        if (filterStatus.continentStatus === Number(2)) {
            filterStatus.continentStatus = '%'
        }

    const [continents] = await Continent.selectContinents(filterStatus)
    return res.render("../views/cms/cms-Continent-Q",{continents});
    }
}



