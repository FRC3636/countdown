import { lazy, Suspense, useEffect, useState } from 'preact/compat';
import Event from './Event';

export const DAYS = 1000 * 60 * 60 * 24;
export const HOURS = 1000 * 60 * 60;
export const MINUTES = 1000 * 60;
export const SECONDS = 1000;

async function getCalandarItems(): Promise<Record<string, any>> {
    const filterDate = new Date().toISOString();
    let res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/ghsrobotics3636@gmail.com/events?showDeleted=false&maxResults=9999&orderBy=updated&timeMin=${filterDate}&singleEvents=true`,
        {
            headers: {
                'X-goog-api-key': 'AIzaSyDez4WTShYYZJfCQ3zMJYr-Vp9KGFk-fcI'
            }
        }
    );
    if (!res.ok) throw new Error('Error response from google api');
    return await res.json();
}

function getEvents(data: Record<string, any>): Record<string, any> {
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

/**
 * Starts an interval, then cancels it when the component is removed
 *
 * @param runOnStart - Pass `true` to run the function parameter before starting the interval
 */
export function useInterval(
    effect: () => void,
    interval: number,
    runOnStart = false
) {
    // overengineered = yes
    // useEffect wrapper so it only runs once in components
    useEffect(() => {
        if (runOnStart) effect();

        const clock = setInterval(effect, interval);
        // interval stops when the component is removed
        return () => clearInterval(clock);
    }, []);
}

const App = () => {
    const [calItems, setCalItems] = useState<any>(null);
    // refetch data every hour to keep up-to-date without reloads
    useInterval(() => getCalandarItems().then(setCalItems), HOURS * 1, true);

    const events = calItems ? getEvents(calItems) : null;

    return (
        <div class="flex flex-col items-center justify-center h-full py-20 mb-5">
            <h1 class="text-4xl font-bold md:text-5xl md:font-normal lg:text-8xl my-10">
                Upcoming 3636 Events
            </h1>
            <div class="flex flex-col lg:flex-row h-full">
                {events === null ? (
                    <div>Loading...</div>
                ) : (
                    Object.values(events).map((event: any) => (
                        <Event
                            name={event.summary}
                            date={
                                new Date(event.start.dateTime ?? '1970-01-01')
                            }
                            calItems={calItems}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default App;
