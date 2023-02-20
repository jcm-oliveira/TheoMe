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


//GENERATE TIMELINE





// CONVERTION REALDATE TO PIXELDATE

function ConvertionRealdateToPixeldate(idPeriod, timelineRealDate, duration) {
    console.log('Scrit iniciado')    
    
    console.log(idPeriod.id)
    console.log(timelineRealDate)
    console.log(duration)

    let marginTitle = 150
    let minimunScaleRule = -3000
    let timePixelDate = (timelineRealDate - minimunScaleRule) + marginTitle
    console.log(timePixelDate)

    document.getElementById(idPeriod.id).style.left = timePixelDate + "px";
    document.getElementById(idPeriod.id).style.width = duration + "px";

}

// RECEIVE TIMELINE INPUTS AND CREATE THE TIMELINE BAR

function BarCreation(timelinePixelDate) {

}

// CHECK IF THE BAR IS CONTINUOUS OR EXPANDED

function BarCreation(timelinePixelDate) {

}