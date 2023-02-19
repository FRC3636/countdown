import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Suspense, lazy } from 'preact/compat';

const DAYS = 1000 * 60 * 60 * 24;
const HOURS = 1000 * 60 * 60;
const MINUTES = 1000 * 60;
const SECONDS = 1000;

export default function Event(props: { date: Date; name: string }) {
    return (
        <div class="flex flex-col gap-4 border p-4 rounded-lg m-5">
            <h2 class="text-4xl md:text-5xl mb-5 underline">{props.name}</h2>
            <UpcomingDate date={props.date} />
        </div>
    );
}

interface CalendarItem {
    status: string;
    summary: string;
    start: {
        dateTime?: string;
    };
}

async function getMeetingsUntil(): Promise<FunctionComponent<{ event: Date }>> {
    const filterDate = new Date(Date.now()).toISOString();
    let res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/ghsrobotics3636@gmail.com/events?showDeleted=false&maxResults=2500&orderBy=updated&timeMin=${filterDate}`,
        {
            headers: {
                'X-goog-api-key': 'AIzaSyDez4WTShYYZJfCQ3zMJYr-Vp9KGFk-fcI'
            }
        }
    );
    let data = (await res.json()) as { items: CalendarItem[] };
    console.log(JSON.stringify(data, null, 4));

    return ({ event }) => {
        let finalMeetings = 0;

        for (const item of data.items) {
            // the showDeleted parameter filters out most of the cancelled events
            // but not all of them. it filters out about
            // 7 kib worth of data and then just gives up on two events
            if (item.status == 'cancelled') continue;

            // we should ignore non-meetings (e.g. events, etc)
            // e.g. "Robotics Meeting" -> "robotics meeting" -> contains "meeting"
            if (!item.summary.toLowerCase().includes('meeting')) continue;

            if (!item.start.dateTime) continue;
            const meetingTime = new Date(item.start.dateTime).getTime();
            const currentTime = Date.now();
            console.log('made it here 1');
            // if the event is before the date
            const eventDate = event.getTime();
            if (meetingTime < eventDate && meetingTime > currentTime) {
                console.log(new Date(item.start.dateTime));
                finalMeetings++;
            }
            console.log('made it here 2');
        }

        return <>{finalMeetings}</>;
    };
}

const MeetingsUntil = lazy(getMeetingsUntil);

function UpcomingDate(props: { date: Date }) {
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
                <Suspense fallback="Loading meetings...">
                    <span class="font-bold">
                        <MeetingsUntil event={props.date} />
                    </span>{' '}
                    meetings away
                </Suspense>
            </h3>
        </div>
    );
}
