import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import { useState, useEffect } from 'react';
import 'react-circular-progressbar/dist/styles.css'
import TimePicker from 'react-time-picker';

function Timer() {
    const [date, setDate] = useState(new Date());
    const [wakeTime, onWakeTimeChange] = useState('7:00');
    const [bedTime, onBedTimeChange] = useState('23:00');
    const timeAwake = getTimeDifference(wakeTime, bedTime);
    const minutesIntoDay = getTimeDifference(wakeTime, usTimeInEuropean(date))
    const minutesFromMidnights = getTimeDifference("00:00", usTimeInEuropean(date));
    const awakeColor = "#f54e4e";
    const asleepColor = "#bf00ff";
    
    function getDayNight(wakeTime, bedTime, minutesFromMidnights) {
      if (wakeTime == null) { wakeTime = "07:00" };
      if (bedTime == null) { bedTime = "23:00" };

      const wakeMinutes = parseInt(wakeTime.slice(0,2))*60 + parseInt(wakeTime.slice(3,5));
      const bedMinutes = parseInt(bedTime.slice(0,2))*60 + parseInt(bedTime.slice(3,5));

      if (wakeMinutes < bedMinutes) {
        if (minutesFromMidnights > bedMinutes || minutesFromMidnights < wakeMinutes) { return "night"; }
        else { return "day"; } 
      } else {
        if (minutesFromMidnights < bedMinutes || minutesFromMidnights > wakeMinutes) { return "night"; }
        else { return "day"; } 
      }
    }

    function getPercentThrough(wakeTime, bedTime, minutesFromMidnights) {
      if (wakeTime == null) { wakeTime = "07:00" };
      if (bedTime == null) { bedTime = "23:00" };

      const wakeMinutes = parseInt(wakeTime.slice(0,2))*60 + parseInt(wakeTime.slice(3,5));
      const bedMinutes = parseInt(bedTime.slice(0,2))*60 + parseInt(bedTime.slice(3,5));

      var timeDifferenceMinutes;

      if (wakeMinutes < bedMinutes) {
        if (minutesFromMidnights > bedMinutes || minutesFromMidnights < wakeMinutes) {
          // sleeping
          timeDifferenceMinutes = wakeMinutes - minutesFromMidnights;
          if (timeDifferenceMinutes < 0) timeDifferenceMinutes += 24*60;
          return Math.trunc((timeDifferenceMinutes / (24*60 - timeAwake))*100);
        } else {
          timeDifferenceMinutes = bedMinutes - minutesFromMidnights;
          return Math.trunc((timeDifferenceMinutes / timeAwake)*100);
        }
      } else {
        if (minutesFromMidnights > bedMinutes && minutesFromMidnights < wakeMinutes) {
          // sleeping
          timeDifferenceMinutes = wakeMinutes - minutesFromMidnights;
          if (timeDifferenceMinutes < 0) timeDifferenceMinutes += 24*60;
          return Math.trunc((timeDifferenceMinutes / (24*60 - timeAwake))*100);
        } else {
          timeDifferenceMinutes = bedMinutes - minutesFromMidnights;
          return Math.trunc((timeDifferenceMinutes / timeAwake)*100);
        }
      }
    }

    function getPathColor(wakeTime, bedTime, minutesFromMidnights) {
      if (wakeTime == null) { wakeTime = "07:00" };
      if (bedTime == null) { bedTime = "23:00" };

      const wakeMinutes = parseInt(wakeTime.slice(0,2))*60 + parseInt(wakeTime.slice(3,5));
      const bedMinutes = parseInt(bedTime.slice(0,2))*60 + parseInt(bedTime.slice(3,5));

      if (wakeMinutes < bedMinutes) {
        if (minutesFromMidnights > bedMinutes || minutesFromMidnights < wakeMinutes) {
          // sleeping
          return asleepColor;
        } else {
          // awake
          return awakeColor;
        }
      } else {
        if (minutesFromMidnights < bedMinutes || minutesFromMidnights > wakeMinutes) {
          // sleeping
          return asleepColor;
        } else {
          // awake
          return awakeColor;
        }
      }
    }

    function getTimerText(wakeTime, bedTime, minutesFromMidnights) {
      if (wakeTime == null) { wakeTime = "07:00" };
      if (bedTime == null) { bedTime = "23:00" };

      const wakeMinutes = parseInt(wakeTime.slice(0,2))*60 + parseInt(wakeTime.slice(3,5));
      const bedMinutes = parseInt(bedTime.slice(0,2))*60 + parseInt(bedTime.slice(3,5));

      if (minutesFromMidnights > bedMinutes || minutesFromMidnights < wakeMinutes) {
        // sleeping
        return "left of sleep.";
      } else {
        // awake
        return "left until bedtime.";
      }
    }

    function usTimeInEuropean(time) {
      const str = time.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})
      var hour = str.slice(0,2);
      const min = str.slice(3,5);

      if (str.slice(6,8) === "PM") {
        hour = (parseInt(hour) + 12).toString()
      }

      return hour + ":" +min;
    }

    function getTimeDifference(wakeTime, bedTime) {
      // Bed time is always assumed to be later than wake time - even if it means adding a day

      if (wakeTime == null) { wakeTime = "07:00" };
      if (bedTime == null) { bedTime = "23:00" };

      const wakeMinutes = parseInt(wakeTime.slice(0,2))*60 + parseInt(wakeTime.slice(3,5));
      const bedMinutes = parseInt(bedTime.slice(0,2))*60 + parseInt(bedTime.slice(3,5));

      var timeDifferenceMinutes = bedMinutes - wakeMinutes;
      if (bedMinutes < wakeMinutes) {
        timeDifferenceMinutes += 24*60;
      }
      return timeDifferenceMinutes;
    }

    function refreshClock() {
        setDate(new Date());
    }

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

    function getHoursLeftString(wakeTime, bedTime, minutesFromMidnights) {
      if (wakeTime == null) { wakeTime = "07:00" };
      if (bedTime == null) { bedTime = "23:00" };

      const wakeMinutes = parseInt(wakeTime.slice(0,2))*60 + parseInt(wakeTime.slice(3,5));
      const bedMinutes = parseInt(bedTime.slice(0,2))*60 + parseInt(bedTime.slice(3,5));

      var timeDifferenceMinutes;
      if (minutesFromMidnights > bedMinutes || minutesFromMidnights < wakeMinutes) {
        // sleeping
        timeDifferenceMinutes = wakeMinutes - minutesFromMidnights;
        if (timeDifferenceMinutes < 0) timeDifferenceMinutes += 24*60

      } else {
        timeDifferenceMinutes = bedMinutes - minutesFromMidnights;
      }

      const hours = Math.floor(timeDifferenceMinutes / 60);
      const mins = timeDifferenceMinutes % 60;

      return hours.toString() +"h" + mins.toString() + "m";
    }

    useEffect(() => {
        const timerId = setInterval(refreshClock, 1000);
        return function cleanup() {
          clearInterval(timerId);
        };
      }, []);

    return (
      <div>
        <div><h1 style= {{margin: 0}}>{date.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}</h1></div>
        <div>Your days are <b>{getHoursString(timeAwake)}</b> long</div>
        <div style= {{marginBottom: 16}}>You sleep <b>{getHoursString((24*60) - timeAwake)}</b> a night.</div>
        <div>
          <CircularProgressbarWithChildren value={getPercentThrough(wakeTime, bedTime, minutesFromMidnights)} text={getHoursLeftString(wakeTime, bedTime, minutesFromMidnights)} styles={buildStyles({
              textColor:'#eee',
              pathColor:getPathColor(wakeTime, bedTime, minutesFromMidnights),
              tailColor:'rgba(255,255,255,.2)',
              strokeLinecap: 'butt'
          }
          )}>
            <p style={{ marginTop: 90 }}>{getTimerText(wakeTime, bedTime, minutesFromMidnights)}</p>
          </CircularProgressbarWithChildren>
        </div>
        <div>
          <p style={{marginBottom: 0}}>You are <b>{getPercentThrough(wakeTime, bedTime, minutesFromMidnights)}% complete </b> with your {getDayNight(wakeTime, bedTime, minutesFromMidnights)},</p>
          <p style={{marginTop: 0}}><b>{getHoursString(minutesIntoDay)} </b> in.</p>
        </div>
        <div style= {{marginBottom: 4}}>I wake up at:</div>
        <div style= {{marginBottom: 7}}>
          <TimePicker onChange={onWakeTimeChange} value={wakeTime} disableClock={true}/>
        </div>
        <div style= {{marginBottom: 4}}>I go to bed at:</div>
        <div>
          <TimePicker onChange={onBedTimeChange} value={bedTime} disableClock={true}/>
        </div>
      </div>
    );
}

export default Timer;

// BUG 2: If you wake up time is = to your bed time you get strange behavior

// Next features:
// there should be a demarcated area on the ring for bedtime and daytime routines
// list of tasks to do for the day (can check them off) and your time estimates, it will tell you how long the remaining tasks take and if you have enough time to complete them. Can somehow mix in with daily tasks.
// Add rituals / prayers.