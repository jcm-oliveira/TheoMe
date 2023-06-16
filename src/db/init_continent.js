//DEFAULT DATABASE CREATION
//This file was created and should be only used when the system been installed at the first time. This file will create the tables and insert the basic data and information in each one of the tables.

const db = require("./continent");


(async () => {

    //INSERT
    console.log("Starting insert command...");
    const result = await db.insertContinent({name: "oxiiii", description: "descrição sei lá"}); 
    console.log (result);

})();










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