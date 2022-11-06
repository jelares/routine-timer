import { useState, useEffect } from 'react';

function TimeAwake() {
    const [date, setDate] = useState(new Date());

    function refreshClock() {
        setDate(new Date());
    }

    useEffect(() => {
        const timerId = setInterval(refreshClock, 1000);
        return function cleanup() {
          clearInterval(timerId);
        };
      }, []);

    return (
      <div>
        <div>{date.toLocaleTimeString('en-US')}</div>
        <div>16.5 total hours</div>
      </div>
    );
}

export default TimeAwake;