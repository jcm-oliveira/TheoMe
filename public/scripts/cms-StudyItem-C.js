
function CheckRegisterType() {
      
    if (document.querySelector('select#RegisterType').value == '') 
    {
        document.querySelector('div#StartDate').style.display = "none";
        document.querySelector('div#EndDate').style.display = "none";              

    } else if (document.querySelector('select#RegisterType').value == 'Marco') {
        document.querySelector('div#StartDate').style.display = "flex";
        document.querySelector('div#EndDate').style.display = "none";
        document.querySelector('legend#StartDate-legend').innerHTML = 'Data';

    } else if (document.querySelector('select#RegisterType').value == 'Período') {
        document.querySelector('div#StartDate').style.display = "flex";
        document.querySelector('div#EndDate').style.display = "flex";
        document.querySelector('legend#StartDate-legend').innerHTML = 'Data de início';
    }              
}