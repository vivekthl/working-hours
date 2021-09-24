export class Stopwatch
{
    constructor()
    {
        this.timeElapsed = 2; //since start of timer
        this.previousTime = 0;
        this.timerId = null;

        this.seconds = 0;
        this.minutes = 0;
        this.hours = 0;

    }

    getLengthAdjustedTimeUnitString(timeUnitStr)
    {
        console.log("length of timeunit: " + timeUnitStr.length);
        if(1 == timeUnitStr.length)
        {
            return "0" + timeUnitStr;
        }
        return timeUnitStr;
    }
    

    getTimeAsString()
    {
        return (this.getLengthAdjustedTimeUnitString(this.hours.toString()) + ":" +
                this.getLengthAdjustedTimeUnitString(this.minutes.toString()) + ":" +
                this.getLengthAdjustedTimeUnitString(this.seconds.toString()));
    }

    getHours()
    {
        return this.hours;
    }

    getMinutes()
    {
        return this.minutes;
    }

    getSeconds()
    {
        return this.seconds;
    }

    start()
    {
        clearInterval(this.timerId);
        this.previousTime = Date.now();
//        console.log(this.timeElapsed);
        this.timerId = setInterval(this.update.bind(this), 200);
    }

    restart()
    {
        this.timeElapsed = 0;

    }

    stop(){
        clearInterval(this.timerId);
        this.update();
    }
    
    pause()
    {
        clearInterval(this.timerId);
        this.update();
    }

    resume()
    {

    }

    setTime(timeElapsedInSeconds){
        this.timeElapsed = timeElapsedInSeconds*1000;
        this.updateForTimeElapsed();
    }

    updateForTimeElapsed(){
        var timeElapsedInSeconds = Math.floor(this.timeElapsed/1000);
        this.seconds = timeElapsedInSeconds%60;
        this.minutes = Math.floor(timeElapsedInSeconds/60)%60;
        this.hours = Math.floor(timeElapsedInSeconds/3600)%24;
    }
    
    update()
    {
        var currentTime = Date.now();
        this.timeElapsed = this.timeElapsed + currentTime - this.previousTime;
        this.previousTime = currentTime;
        
        var timeElapsedInSeconds = Math.floor(this.timeElapsed/1000);
        this.seconds = timeElapsedInSeconds%60;
        this.minutes = Math.floor(timeElapsedInSeconds/60)%60;
        this.hours = Math.floor(timeElapsedInSeconds/3600)%24;

//        console.log(this.timeElapsed + currentTime - this.previousTime);
//        console.log(this.getTimeAsString());
    }


}
