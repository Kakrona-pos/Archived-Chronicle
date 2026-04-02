// app.js - Main logic for Archived World
import { getEvents } from './api.js';

// Core Function: Handles the "Time Travel" and daily display

async function displayHistoricalData(type, month, day) {
    console.log(`--- Loading ${type} for ${month}/${day} ---`);

    const results = await getEvents(type, month, day);

    if (results.length === 0) {
        console.log("No events found for this selection.");
        return;
    }

    // FEATURE: Show 3-5 events 
    const displayList = results.slice(0, 5);

    displayList.forEach((item, index) => {
        // Accessing the year and the text description
        console.log(`${index + 1}. [Year ${item.year || 'N/A'}] - ${item.text}`);
        
        // FEATURE: Visual Media (Check if an image exists in the Wikipedia page data)
        if (item.pages && item.pages[0].thumbnail) {
            console.log(`   📸 Image link: ${item.pages[0].thumbnail.source}`);
        }
    });
}
