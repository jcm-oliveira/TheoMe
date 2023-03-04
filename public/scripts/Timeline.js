import {Period} from '../scripts/database.js'


// CONVERTION REALDATE TO PIXELDATE

// ConvertionRealdateToPixeldate(Period[0].id, Period[0].startDateYear, Period[0].duration)

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



