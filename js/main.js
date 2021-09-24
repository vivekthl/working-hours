import {Stopwatch} from "./stopwatch.js"

var sw;
var timerId;
var DateToWorkingHoursMap;

// key handlers
export function startStopButtonKeyHandler(event)
{
    console.log("keyhandler");
    console.log(event.key);
    if(document.getElementById("button").innerHTML == "Start" &&
       's' == event.key)
    {
        console.log("start");
        document.getElementById("button").innerHTML = "Stop";
        start();
    }
    else if(document.getElementById("button").innerHTML == "Stop" &&
       's' == event.key)
    {
        document.getElementById("button").innerHTML = "Start";
        console.log("stop");
        stop();
    }
}


function getLengthAdjustedTimeUnitString(timeUnitStr)
{
    if(1 == timeUnitStr.length)
    {
        return "0" + timeUnitStr;
    }
    return timeUnitStr;
}

function updateClock()
{
    var hoursStr = (sw.getHours()).toString();
    var minutesStr = (sw.getMinutes()).toString();
    var secondsStr = (sw.getSeconds()).toString();

    
    document.getElementById("hours").innerHTML = getLengthAdjustedTimeUnitString(hoursStr); ;
    document.getElementById("minutes").innerHTML = getLengthAdjustedTimeUnitString(minutesStr);
    document.getElementById("seconds").innerHTML = getLengthAdjustedTimeUnitString(secondsStr);

    //console.log(hoursStr + " " + minutesStr + " " + secondsStr);
    
    var nowDate = new Date(); 
    var date = (getLengthAdjustedTimeUnitString((nowDate.getFullYear()).toString()) + '/' +
                getLengthAdjustedTimeUnitString((nowDate.getMonth()+1).toString()) + '/' +
                getLengthAdjustedTimeUnitString((nowDate.getDate()).toString())); 

    console.log("Value before store: " + sw.getTimeAsString());
    DateToWorkingHoursMap.set(date, sw.getTimeAsString());

    for (let [key, value] of DateToWorkingHoursMap) {
        localStorage.setItem(key, value);
    }      
}

export function init(){
    loadMap();

    sw = new Stopwatch();
    
    if(!(typeof DateToWorkingHoursMap !== 'undefined')){
        DateToWorkingHoursMap = new Map();
        return;
    }
    if(DateToWorkingHoursMap.size == 0){
        return;
    }

    console.log("here");

    //RETRIEVE PREVIOUS DATA;
    var outputDiv = document.getElementById("log");
    var outputStr = "";
    
    var nowDate = new Date(); 
    var date = (getLengthAdjustedTimeUnitString((nowDate.getFullYear()).toString()) + '/' +
                getLengthAdjustedTimeUnitString((nowDate.getMonth()+1).toString()) + '/' +
                getLengthAdjustedTimeUnitString((nowDate.getDate()).toString()));     

    var workingHours = DateToWorkingHoursMap.get(date);
    var workingHoursSplitBySpace = workingHours.split(":");
    var hoursStr = workingHoursSplitBySpace[0];
    var minutesStr = workingHoursSplitBySpace[1];
    var secondsStr = workingHoursSplitBySpace[2];

    document.getElementById("hours").innerHTML = getLengthAdjustedTimeUnitString(hoursStr); ;
    document.getElementById("minutes").innerHTML = getLengthAdjustedTimeUnitString(minutesStr);
    document.getElementById("seconds").innerHTML = getLengthAdjustedTimeUnitString(secondsStr);

    //update internal clock
    var timeElapsedInSeconds = (parseInt(hoursStr)*3600 +
                                parseInt(minutesStr)*60 +
                                parseInt(secondsStr));

    console.log("timeElapsedInSeconds" + timeElapsedInSeconds);
    
    sw.setTime(timeElapsedInSeconds);
    
    console.log("Fetched Time:" + hoursStr + " " + minutesStr + " " + secondsStr);
    
    outputStr = getDateWorkingHoursTable();
    outputDiv.innerHTML = outputStr;    
}

export function buttonClick(){

    if(document.getElementById("button").innerHTML == "Start")
    {
        document.getElementById("button").innerHTML = "Stop";
        start();
    }
    else if(document.getElementById("button").innerHTML == "Stop")
    {
        document.getElementById("button").innerHTML = "Start";        
        stop();
    }

    for (let [key, value] of DateToWorkingHoursMap) {
        localStorage.setItem(key, value);
    }       
}

function start(){
    sw.start();
    timerId = setInterval(updateClock, 200);
}


function stop(){
    clearInterval(timerId);
    sw.stop();
    updateClock();
}




function getDateWorkingHoursTable() {
    var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    
    var ret = "";    
    ret += "<table>";
    for (let [dateStr, workingHours] of DateToWorkingHoursMap){

        var date = new Date(dateStr);
        var month = months[date.getMonth()];
        var day = days[date.getDay()];
        
        ret += "<tr>";
        //console.log(key);
        ret += "<td class='logItem'>";
        ret += day;
        ret += "</td>";

        var dateFormat1 = date.getDate() + " " + month + " " + date.getFullYear();
        ret += "<td class='logItem'>";
        ret += " | ";
        ret += dateFormat1;
        ret += "</td>";
        
        ret += "<td class='logItem'>";
        ret += " | " + workingHours
        ret += "</td>";

        ret += "</tr>";
    }
    ret += "</table>";
    return ret;
}


function loadMap()
{
    var mapTemp = new Map();
    for (var i = 0; i < localStorage.length; i++){
        mapTemp.set(localStorage.key(i),
                    localStorage.getItem(localStorage.key(i)));
    }

    var sortedMap = new Map([...mapTemp].sort());
    DateToWorkingHoursMap = new Map([...sortedMap].reverse());
    

    for (let [key, value] of DateToWorkingHoursMap) {
        console.log(key + ' = ' + value)
    }    
}

export function substract1()
{
    substract(1);
    updateClock();
}

function substract(subMinutes)
{
    console.log("substract" + minutes);
       
    var hours = parseInt(sw.getHours());
    var minutes = parseInt(sw.getMinutes() - subMinutes);
    var seconds = parseInt(sw.getSeconds());

    
    var timeElapsedInSeconds = (hours*3600 +
                                minutes*60 +
                                seconds);

    console.log("timeElapsedInSeconds" + timeElapsedInSeconds);
    
    sw.setTime(timeElapsedInSeconds);
}
