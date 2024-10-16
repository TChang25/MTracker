import * as jwt from "jsonwebtoken";
import * as global from "./global";
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
    const token = await global.getJWTToken(context)
    
    // Create a JSON response if token is not found
    let JSONResponse = await global.responseTokenExists(token);
    if (JSONResponse){
        return JSONResponse;
    }

    try {
        // Verify token and decode payload
        const payload = await global.decodeJWTToken(context, token);
        if (!payload){
            throw new Error("Token could not be verified");
        }
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
