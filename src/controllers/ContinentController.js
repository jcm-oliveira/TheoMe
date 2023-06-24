const db = require("../model/continent");


module.exports = {

    create(req, res) {        
        console.log("Create page loaded...")
        return res.render("../views/cms/cms-Continent-C")            
    },


}
















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