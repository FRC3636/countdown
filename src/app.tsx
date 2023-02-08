import { h } from 'preact';
import style from './app.module.css';
import { useEffect, useState } from 'preact/hooks';

const dates = [
    new Date('Feb 08 2023'),
    new Date('Feb 09 2023'),
    new Date('Feb 11 2023'),
    new Date('Feb 11 2023'),
    new Date('Feb 14 2023'),
    new Date('Feb 15 2023'),
    new Date('Feb 18 2023'),
    new Date('Feb 21 2023'),
    new Date('Feb 22 2023'),
    new Date('Feb 28 2023'),
    new Date('Mar 01 2023'),
    new Date('Mar 04 2023'),
    new Date('Mar 07 2023'),
    new Date('Mar 08 2023'),
    new Date('Mar 09 2023'),
    new Date('Mar 14 2023'),
    new Date('Mar 15 2023'),
    new Date('Mar 18 2023'),
    new Date('Mar 21 2023'),
    new Date('Mar 22 2023'),
    new Date('Mar 23 2023'),
    new Date('Mar 25 2023'),
    new Date('Mar 28 2023'),
    new Date('Mar 29 2023'),
    new Date('Apr 04 2023'),
    new Date('Apr 05 2023'),
    new Date('Apr 11 2023'),
    new Date('Apr 12 2023'),
    new Date('Apr 18 2023'),
    new Date('Apr 19 2023'),
    new Date('Apr 25 2023'),
    new Date('Apr 26 2023')
];

const OREGON_FAIRGORUNDS = new Date('Mar 23 2023');
const WILSONVILLE = new Date('Mar 9 2023');

// This was taken from Ben's app script
// That's why it's so fucking bad lmfao
function daysUntil(date1: Date, date2: Date) {
    let DifferenceInTime = date2.getTime() - date1.getTime();
    let DifferenceInSeconds = (DifferenceInTime / 1000) % 60;
    let DifferenceInMinutes = (DifferenceInTime / (1000 * 60)) % 60;
    let DifferenceInHours = (DifferenceInTime / (1000 * 3600)) % 24;
    let DifferenceInDays = DifferenceInTime / (1000 * 3600 * 24);

    return [
        DifferenceInDays,
        DifferenceInHours,
        DifferenceInMinutes,
        DifferenceInSeconds
    ];
}

const App = () => {
    let [untilWilsonville, setDaysUntilWilsonville] = useState(
        daysUntil(new Date(), WILSONVILLE)
    );
    let [untilOregonFairgrounds, setDaysUntilFairgrounds] = useState(
        daysUntil(new Date(), OREGON_FAIRGORUNDS)
    );

    useEffect(() => {
        setInterval(
            () => setDaysUntilWilsonville(daysUntil(new Date(), WILSONVILLE)),
            1000
        );
    }, []);

    useEffect(() => {
        setInterval(
            () =>
                setDaysUntilFairgrounds(
                    daysUntil(new Date(), OREGON_FAIRGORUNDS)
                ),
            1000
        );
    }, []);

    debugger;

    return (
        <div class={style.home}>
            <h1>Upcoming 3636 Events</h1>
            <div>
                <h2>Wilsonville</h2>
                <h3>
                    Days until Wilsonville:{' '}
                    {Math.floor(
                        (WILSONVILLE.getTime() - Date.now()) /
                            (1000 * 60 * 60 * 24)
                    )}
                </h3>
                <h3>
                    Meetings until Wilsonville:{' '}
                    {dates.filter((date) => date < WILSONVILLE).length}
                </h3>
                <h3>
                    {untilWilsonville[0]} days, {untilWilsonville[1]} hours,{' '}
                    {untilWilsonville[2]} minutes, and {untilWilsonville[3]}{' '}
                    seconds.
                </h3>
            </div>
            <br></br>
            <div>
                <h2>Oregon State Fairgrounds</h2>
                <h3>
                    Days until Oregon State Fairgrounds:{' '}
                    {Math.floor(
                        (OREGON_FAIRGORUNDS.getTime() - Date.now()) /
                            (1000 * 60 * 60 * 24)
                    )}
                </h3>
                <h3>
                    Meetings until Oregon State Fairgrounds:{' '}
                    {dates.filter((date) => date < OREGON_FAIRGORUNDS).length}
                </h3>
                <h3>
                    {untilOregonFairgrounds[0]} days,{' '}
                    {untilOregonFairgrounds[1]} hours,{' '}
                    {untilOregonFairgrounds[2]} minutes, and{' '}
                    {untilOregonFairgrounds[3]} seconds.
                </h3>
            </div>

            <h6>Zac made this btw</h6>
        </div>
    );
};

export default App;
