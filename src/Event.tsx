const DAYS = 1000 * 60 * 60 * 24;
const HOURS = 1000 * 60 * 60;
const MINUTES = 1000 * 60;
const SECONDS = 1000;

export default function Event(props: {
    date: Date;
    name: string;
    allMeetings: Date[];
}) {
    const meetingsUntil = props.allMeetings.filter(
        (date) => date < props.date
    ).length;

    const difference = props.date.getTime() - Date.now();

    // each variable does not include the last, so e.g. hours is always under 24
    const daysUntil = Math.floor(difference / DAYS);
    const hoursUntil = Math.floor((difference % DAYS) / HOURS);
    const minutesUntil = Math.floor((difference % HOURS) / MINUTES);
    const secondsUntil = Math.floor((difference % MINUTES) / SECONDS);

    return (
        <div class="flex flex-col gap-4 border shadow-lg dark:shadow-none p-4 rounded-lg my-5">
            <h2 class="text-4xl mb-3">{props.name}</h2>
            <div class="flex flex-col gap-2 text-xl">
                <UpcomingDate date={props.date} />
                <h3 class="text-2xl">
                    <span class="font-bold">{meetingsUntil}</span> meetings away
                </h3>
            </div>
        </div>
    );
}

function UpcomingDate(props: { date: Date }) {
    const difference = props.date.getTime() - Date.now();

    // each variable does not include the last, so e.g. hours is always under 24
    const daysUntil = Math.floor(difference / DAYS);
    const hoursUntil = Math.floor((difference % DAYS) / HOURS);
    const minutesUntil = Math.floor((difference % HOURS) / MINUTES);
    const secondsUntil = Math.floor((difference % MINUTES) / SECONDS);

    return (
        <div class="flex gap-4">
            <h3 class="text-2xl font-bold">T minus:</h3>
            <h3 class="text-2xl">
                {daysUntil} days, {hoursUntil} hours, {minutesUntil} minutes,
                and {secondsUntil} seconds
            </h3>
        </div>
    );
}
