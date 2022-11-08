import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import { useState, useEffect } from 'react';
import 'react-circular-progressbar/dist/styles.css'
import TimePicker from 'react-time-picker';

function Timer() {
    const [date, setDate] = useState(new Date());
    const dateTime = usTimeInEuropean(date);
    const [wakeTime, onWakeTimeChange] = useState('7:00');
    const [bedTime, onBedTimeChange] = useState('23:00');
    const wakeMinutes = getTimeDifference("00:00", wakeTime);
    const bedMinutes = getTimeDifference("00:00", bedTime);
    const timeMinutes = getTimeDifference("00:00", dateTime);
    const state = getState(wakeMinutes, bedMinutes, timeMinutes);
    const dayLength = getDayLength(wakeMinutes, bedMinutes, state);
    const sleepLength = 24*60 - dayLength;
    const clockTime = getClockTime(dateTime, wakeTime, bedTime, state);
    const awakeColor = "#f54e4e";
    // const awakeColor = "#00d0ff";
    // const awakeColor = "#00ffee";
    const asleepColor = "#bf00ff";
    
    // Clock functions
    function refreshClock() {
      setDate(new Date());
    }

    useEffect(() => {
      const timerId = setInterval(refreshClock, 1000);
      return function cleanup() {
        clearInterval(timerId);
      };
    }, []);

    // Returns the difference in times in minutes: ( firstTime - secondTime ) % 24*60
    // Assumes firstTime and secondTime are in the form hh:mm, and gives them a default value if they are null
    function getTimeDifference(firstTime, secondTime) {
      if (firstTime == null) { firstTime = "07:00" };
      if (secondTime == null) { secondTime = "23:00" };

      const firstMinutes = parseInt(firstTime.slice(0,2))*60 + parseInt(firstTime.slice(3,5));
      const secondMinutes = parseInt(secondTime.slice(0,2))*60 + parseInt(secondTime.slice(3,5));

      var timeDifferenceMinutes = secondMinutes - firstMinutes;
      if (secondMinutes < firstMinutes) {
        timeDifferenceMinutes += 24*60;
      }
      return timeDifferenceMinutes;
    }

    /*
      returns the state of the clock, 0-4
      @params (wakeMinutes, bedMinutes, timeMinutes)
      determines if the user should be asleep or awake
    */
    function getState(wm, bm, tm) {
      if (wm < bm) {
        if (tm <= bm && tm >= wm) return 0; // awake
        else return 1; // asleep

      } else if (wm > bm) {
        if (tm < wm && tm > bm) return 3; // alseep
        else return 2; // awake

      } else if (wm === bm) {
        return 4;
      }
    }

    /*
      Stupid function used to get the current time in hh:mm 
      because I am too lazy to look up how to do it right atm.
    */
    function usTimeInEuropean(time) {
      const str = time.toLocaleTimeString('en-UK', {hour: '2-digit', minute:'2-digit'})
      var hour = str.slice(0,2);
      const min = str.slice(3,5);

      return hour + ":" +min;
    }

    // returns the length of time which the user is awake based on the state
    function getDayLength(wakeMinutes, bedMinutes, state) {
      if (state === 0 || state === 1) return (bedMinutes - wakeMinutes);
      else if (state === 2 || state === 3) return (24*60 - (wakeMinutes - bedMinutes));
      else if (state === 4) return 0;
    }

    // returns the time which should be shown on the clock based on the state, in minutes
    function getClockTime(dateTime, wakeTime, bedTime, state) {
      if (state === 0 || state === 2) return getTimeDifference(dateTime, bedTime);
      else if (state === 1 || state === 3) return getTimeDifference(dateTime, wakeTime);
      else if (state === 4) return 0;
    }

    // returns the percent through the clock which you should be at, based on clock time and state
    function getPercentThrough(dateTime, wakeTime, bedTime, state, dayLength, sleepLength) {
      if (state === 0) return Math.trunc(getTimeDifference(wakeTime, dateTime)*100/dayLength);
      else if (state === 1) return Math.trunc(getTimeDifference(bedTime, dateTime)*100/sleepLength);
      else if (state === 2) return Math.trunc(getTimeDifference(wakeTime, dateTime)*100/dayLength);
      else if (state === 3) return Math.trunc(getTimeDifference(bedTime, dateTime)*100/sleepLength);
      else if (state === 4) return 50;
    }

    function getTimeIntoDay(dateTime, wakeTime, bedTime, state) {
      if (state === 0) return getTimeDifference(wakeTime, dateTime);
      else if (state === 1) return getTimeDifference(bedTime, dateTime);
      else if (state === 2) return getTimeDifference(wakeTime, dateTime);
      else if (state === 3) return getTimeDifference(bedTime, dateTime);
      else if (state === 4) return "42";
    }

    // Turns the time to be shown on the clock in minutes into an apporpriate string
    function getHoursLeftString(timeDifferenceMinutes) {
      const hours = Math.floor(timeDifferenceMinutes / 60);
      const mins = timeDifferenceMinutes % 60;

      if (hours === 0) return mins.toString() +"m";
      if (mins === 0) return hours.toString() +"h";

      return hours.toString() +"h" + mins.toString() + "m";
    }

    // Returns the text to go under the main number in the timer
    function getTimerText(state) {
      if (state === 0 || state === 2) return "left until bedtime.";
      else if (state === 1 || state === 3) return "left of sleep.";
      else if (state === 4) return "You never wake up.";
    }

    // Returns night or day depending on the state
    function getDayNight(state) {
      if (state === 0 || state === 2) return "day";
      else if (state === 1 || state === 3) return "night";
      else if (state === 4) return "eternal slumber";
    }

    // Reutns the path color depending on the state
    function getPathColor(state) {
      if (state === 0 || state === 2) return awakeColor;
      else if (state === 1 || state === 3 || state === 4) return asleepColor;
    }

    // returns a number of minutes into the day as a gramatically correct hours and minutes string
    function getHoursString(timeDifferenceMinutes) {
      const hours = Math.floor(timeDifferenceMinutes / 60);
      const mins = timeDifferenceMinutes % 60;
      
      if (hours === 0 && mins === 1) return "1 minute";
      if (mins === 0 && hours === 1) return "1 hour";
      if (hours === 0) return mins.toString() +" minutes";
      if (mins === 0) return hours.toString() +" hours";
      if (hours === 1 && mins === 1) return "1 hour and 1 minute";
      if (hours === 1) return "1 hour and " + mins.toString() + " minutes";
      if (mins === 1) return hours.toString() +" hours and 1 minute";

      return hours.toString() +" hours and " + mins.toString() + " minutes";
    }

    return (
      <div>
        <div><h1 style= {{margin: 0}}>{date.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}</h1></div>
        <div>Your days are <b>{getHoursString(dayLength)}</b> long</div>
        <div style= {{marginBottom: 16}}>You sleep <b>{getHoursString(sleepLength)}</b> a night.</div>
        <div>
          <CircularProgressbarWithChildren value={getPercentThrough(dateTime, wakeTime, bedTime, state, dayLength, sleepLength)} text={getHoursLeftString(clockTime)} styles={buildStyles({
              textColor:'#eee',
              pathColor:getPathColor(state),
              tailColor:'rgba(255,255,255,.2)',
              strokeLinecap: 'butt'
          }
          )}>
            <p style={{ marginTop: 90 }}>{getTimerText(state)}</p>
          </CircularProgressbarWithChildren>
        </div>
        <div>
          <p style={{marginBottom: 0}}>You are <b>{getPercentThrough(dateTime, wakeTime, bedTime, state, dayLength, sleepLength)}% complete </b> with your {getDayNight(state)},</p>
          <p style={{marginTop: 0}}><b>{getHoursString(getTimeIntoDay(dateTime, wakeTime, bedTime, state))} </b> in.</p>
        </div>
        <div style= {{marginBottom: 4}}>I wake up at:</div>
        <div style= {{marginBottom: 7}}>
          <TimePicker onChange={onWakeTimeChange} value={wakeTime} disableClock={true}/>
        </div>
        <div style= {{marginBottom: 4}}>I go to bed at:</div>
        <div>
          <TimePicker onChange={onBedTimeChange} value={bedTime} disableClock={true}/>
        </div>
        <div style={{ marginTop: 16 }}>
          <a target="_blank" href="https://github.com/jelares/routine-timer">source</a>
        </div>
        <div>
          <a target="_blank" href="https://account.venmo.com/u/Jesus-Lares-1">donations</a>
        </div>
      </div>
    );
}

export default Timer;

// Next features:
// there should be a demarcated area on the ring for bedtime and daytime routines
// list of tasks to do for the day (can check them off) and your time estimates, it will tell you how long the remaining tasks take and if you have enough time to complete them. Can somehow mix in with daily tasks.
// Add rituals / prayers.