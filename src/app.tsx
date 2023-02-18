import { useEffect, useState } from 'preact/hooks';
import Event from './Event';

export const OREGON_FAIRGORUNDS = new Date('Mar 23 2023');
export const WILSONVILLE = new Date('Mar 9 2023');

const App = () => {
    return (
        <div class="flex flex-col items-center justify-center h-full py-20 mb-5">
            <h1 class="text-4xl font-bold md:text-5xl md:font-normal lg:text-8xl my-10">
                Upcoming 3636 Events
            </h1>
            <div class="flex flex-col lg:flex-row h-full">
                <Event
                    date={WILSONVILLE}
                    name="Wilsonville"
                />
                <Event
                    date={OREGON_FAIRGORUNDS}
                    name="Oregon Fairgrounds"
                />
            </div>
        </div>
    );
};

export default App;
