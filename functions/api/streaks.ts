// src/index.ts
import jwt from 'jsonwebtoken';

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
}


export async function onRequestGet(context) {
    const JWT_SECRET = `${context.env.TOKEN_SECRET}`; // Replace with your actual secret
    const {request} = context; // extract request
    const cookieHeader = request.headers.get('Cookie');

    // Parse cookies
    const cookies: Record<string, string> = {};
    if (cookieHeader) {
        cookieHeader.split('; ').forEach(cookie => {
            const [name, value] = cookie.split('=');
            if (name && value) {
                cookies[name] = decodeURIComponent(value);
            }
        });
    }

    // Access a specific cookie
    const token = cookies['jwt'];
    
    // Validate the cookie and verify the JWT
    if (!token) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const username = jwt.verify(token, JWT_SECRET).name; // Adjust the type as needed
        // Use context.env.DB to prepare and execute the query
        const userQuery = context.env.DB.prepare(
        'SELECT first_name, last_name, email, username FROM user WHERE username = ?',
        );

        const userData = await userQuery.bind(username).run(); // Use the username from the decoded token
        console.log(userData.results[0]);
        if (userData) {
            return new Response(JSON.stringify(userData.results[0]), {
                headers: {
                'Content-Type': 'application/json',
                },
                status: 200,
            });
        } else {
            return new Response('User not found', { status: 404 });
        }
    } catch (error) {
        console.error('JWT verification error:', error);
        return new Response('Unauthorized', { status: 401 });
    }
};
