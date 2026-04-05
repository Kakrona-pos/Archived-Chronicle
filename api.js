// api.js - Robust fetcher for Wikimedia "On This Day"
const BASE_URL = "https://en.wikipedia.org/api/rest_v1/feed/v1/wikipedia/en/onthisday";

/**
 * Fetches historical data and cleans it for the UI.
 * @param {string} type - 'all', 'selected', 'births', 'deaths', or 'holidays'
 * @param {number|string} mm - Month (1-12)
 * @param {number|string} dd - Day (1-31)
 */
export async function getEvents(type = 'selected', mm, dd) {
    const month = String(mm).padStart(2, '0');
    const day = String(dd).padStart(2, '0');

    try {
        const response = await fetch(`${BASE_URL}/${type}/${month}/${day}`);

        if (!response.ok) {
            throw new Error(`Wikimedia API Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        // IMPROVED: Handle the 'all' type by merging categories
        let rawList = [];
        if (type === 'all') {
            rawList = [
                ...(data.selected || []),
                ...(data.births || []),
                ...(data.deaths || []),
                ...(data.holidays || [])
            ];
        } else {
            rawList = data[type] || [];
        }

        if (rawList.length === 0) return [];

        // Data Transformation: Keep only what the UI needs
        return rawList.map(item => ({
            year: item.year || "N/A",
            title: item.text,
            description: item.pages?.[0]?.extract || "No further details available.",
            thumbnail: item.pages?.[0]?.thumbnail?.source || null, 
            articleUrl: item.pages?.[0]?.content_urls?.desktop?.page || "#"
        }));

    } catch (error) {
        console.error("Critical Backend Error:", error.message);
        return [];
    }
}