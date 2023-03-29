async function tabSelection(optionIDSelected) {
    console.log(optionIDSelected);

    document.getElementById("tabBookSummary").style.display = "none";
    document.getElementById("tabBookData").style.display = "none";
    document.getElementById("tabBookSchemaOfContent").style.display = "none";
    document.getElementById("tabBookReadingPage").style.display = "none";


    document.getElementById(optionIDSelected).style.display = "grid";
}