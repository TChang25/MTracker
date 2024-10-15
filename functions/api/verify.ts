import * as jwt from "jsonwebtoken";
export async function onRequestGet(context) {
    // Get cookies from the request
    const {request} = context; // extract request
    console.log(`Request received: ${request.url}`);
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

    // Create a JSON response if token is not found
    if (!token){
        
        const responseData = {
            message: 'Unauthorized',
        };
        return new Response(JSON.stringify(responseData), {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 401,
        });
    }
    
    const secret = `${context.env.TOKEN_SECRET}`; // Use your actual secret

    try {
        // Verify token and decode payload
        const payload = jwt.verify(token, secret);
        
        // If verification is successful, return the payload
        return new Response(JSON.stringify({ message: "Access granted", user: payload }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error) {
        // Handle token verification errors (including expiration)
        console.error('Token verification failed:', error);
        
        const responseData = {
            message: 'Unauthorized: ' + (error instanceof jwt.TokenExpiredError ? 'Token has expired' : 'Invalid token'),
        };
        return new Response(JSON.stringify(responseData), {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 401,
        });
    }
    
}
