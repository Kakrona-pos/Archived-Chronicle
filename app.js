// app.js - Logic controller for Archived World
import { getEvents } from './api.js';

/**
 * Core Function: Handles the "Time Travel" logic and prepares events for the UI
 * @param {string} type - 'selected', 'births', etc.
 * @param {number} mm - Optional month
 * @param {number} dd - Optional day
 */
async function displayHistoricalData(type = 'selected', mm, dd) {
    // 1. Automatic Date Logic: If no date is passed, use today's date
    const today = new Date();
    const month = mm || (today.getMonth() + 1);
    const day = dd || today.getDate();

    console.log(`--- 🚀 Time Traveling to: ${month}/${day} (${type}) ---`);

    const results = await getEvents(type, month, day);

    if (results.length === 0) {
        console.warn("⚠️ No history found for this specific timeline.");
        return [];
    }

    // 2. FEATURE: Randomize the "Time Travel" 
    // This shuffles the array so you don't always see the same 5 events
    const shuffled = results.sort(() => 0.5 - Math.random());

    // 3. FEATURE: Show 3-5 unique events
    const displayList = shuffled.slice(0, 5);

    displayList.forEach((item, index) => {
        // Updated to match the "Clean" properties from our new api.js
        console.log(`${index + 1}. [Year ${item.year}] - ${item.title}`);
        
        if (item.thumbnail) {
            console.log(`   📸 Image: ${item.thumbnail}`);
        }
        
        console.log(`   🔗 Read more: ${item.articleUrl}`);
    });

    // Return the list so your frontend (HTML/CSS) can use it later
    return displayList;
}

// Example usage:
displayHistoricalData('selected');