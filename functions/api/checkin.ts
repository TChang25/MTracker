import * as jwt from 'jsonwebtoken';

export const onRequest = async ({ request, env}) => {
  const method = request.method;
  console.log(method);
  if (method === 'POST') {
    return await handlePost(request, env);
  } else if (method === 'GET') {
    return await handleGet(request, env);
  } else {
    return new Response('Method Not Allowed', { status: 405 });
  }
};

// Handle POST requests to log a streak
const handlePost = async (request: Request, env: any) => {
    // Parse cookies
    const token = getCookie(request, 'jwt'); // Get token from HTTP-only cookie
    const JWT_SECRET = `${env.TOKEN_SECRET}`; // Use your actual secret
    const cookieHeader = request.headers.get('Cookie');

    const cookies: Record<string, string> = {};
    if (cookieHeader) {
        cookieHeader.split('; ').forEach(cookie => {
            const [name, value] = cookie.split('=');
            if (name && value) {
                cookies[name] = decodeURIComponent(value);
            }
        });
    }
    
    
    
    if (!token) {
        return new Response(JSON.stringify({ error: 'Authorization token is required.' }), { status: 401 });
    }

    let user;
    try {
        user = await jwt.verify(token, JWT_SECRET);
        
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Invalid token.' }), { status: 401 });
    } 
    
    const { date_worked, hours_worked } = await request.json();
    
    const userIdQuery = await env.DB.prepare(`SELECT id FROM user WHERE username = ?`).bind(user.name).first();
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
};

// Handle GET requests to retrieve the latest date
const handleGet = async (request: Request, env: any,) => {
    const token = getCookie(request, 'jwt'); // Get token from HTTP-only cookie
    const JWT_SECRET = `${env.TOKEN_SECRET}`; // Use your actual secret
    if (!token) {
        return new Response(JSON.stringify({ error: 'Authorization token is required.' }), { status: 401 });
    }

    let user;
    try {
        user = await jwt.verify(token, JWT_SECRET);
        
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Invalid token.' }), { status: 401 });
    } 
    
    const userIdQuery = await env.DB.prepare(`SELECT id FROM user WHERE username = ?`).bind(user.name).first();
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
