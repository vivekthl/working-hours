import {Stopwatch} from "./stopwatch.js"

var sw;
var timerId;
var DateToWorkingHoursMap;

// key handlers
export function startStopButtonKeyHandler(event)
{
//    console.log("keyhandler");
//    console.log(event.key);
    if(document.getElementById("button").innerHTML == "Start" &&
       's' == event.key)
    {
//        console.log("start");
        document.getElementById("button").innerHTML = "Stop";
        start();
    }
    else if(document.getElementById("button").innerHTML == "Stop" &&
       's' == event.key)
    {
        document.getElementById("button").innerHTML = "Start";
//        console.log("stop");
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

//    console.log("time: " + hoursStr + " " + minutesStr + " " + secondsStr);
    
    var nowDate = new Date(); 
    var date = (getLengthAdjustedTimeUnitString((nowDate.getFullYear()).toString()) + '/' +
                getLengthAdjustedTimeUnitString((nowDate.getMonth()+1).toString()) + '/' +
                getLengthAdjustedTimeUnitString((nowDate.getDate()).toString())); 

//    console.log("Value before store: " + sw.getTimeAsString());
    DateToWorkingHoursMap.set(date, sw.getTimeAsString());

    for (let [key, value] of DateToWorkingHoursMap) {
        localStorage.setItem(key, value);
    }      
}

function retrievePreviousCurrentDayData(){
    var nowDate = new Date(); 
    var date = (getLengthAdjustedTimeUnitString((nowDate.getFullYear()).toString()) + '/' +
                getLengthAdjustedTimeUnitString((nowDate.getMonth()+1).toString()) + '/' +
                getLengthAdjustedTimeUnitString((nowDate.getDate()).toString()));     

    var workingHours = DateToWorkingHoursMap.get(date);

    if (typeof workingHours == 'undefined') {
        //we have no data of today to load
        return;
    }
    
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

//    console.log("timeElapsedInSeconds" + timeElapsedInSeconds);
    
    sw.setTime(timeElapsedInSeconds);
    
//    console.log("Fetched Time:" + hoursStr + " " + minutesStr + " " + secondsStr);
}

/*
function retrievePreviousDaysData(){
    var outputDiv = document.getElementById("log");
    var outputStr = "";

    outputStr = getDateWorkingHoursTable();
    outputDiv.innerHTML = outputStr;
    }
*/


function reterievePreviousLogData(){
    if(!(typeof DateToWorkingHoursMap !== 'undefined')){
        DateToWorkingHoursMap = new Map();
        return;
    }
    if(DateToWorkingHoursMap.size == 0){
        return;
    }

    //RETRIEVE PREVIOUS DATA;
//    retrievePreviousDaysData();

    //reterieve data of previous days
    retrievePreviousCurrentDayData();
}

export function init(){

    console.log("Init called..");
    loadMap();

    console.log("Going to update log and stopwatch...");

    //create stop watch instance
    console.log("new stopwatch instance set");
    sw = new Stopwatch();
    
    reterievePreviousLogData();
}

function setFavicon(src){
    document.getElementById("favicon").href = src;
    console.log(document.getElementById("favicon").href);

    //the issue of favicon not changing was that / represents root of
    //domain.  since working-hours app is a directory under it,
    //resources were not found under root.
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
    setFavicon("/working-hours/resources/green.ico");
    sw.start();
    timerId = setInterval(updateClock, 200);
}


function stop(){
    setFavicon("/working-hours/resources/red.ico");
    clearInterval(timerId);
    sw.stop();
    updateClock();
}

Date.prototype.getWeek = function () {
    var target  = new Date(this.valueOf());
    var dayNr   = (this.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    var firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() != 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target) / 604800000);
}

function convertWorkingHoursStrToTimeElapsedInSeconds(workingHoursStr){
    var workingHoursSplitBySpace = workingHoursStr.split(":");
    
    var hoursStr = workingHoursSplitBySpace[0];
    var minutesStr = workingHoursSplitBySpace[1];
    var secondsStr = workingHoursSplitBySpace[2];

    var timeElapsedInSeconds = (parseInt(hoursStr)*3600 +
                                parseInt(minutesStr)*60 +
                                parseInt(secondsStr));

    return timeElapsedInSeconds;
}

function convertWorkingHoursTimeElapsedInSecondsToStr(timeElapsedInSeconds){
    var seconds = timeElapsedInSeconds%60;
    var minutes = Math.floor(timeElapsedInSeconds/60)%60;
    var hours = Math.floor(timeElapsedInSeconds/3600)%24;

    var timeString = (getLengthAdjustedTimeUnitString(hours.toString()) + ":" +
                      getLengthAdjustedTimeUnitString(minutes.toString()) + ":" +
                      getLengthAdjustedTimeUnitString(seconds.toString()));

    return timeString;
}

