const ruler = {
    pixelsForDay: null,
    pixelsForWeek: null,
    pixelsForMonth: null,
    pixelsForYear: 1,
    pixelsForDecade: 1,
    pixelsForCentury: 10,
    pixelsForMillennium: 100
};


// CHECK THE SCALE RULER OPTION SELECTED AND BUILD THE RULER

function RulerBuilder(ruler) {
  
    if (document.querySelector('input#optionDecade').checked == true) {
        ruler.pixelsForDay = null;
        ruler.pixelsForWeek = null;
        ruler.pixelsForMonth = null;
        ruler.pixelsForYear = 1;
        ruler.pixelsForDecade = 1;
        ruler.pixelsForCentury = 10;
        ruler.pixelsForMillennium = 100;
    }     
        else if (document.querySelector('input#optionDecade').checked == true) {
            ruler.pixelsForDay = null;
            ruler.pixelsForWeek = null;
            ruler.pixelsForMonth = null;
            ruler.pixelsForYear = null;
            ruler.pixelsForDecade = 1;
            ruler.pixelsForCentury = 10;
            ruler.pixelsForMillennium = 100;
        } 
            else if (document.querySelector('input#optionCentury').checked == true) {
                ruler.pixelsForDay = null;
                ruler.pixelsForWeek = null;
                ruler.pixelsForMonth = null;
                ruler.pixelsForYear = null;
                ruler.pixelsForDecade = null;
                ruler.pixelsForCentury = 1;
                ruler.pixelsForMillennium = 10;
            }
                else if (document.querySelector('input#optionMillennium').checked == true) {
                    ruler.pixelsForDay = null;
                    ruler.pixelsForWeek = null;
                    ruler.pixelsForMonth = null;
                    ruler.pixelsForYear = null;
                    ruler.pixelsForDecade = null;
                    ruler.pixelsForCentury = null;
                    ruler.pixelsForMillennium = 1;
                }

    return (Ruler)
}

// CONVERTION REALDATE TO PIXELDATE

function ConvertionRealdateToPixeldate(timelineRealDate, idTimeline) {
    console.log('Scrit iniciado')    
    
    let teste = timelineRealDate * 2
    console.log(teste)
    
    let id = idTimeline
    console.log(id)

    document.querySelector('div#abc').style.left = "500px";
    document.querySelector('div#abc').style.width = "500px";
    
}

// RECEIVE TIMELINE INPUTS AND CREATE THE TIMELINE BAR

function BarCreation(timelinePixelDate) {

}