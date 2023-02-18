import { useEffect, useState } from "preact/hooks";

const DAYS = 1000 * 60 * 60 * 24;
const HOURS = 1000 * 60 * 60;
const MINUTES = 1000 * 60;
const SECONDS = 1000;

export default function Event(props: {
    date: Date;
    name: string;
}) {
    return (
        <div class="flex flex-col gap-4 border p-4 rounded-lg m-5">
            <h2 class="text-4xl md:text-5xl mb-5 underline">{props.name}</h2>
                <UpcomingDate date={props.date}/>
        </div>
    );
}


function MeetingsUntil(date: Date) {
    let finalMeetings = 0;
    const filterDate = new Date(Date.now()).toISOString();
    fetch(`https://www.googleapis.com/calendar/v3/calendars/ghsrobotics3636%40gmail.com/events?timeMax=${filterDate}&showDeleted=false`, {
        headers: {
            "X-goog-api-key": "AIzaSyDez4WTShYYZJfCQ3zMJYr-Vp9KGFk-fcI",
        },
    })
        .then((response: { json: () => any; }) => response.json())
        .then((data: any) => {
            // loop through all events
            for (let i = 0; i < data.items.length; i++) {
                // the showDeleted parameter filters out most of the cancelled events
                // but not all of them. it filters out about
                // 7 kib worth of data and then just gives up on two events
                // wtf google
                if (data.items[i].status == "cancelled")
                    continue;
                // if the event is a meeting
                if (data.items[i].summary == "Robotics Meeting") {
                    // if the event is before the date
                    if (new Date(data.items[i].start.dateTime) < date) {
                        // add one to the final meetings
                        finalMeetings++;
                    }
                    
                }
            }
            
        }
    );
    return finalMeetings;
}

// async function MeetingsUntil(date: Date) {
//     let finalMeetings = 0;
//     const filterDate = new Date(Date.now()).toISOString();
//     let res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/ghsrobotics3636%40gmail.com/events?timeMax=${filterDate}&showDeleted=false`, {
//         headers: {
//             "X-goog-api-key": "AIzaSyDez4WTShYYZJfCQ3zMJYr-Vp9KGFk-fcI",
//         },
//     })
//     let data = await res.json();
//     // loop through all events
//     for (let i = 0; i < data.items.length; i++) {
//         // the showDeleted parameter filters out most of the cancelled events
//         // but not all of them. it filters out about
//         // 7 kib worth of data and then just gives up on two events
//         // wtf google
//         if (data.items[i].status == "cancelled")
//             continue;
//         // if the event is a meeting
//         if (data.items[i].summary == "Robotics Meeting") {
//             // if the event is before the date
//             if (new Date(data.items[i].start.dateTime) < date) {
//                 // add one to the final meetings
//                 finalMeetings++;
//             }
            
//         }
//     }
//     return finalMeetings;
// }


function UpcomingDate(props: { date: Date; }) {
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
    
    const meetingsUntil = MeetingsUntil(props.date);

    console.log(meetingsUntil);

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
