import * as jwt from 'jsonwebtoken';
export async function getJWTToken(context){
    // extract the request object from context
    const {request} = context;

    // Get all cookie headers
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
    
    return token;

}

export async function decodeJWTToken(context, token:string){
    const JWT_SECRET = `${context.env.TOKEN_SECRET}`
    try {
        const username = await jwt.verify(token, JWT_SECRET).name; // Adjust the type as needed
        if (username){
            return username;
        }
    }
    catch (error) {
        console.error('JWT verification error:', error);
        return null;
    }
}

export async function responseTokenExists(token:string){
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
    return;
}