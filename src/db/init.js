//DEFAULT DATABASE CREATION
//This file was created and should be only used when the system been installed at the first time. This file will create the tables and insert the basic data and information in each one of the tables.

const db = require("./config");

(async () => {

    //CREATE TABLE
    console.log("Initiating database process creation");
    const result1 = await db.createContinent();
    console.log (result1);

})();


