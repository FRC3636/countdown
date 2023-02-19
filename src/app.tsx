import { lazy, Suspense, useEffect, useState } from 'preact/compat';
import Event from './Event';

async function getEvents(): Promise<Record<string, any>> {
    const filterDate = new Date().toISOString();
    let res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/ghsrobotics3636@gmail.com/events?showDeleted=false&maxResults=9999&orderBy=updated&timeMin=${filterDate}&singleEvents=true`,
        {
            headers: {
                'X-goog-api-key': 'AIzaSyDez4WTShYYZJfCQ3zMJYr-Vp9KGFk-fcI'
            }
        }
    );
    let data = await res.json();

    let events = {};

    for (const item of data.items) {
        // the showDeleted parameter filters out most of the cancelled events
        // but not all of them. it filters out about
        // 7 kib worth of data and then just gives up on two events
        if (item.status === 'cancelled') continue;

        if (!item.summary.toLowerCase().includes('event')) continue;

        if (!item.start.dateTime) continue;
        const eventTime = new Date(item.start.dateTime).getTime();
        const currentTime = Date.now();
        if (eventTime > currentTime) {
            //@ts-ignore
            events[item.summary] = item;
        }
    }

    return events;
}


const App = () => {
    const [events, setEvents] = useState<any>(null);

    useEffect(() => {
        getEvents().then(setEvents);
    });


    return (
        <div class="flex flex-col items-center justify-center h-full py-20 mb-5">
            <h1 class="text-4xl font-bold md:text-5xl md:font-normal lg:text-8xl my-10">
                Upcoming 3636 Events
            </h1>
            <div class="flex flex-col lg:flex-row h-full">
                {events === null
                    ? <div>Loading...</div>
                    : Object.values(events).map((event: any) => <Event name={event.summary} date={new Date(event.start.dateTime ?? "1970-01-01")} />)}
            </div>
        </div>
    );
};

export default App;
