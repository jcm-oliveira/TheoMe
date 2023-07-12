function tabSelection(optionIDSelected) {
    console.log(optionIDSelected);
    console.log("entrou");

    document.getElementById(optionIDSelected).style.display = "none"

    return {optionIDSelected}

}