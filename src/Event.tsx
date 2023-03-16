import { useEffect, useState } from 'preact/hooks';
import { SECONDS, MINUTES, HOURS, DAYS, useInterval } from './app';

export default function Event(props: {
    date: Date;
    name: string;
    location?: string;
    calItems: Record<string, any>;
}) {
    return (
        <div class="flex flex-col gap-4 border p-4 rounded-lg m-5">
            <h2 class="text-4xl md:text-5xl mb-1 underline">{props.name}</h2>
            <UpcomingDate date={props.date} calItems={props.calItems} />
            {props.location ? (
                <h3 class="text-3xl md:text-4xl">
                    <strong>See you there at:</strong> {props.location}
                </h3>
            ) : null}
        </div>
    );
}

function getMeetingsUntil(date: Date, data: Record<string, any>) {
    const meetingDays = new Set<string>();
    // loop through all events
    for (const item of data.items) {
        // the showDeleted parameter filters out most of the cancelled events
        // but not all of them. it filters out about
        // 7 kib worth of data and then just gives up on two events
        if (item.status == 'cancelled') continue;

        // if the event is a meeting
        if (item.summary.toLowerCase().includes('meeting')) {
            if (item.start.dateTime == undefined) continue;
            const meetingDate = new Date(item.start.dateTime);
            const meetingTimestamp = meetingDate.getTime();
            const currentTime = Date.now();
            // if the event is before the date
            const eventTimestamp = date.getTime();
            if (
                meetingTimestamp < eventTimestamp &&
                meetingTimestamp > currentTime
            ) {
                // drops the time, only has the day. the set will remove duplicates automatically.
                meetingDays.add(meetingDate.toDateString());
            }
        }
    }
    return meetingDays.size;
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeZone: 'America/Vancouver'
});

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
        <>
            <h2 class="flex gap-4 text-4xl md:text-5xl mb-5">
                {dateFormatter.format(props.date)}
            </h2>
            <div class="flex flex-col gap-6 text-3xl md:text-4xl">
                <h3 class="flex gap-4">
                    <span class="font-bold flex-shrink-0">T minus:</span>
                    <span>
                        {daysUntil} days, {hoursUntil} hours, {minutesUntil}{' '}
                        minutes, and {secondsUntil} seconds
                    </span>
                </h3>
                <h3>
                    <span class="font-bold">
                        {meetingsUntil ?? 'Loading...'}
                    </span>{' '}
                    meetings away
                </h3>
            </div>
        </>
    );
}
