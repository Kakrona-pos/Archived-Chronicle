// app.js - Logic controller for Archived Chronicle
import { getEvents } from './api.js';

/**
 * Core Function: Handles the "Time Travel" logic and prepares events for the UI
 * @param {string} type - 'selected', 'births', 'all', etc.
 * @param {number} mm - Optional month
 * @param {number} dd - Optional day
 */
async function displayHistoricalData(type = 'selected', mm, dd) {
    const today = new Date();
    
    // IMPROVED: Using Nullish Coalescing (??) for stricter date defaults
    const month = mm ?? (today.getMonth() + 1);
    const day = dd ?? today.getDate();

    console.log(`--- 🚀 Time Traveling to: ${month}/${day} (${type}) ---`);

    const results = await getEvents(type, month, day);

    if (results.length === 0) {
        console.warn("⚠️ No history found for this specific timeline.");
        return [];
    }

    // Shuffle the array for variety
    const shuffled = results.sort(() => 0.5 - Math.random());

    // Show 3-5 unique events
    const displayList = shuffled.slice(0, 5);

    displayList.forEach((item, index) => {
        console.log(`${index + 1}. [Year ${item.year}] - ${item.title}`);
        
        if (item.thumbnail) {
            console.log(`   📸 Image: ${item.thumbnail}`);
        }
        
        console.log(`   🔗 Read more: ${item.articleUrl}`);
    });

    return displayList;
}

// Example usage:
displayHistoricalData('selected');