import { useEffect, useState } from "preact/hooks";

const DAYS = 1000 * 60 * 60 * 24;
const HOURS = 1000 * 60 * 60;
const MINUTES = 1000 * 60;
const SECONDS = 1000;

export default function Event(props: {
    date: Date;
    name: string;
    allMeetings: Date[];
}) {
    return (
        <div class="flex flex-col gap-4 border p-4 rounded-lg m-5">
            <h2 class="text-4xl md:text-5xl mb-5 underline">{props.name}</h2>
                <UpcomingDate date={props.date} allMeetings={props.allMeetings}/>
        </div>
    );
}

function UpcomingDate(props: { date: Date; allMeetings: Date[] }) {
    const getDifference = () => props.date.getTime() - Date.now();
    const [difference, setDifference] = useState(getDifference());

    useEffect(() => {
        const clock = setInterval(
            () => setDifference(getDifference()),
            SECONDS
        );
        return () => clearInterval(clock);
    }, []);

    // each variable does not include the last, so e.g. hours is always under 24
    const daysUntil = Math.floor(difference / DAYS);
    const hoursUntil = Math.floor((difference % DAYS) / HOURS);
    const minutesUntil = Math.floor((difference % HOURS) / MINUTES);
    const secondsUntil = Math.floor((difference % MINUTES) / SECONDS);
    const meetingsUntil = props.allMeetings.filter(
        (date) => date < props.date
    ).length;

    return (
        <div class="flex flex-col gap-6 text-3xl md:text-4xl">
            <h3 class="flex gap-4">
                <span class="font-bold flex-shrink-0">T minus:</span>
                <span>
                    {daysUntil} days, {hoursUntil} hours, {minutesUntil}{" "}
                    minutes, and {secondsUntil} seconds
                </span>
            </h3>
            <h3>
                <span class="font-bold">{meetingsUntil}</span> meetings away
            </h3>
        </div>
    );
}
