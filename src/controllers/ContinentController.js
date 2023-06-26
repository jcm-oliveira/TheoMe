console.log("chamou!");
const Continent = require("../model/continent");

module.exports = {

    show(continent) {
    console.log(continent)
    },

    // LOAD PAGE
    create(req, res) {        
        console.log("Louding Create Page...")
        return res.render("../views/cms/cms-Continent-C")            
    },

    // SAVE (INSERT)
    async save(req,res) {
        
        await Continent.create( {
            continentStatus: req.body.continentStatus,
            continentName: req.body.continentName,
            continentDescription: req.body.continentDescription,     
        }
       );      
       
        return res.redirect('/cms-Continent-Q')
    },

    // SHOW (LIST REGISTERS)
    async show(req, res) {
                
        const continents = await Continent.get()

        const Continent = continents.findAll()

        console.log("Continent")

        return res.render({ Continent })
    },

}





// __________________________________________________________________________
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