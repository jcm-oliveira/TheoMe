import {Period} from '../scripts/database.js'


// CONVERTION REALDATE TO PIXELDATE

for (let i = 0; i < 7; i++) {
    ConvertionRealdateToPixeldate(Period[i].id, Period[i].startDateYear, Period[i].duration)
}

function ConvertionRealdateToPixeldate(idPeriod, timelineRealDate, duration) {
    console.log('Script iniciado')   
    console.log(idPeriod)
    console.log(timelineRealDate)
    console.log(duration)

    let marginTitle = 150
    let minimunScaleRule = -2100
    let timePixelDate = (timelineRealDate - minimunScaleRule) + marginTitle
    console.log(timePixelDate)

    document.getElementById(idPeriod).style.left = timePixelDate + "px";
    document.getElementById(idPeriod).style.width = duration + "px";
}



