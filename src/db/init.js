//DEFAULT DATABASE CREATION
//This file was created and should be only used when the system been installed at the first time. This file will create the tables and insert the basic data and information in each one of the tables.

const db = require("./config");

(async () => {

    //CREATE TABLE
    console.log("Initiating database process creation");
    const result1 = await db.createContinent();
    console.log (result1);


    // //SELECT
    // console.log("select done!");
    // const result4 = await db.selectAssociation_type();
    // console.log (result4);

    // //INSERT
    // console.log("insert done!");
    // const result1 = await db.insertAssociation_type({name: "Participante3"}); 
    // console.log (result1);

    // //UPDATE
    // console.log("update done!");
    // const result2 = await db.updateAssociation_type(1, {name: "aquele update básico"}); 
    // console.log (result2);

    // //DELETE
    // console.log('Delete done!');
    // const result3 = await db.deleteAssociation_type(2);
    // console.log(result3);

})();


