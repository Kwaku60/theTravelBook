const API_URL = 'http://localhost:1337';

//exporting to import into app.js file
export async function listLogEntries(){
    const response = await fetch(`${API_URL}/api/logs`);
    return response.json();
}
