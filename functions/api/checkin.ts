import * as jwt from 'jsonwebtoken';
import * as global from './global';
export const onRequest = async (context) => {
const {request} = context; // extract request
  const method = request.method;
  console.log(method);
  
  if (method === 'POST') {
    return await handlePost(context);
  } else if (method === 'GET') {
    return await handleGet(context);
  } else {
    return new Response('Method Not Allowed', { status: 405 });
  }
};

// Handle POST requests to log a streak
const handlePost = async (context) => {
    // Get cookies from the request
    const {request, env} = context;
    console.log(`Request received: ${request.url}`);


    // Access a specific cookie
    const token = await global.getJWTToken(context)
    
    // Create a JSON response if token is not found
    let JSONResponse = await global.responseTokenExists(token);
    if (JSONResponse){
        return JSONResponse;
    }

    try{
        const username = await global.decodeJWTToken(context, token);
        const { date_worked, hours_worked } = await request.json();
    
        const userIdQuery = await env.DB.prepare(`SELECT id FROM user WHERE username = ?`).bind(username).first();
        const userId = userIdQuery.id;
        console.log("The user ID: " + userId);

        // Validate date_worked input
        if (!date_worked) {
            return new Response(JSON.stringify({ error: 'Date worked is required.' }), { status: 400 });
        }

        // Check if streak for the date already exists in D1
        const existingStreakQuery = await env.DB.prepare(`
            SELECT * FROM streaks WHERE user_id = ? AND date_worked = ?
        `).bind(userId, date_worked).first();

        if (existingStreakQuery) {
            return new Response(JSON.stringify({ error: 'Streak for this date already exists.' }), { status: 400 });
        }

        // Get the latest date from the database
        const latestDateQuery = await env.DB.prepare(`
            SELECT MAX(date_worked) AS latest_date FROM streaks WHERE user_id = ?
        `).bind(userId).first();

        const latestDate = latestDateQuery?.latest_date;

        // Compare the submitted date with the latest date
        if (latestDate && new Date(latestDate) >= new Date(date_worked)) {
            return new Response(JSON.stringify({ error: 'You can only log a streak for a future date.' }), { status: 400 });
        }

        // Insert a new streak into D1
        const insertResult = await env.DB.prepare(`
            INSERT INTO streaks (user_id, date_worked, hours_worked) VALUES (?, ?, ?)
        `).bind(userId, date_worked, hours_worked || 0).run();


        return new Response(JSON.stringify({ message: 'Streak logged successfully!', id: userId }), { status: 201 });

    }
    catch(e){
        return new Response(JSON.stringify({ message: "api/checkin POST error" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }
    
}

// Handle GET requests to retrieve the latest date
const handleGet = async (context) => {
    // Get cookies from the request
    const {request, env} = context;
    console.log(`Request received: ${request.url}`);


    // Access a specific cookie
    const token = await global.getJWTToken(context)
    
    // Create a JSON response if token is not found
    let JSONResponse = await global.responseTokenExists(token);
    if (JSONResponse){
        return JSONResponse;
    }

    try{
        const username = await global.decodeJWTToken(context, token);
    
        const userIdQuery = await env.DB.prepare(`SELECT id FROM user WHERE username = ?`).bind(username).first();
        const userId = userIdQuery.id;
        console.log("The user ID: " + userId);

        // Query to get the latest date from the streaks table
        const latestDateQuery = await env.DB.prepare(`
            SELECT MAX(date_worked) AS latest_date FROM streaks WHERE user_id = ?
        `).bind(userId).first();

        if (!latestDateQuery || !latestDateQuery.latest_date) {
            return new Response(JSON.stringify({ message: 'No streaks found for this user.' }), { status: 404 });
        }
        return new Response(JSON.stringify({ latest_date: latestDateQuery.latest_date }), { status: 200 });
    }
    catch(e){
        return new Response(JSON.stringify({ message: "api/checkin GET error" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    
};

// Helper function to get a specific cookie from the request
const getCookie = (request: Request, name: string): string | null => {
    const cookies = request.headers.get('Cookie');
    if (!cookies) return null;

    const cookieList = cookies.split('; ').map(cookie => {
        const [key, value] = cookie.split('=');
        return { key, value: decodeURIComponent(value) };
    });

    const cookie = cookieList.find(c => c.key === name);
    return cookie ? cookie.value : null;
};
