

// CHECK THE SCALE RULER OPTION SELECTED AND BUILD THE RULER




//GENERATE TIMELINE

import {Period} from '../scripts/database.js'

console.log(Period)

function teste(oi)  {
    console.log("entrou no teste");
    console.log(oi);
}



// CONVERTION REALDATE TO PIXELDATE

function ConvertionRealdateToPixeldate(idPeriod, timelineRealDate, duration) {
    console.log('Script iniciado')   
    console.log(idPeriod.id)
    console.log(timelineRealDate)
    console.log(duration)

    let marginTitle = 150
    let minimunScaleRule = -2100
    let timePixelDate = (timelineRealDate - minimunScaleRule) + marginTitle
    console.log(timePixelDate)

    document.getElementById(idPeriod.id).style.left = timePixelDate + "px";
    document.getElementById(idPeriod.id).style.width = duration + "px";

}

// RECEIVE TIMELINE INPUTS AND CREATE THE TIMELINE BAR



// CHECK IF THE BAR IS CONTINUOUS OR EXPANDED

