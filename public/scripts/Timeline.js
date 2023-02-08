
function PixelsByScale(Pixels) {
  
    if (document.querySelector('input#optionDecade').checked == true) {
        let Pixels.pixelsForDay = null;
        let Pixels.pixelsForWeek = null;
        let Pixels.pixelsForMonth = null;
        let Pixels.pixelsForYear = null;
        let Pixels.pixelsForDecade = 1;
        let Pixels.pixelsForCentury = 10;
        let Pixels.pixelsForMillennium = 100;
    }
}

function CalculateBar(Date) {

    let Date.DateDay = document.querySelector('input#option1').value
    let Date.DateMonth = document.querySelector('input#option1').value
    let Date.DateYear = document.querySelector('input#option1').value

    PixelsByScale (Date)


}