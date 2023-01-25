
function CheckRegisterType() {
      
    if (document.querySelector('select#RegisterType').value == '') 
    {
        document.querySelector('div#StartDate').style.display = "none";
        document.querySelector('div#EndDate').style.display = "none";              

    } else if (document.querySelector('select#RegisterType').value == 'Marco') 
    {
        document.querySelector('div#StartDate').style.display = "flex";
        document.querySelector('div#EndDate').style.display = "none";
        document.querySelector('label#StartDate-legend').innerHTML = 'DATA';

    } else if (document.querySelector('select#RegisterType').value == 'Período') 
    {
        document.querySelector('div#StartDate').style.display = "flex";
        document.querySelector('div#EndDate').style.display = "flex";
        document.querySelector('label#StartDate-legend').innerHTML = 'DATA DE INÍCIO';
    }              
}


function DataFormat() {
    if (document.querySelector('input#option1').checked == true)
    {
        document.querySelector('div#start-day').style.display = "block";
        document.querySelector('div#start-month').style.display = "block";
        document.querySelector('div#end-day').style.display = "block";
        document.querySelector('div#end-month').style.display = "block";

    } else if(document.querySelector('input#option2').checked == true)
    {
        document.querySelector('div#start-day').style.display = "none";
        document.querySelector('div#start-month').style.display = "block";
        document.querySelector('div#end-day').style.display = "none";
        document.querySelector('div#end-month').style.display = "block";

    } else if (document.querySelector('input#option3').checked == true)
    {
        document.querySelector('div#start-day').style.display = "none";
        document.querySelector('div#start-month').style.display = "none";
        document.querySelector('div#end-day').style.display = "none";
        document.querySelector('div#end-month').style.display = "none";
    }
}
