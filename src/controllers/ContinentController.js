const Continent = require("../model/continent");
console.log("ContinentController file starts...");

module.exports = {

     //-------- LOAD PAGES---------

     async loadShowPage(req, res) {        
        console.log("Louding Show Page...")
        const continents = await Continent.selectContinents()
        console.log("Result from get function:", continents)
        return res.render("../views/cms/cms-Continent-Q",{continents});
    },

    async loadInsertPage(req, res) {        
        console.log("Louding Create Page...")
        return res.render("../views/cms/cms-Continent-C")            
    },

    //-------INSERT ---------

    async insertContinentPage(req,res) {        
        await Continent.insertContinents( {
            continentStatus: req.body.continentStatus,
            continentName: req.body.continentName,
            continentDescription: req.body.continentDescription,});      
        return res.redirect('/cms-Continent-Q')
    },
}














// __________________________________________________________________________

// setTimeout(display, 3000);

      // function display(continents) {
        // console.log("Result from get function:", continents)
        // }


// (async () => {

//     //INSERT
//     console.log("Starting insert command...");
//     const result = await db.insertContinent({name: "Asia", description: "xyz xyz xyz"});   
//     console.log (result);  
//     console.log("Register inserted!");

// })();

// __________________________________________________________________________
    // //UPDATE
    // console.log("update done!");
    // const result3 = await db.updateAssociation_type(1, {name: "aquele update básico"}); 
    // console.log (result3);

    // //DELETE
    // console.log('Delete done!');
    // const result4 = await db.deleteAssociation_type(2);
    // console.log(result4);

    // //SELECT
    // console.log("select done!");
    // const result5 = await db.selectAssociation_type();
    // console.log (result5);