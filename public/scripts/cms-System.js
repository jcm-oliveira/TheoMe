function CallToActionCheck() {

    if (document.querySelector('input#CallToAction-Check').checked == true)
    {
        document.querySelector('div#CallToAction-Fields').style.display = "flex";
    } else {
        document.querySelector('div#CallToAction-Fields').style.display = "none";
    }
}