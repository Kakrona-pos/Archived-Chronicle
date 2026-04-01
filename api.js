// api.js - Backend & API Logic
const BASE_URL = "https://en.wikipedia.org/api/rest_v1/feed/v1/wikipedia/en/onthisday";

/**
 * Core API Function: Fetches historical data
 */
export async function getEvents(type = 'all', month, day) {
    // 1. Force two-digit formatting
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    
    const url = `${BASE_URL}/${type}/${mm}/${dd}`;

    console.log("🔗 URL being tested:", url);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                // IMPORTANT: Wikimedia requires a User-Agent to prevent 404/403 errors
                'Api-User-Agent': 'ArchivedWorld/1.0 (https://github.com/Kakrona-pos/Archived-Chronicle.git;'
            }
        });

        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("❌ API Fetch Failed:", error.message);
        return null;
    }
}

/**
 * Favorites System: Saves to LocalStorage
 */
export const saveToFavorites = (eventObj) => {
    const favorites = JSON.parse(localStorage.getItem('archived_favorites')) || [];
    if (!eventObj.pages || !eventObj.pages[0]) return;
    
    const pageId = eventObj.pages[0].pageid;
    const exists = favorites.some(fav => fav.pages[0].pageid === pageId);
    
    if (!exists) {
        favorites.push(eventObj);
        localStorage.setItem('archived_favorites', JSON.stringify(favorites));
        console.log("⭐ Saved!");
    }
};