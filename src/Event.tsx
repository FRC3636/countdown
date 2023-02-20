import { useEffect, useState } from 'preact/hooks';
import { SECONDS, MINUTES, HOURS, DAYS, useInterval } from './app';

export default function Event(props: {
    date: Date;
    name: string;
    calItems: Record<string, any>;
}) {
    return (
        <div class="flex flex-col gap-4 border p-4 rounded-lg m-5">
            <h2 class="text-4xl md:text-5xl mb-5 underline">{props.name}</h2>
            <UpcomingDate date={props.date} calItems={props.calItems} />
        </div>
    );
}

function getMeetingsUntil(date: Date, data: Record<string, any>) {
    let finalMeetings = 0;
    // loop through all events
    for (let i = 0; i < data.items.length; i++) {
        // the showDeleted parameter filters out most of the cancelled events
        // but not all of them. it filters out about
        // 7 kib worth of data and then just gives up on two events

        if (data.items[i].status == 'cancelled') continue;
        // if the event is a meeting
        if (data.items[i].summary.toLowerCase().includes('meeting')) {
            if (data.items[i].start.dateTime == undefined) continue;
            const meetingTime = new Date(
                data.items[i].start.dateTime
            ).getTime();
            const currentTime = Date.now();
            // if the event is before the date
            const eventDate = date.getTime();
            if (meetingTime < eventDate && meetingTime > currentTime) {
                finalMeetings++;
            }
        }
    }
    return finalMeetings;
}

function UpcomingDate(props: { date: Date; calItems: Record<string, any> }) {
    const getDifference = () => props.date.getTime() - Date.now();
    const [difference, setDifference] = useState(getDifference());

    // update clock every second
    useInterval(() => setDifference(getDifference()), SECONDS * 1);

    const meetingsUntil = getMeetingsUntil(props.date, props.calItems);

    // each variable does not include the last, so e.g. hours is always under 24
    const daysUntil = Math.floor(difference / DAYS);
    const hoursUntil = Math.floor((difference % DAYS) / HOURS);
    const minutesUntil = Math.floor((difference % HOURS) / MINUTES);
    const secondsUntil = Math.floor((difference % MINUTES) / SECONDS);

    return (
        <div class="flex flex-col gap-6 text-3xl md:text-4xl">
            <h3 class="flex gap-4">
                <span class="font-bold flex-shrink-0">T minus:</span>
                <span>
                    {daysUntil} days, {hoursUntil} hours, {minutesUntil}{' '}
                    minutes, and {secondsUntil} seconds
                </span>
            </h3>
            <h3>
                <span class="font-bold">{meetingsUntil ?? 'Loading...'}</span>{' '}
                meetings away
            </h3>
        </div>
    );
}