/*
function getDateWorkingHoursTable() {
    var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    
    var lastWeekNumber = 0;
    var tableRowListString = "";
    var lastWeekTotalTimeElapsedInSeconds = 0;
    
    for (let [dateStr, workingHours] of DateToWorkingHoursMap){

        var date = new Date(dateStr);
        var month = months[date.getMonth()];
        var day = days[date.getDay()];

        if(date.getWeek() > lastWeekNumber && lastWeekNumber != 0) // new week
        {
            var tableRowHeaderString = "<tr>";
            tableRowHeaderString += "<th class='logItem'></th>";            
            tableRowHeaderString += "<th class='logItem'>   </th>" ;

            var totalWorkingHoursOfLastWeek =
                convertWorkingHoursTimeElapsedInSecondsToStr(lastWeekTotalTimeElapsedInSeconds);
            
            tableRowHeaderString += "<th class='logItem'> | " + totalWorkingHoursOfLastWeek +  "  </th>" ;
            
            tableRowHeaderString += " </tr>";
            tableRowListString = tableRowHeaderString + tableRowListString;

            var currentDayTimeElapsedInSeconds =
                convertWorkingHoursStrToTimeElapsedInSeconds(workingHours);

            //reset to new week first log entry
            lastWeekTotalTimeElapsedInSeconds = currentDayTimeElapsedInSeconds;
        }
        else //same week or first week first log entry
        {
            var currentDayTimeElapsedInSeconds =
                convertWorkingHoursStrToTimeElapsedInSeconds(workingHours);
            
            lastWeekTotalTimeElapsedInSeconds += currentDayTimeElapsedInSeconds;
        }
        lastWeekNumber = date.getWeek();
        
        //console.log(key);
        var tableRowString = "<tr>";
        tableRowString += "<td class='logItem'>";
        tableRowString += day;
        tableRowString += "</td>";

        var dateFormat1 = date.getDate() + " " + month + " " + date.getFullYear();
        tableRowString += "<td class='logItem'>";
        tableRowString += " | ";
        tableRowString += dateFormat1;
        tableRowString += "</td>";
        
        tableRowString += "<td class='logItem'>";
        tableRowString += " | " + workingHours
        tableRowString += "</td>";

        tableRowString += "</tr>";
        tableRowListString = tableRowString + tableRowListString;
    }
    var ret = "<table>" + tableRowListString   + "</table>";
    return ret;
}
*/

function loadMap()
{
    var mapTemp = new Map();
    for (var i = 0; i < localStorage.length; i++){
        mapTemp.set(localStorage.key(i),
                    localStorage.getItem(localStorage.key(i)));
    }

    var sortedMap = new Map([...mapTemp].sort());
//    DateToWorkingHoursMap = new Map([...sortedMap].reverse());

    DateToWorkingHoursMap = sortedMap;

    for (let [key, value] of DateToWorkingHoursMap) {
        console.log(key + ' = ' + value)
    }    
}

export function substract1()
{
    substract(1);
    updateClock();
}

export function substract5()
{
    substract(5);
}

export function substract10()
{
    substract(10);
}


function substract(subMinutes)
{
    console.log("substract" + minutes);
       
    var hours = parseInt(sw.getHours());
    var minutes = parseInt(sw.getMinutes());
    var seconds = parseInt(sw.getSeconds());

    var timeElapsedInSeconds = (hours*3600 +
                                minutes*60 +
                                seconds);
    
    if(minutes < 1 && hours < 1)
    {
        return;
    }
    else if(minutes < 1 && hours >= 1)
    {
        var newMinutes = 60 - subMinutes;
        var newHours = hours-1;

        timeElapsedInSeconds = (newHours*3600 +
                                newMinutes*60 +
                                seconds);
    }
    else // minutes > 1 and ( hours < 1 or hours > 1 )
    {
        var newMinutes = minutes - subMinutes;
        timeElapsedInSeconds = (hours*3600 +
                                newMinutes*60 +
                                seconds);
    }
    
    console.log("timeElapsedInSeconds" + timeElapsedInSeconds);
    
    sw.setTime(timeElapsedInSeconds);
    updateClock();
}

export function add1()
{
    add(1);
}

export function add5()
{
    add(5);
}

export function add10()
{
    add(10);
}

export function add1Hour()
{
    add(60);
}


function add(addMinutes)
{
    console.log("add: " + minutes);
       
    var hours = parseInt(sw.getHours());
    var minutes = parseInt(sw.getMinutes());
    var seconds = parseInt(sw.getSeconds());

    var timeElapsedInSeconds = (hours*3600 +
                                minutes*60 +
                                seconds);

    console.log("before-time:"+ timeElapsedInSeconds);
    
    var newMinutes = minutes + addMinutes;

    console.log("newMinutes:" + newMinutes);
    
    timeElapsedInSeconds = (hours*3600 +
                                newMinutes*60 +
                                seconds);

    console.log("after-time:"+ timeElapsedInSeconds);
    
    
    sw.setTime(timeElapsedInSeconds);    
    updateClock();

    var hoursStr = (sw.getHours()).toString();
    var minutesStr = (sw.getMinutes()).toString();
    var secondsStr = (sw.getSeconds()).toString();

    console.log("time: " + hoursStr + " " + minutesStr + " " + secondsStr);

}

export function clear()
{
    console.log("clear " + minutes);
    var timeElapsedInSeconds = 0;
    
    console.log("timeElapsedInSeconds" + timeElapsedInSeconds);
    
    sw.setTime(timeElapsedInSeconds);
    updateClock();
}
