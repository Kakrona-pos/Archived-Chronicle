// app.js
import { getEvents } from './api.js';

async function initProject() {
    // We use March 25 as the test
    const data = await getEvents('all', 3, 25);
    
    if (data) {
        console.log("✅ SUCCESS! Data found:", data);
    } else {
        console.log("❌ Still getting an error.");
    }
}

initProject();