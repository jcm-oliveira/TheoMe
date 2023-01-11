//DEFAULT DATABASE CREATION

const db = require("./config");

(async () => {

    //INSERT
    console.log("insert done!");
    const result1 = await db.insertAssociation_type({name: "Participante3"}); 
    console.log (result1);

    //UPDATE
    console.log("update done!");
    const result2 = await db.updateAssociation_type(1, {name: "aquele update básico"}); 
    console.log (result2);

    //DELETE
    console.log('Delete done!');
    const result3 = await db.deleteAssociation_type(2);
    console.log(result3);

    // //SELECT
    console.log("select done!");
    const result4 = await db.selectAssociation_type();
    console.log (result4);

})();


