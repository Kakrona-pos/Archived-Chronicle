// api.js - Robust fetcher for Wikimedia "On This Day"
const BASE_URL = "https://en.wikipedia.org/api/rest_v1/feed/v1/wikipedia/en/onthisday";

/**
 * Fetches historical data and cleans it for the UI.
 * @param {string} type - 'all', 'selected', 'births', 'deaths', or 'holidays'
 * @param {number|string} mm - Month (1-12)
 * @param {number|string} dd - Day (1-31)
 */
export async function getEvents(type = 'selected', mm, dd) {
    //format padding: Ensures '3' becomes '03' as required by Wikimedia
    const month = String(mm).padStart(2, '0');
    const day = String(dd).padStart(2, '0');

    try {
        const response = await fetch(`${BASE_URL}/${type}/${month}/${day}`);

        if (!response.ok) {
            throw new Error(`Wikimedia API Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        //handle the 'all' type case
        //if 'all' is requested, we might want to default to 'selected' events 
        // or return the whole object depending on app.js logic.
        const rawList = type === 'all' ? data.selected : data[type];

        if (!rawList) return [];

        //Data Transformation: Clean the "noisy" API response
        //ensuring app.js gets exactly what it needs to show on the front page.
        return rawList.map(item => ({
            year: item.year || "N/A",
            title: item.text,
            description: item.pages?.[0]?.extract || "No further details available.",
            thumbnail: item.pages?.[0]?.thumbnail?.source || null, // UI can show a placeholder if null
            articleUrl: item.pages?.[0]?.content_urls?.desktop?.page || "#"
        }));

    } catch (error) {
        console.error("Critical Backend Error:", error.message);
        //Returning an empty array prevents app.js from breaking (no .map() errors)
        return [];
    }
}