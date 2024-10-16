// src/index.ts
import jwt from 'jsonwebtoken';
import * as global from "./global";
interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
}


export async function onRequestGet(context) {
    // Access a specific cookie
    const token = await global.getJWTToken(context)
    
    // Create a JSON response if token is not found
    let JSONResponse = await global.responseTokenExists(token);
    if (JSONResponse){
        return JSONResponse;
    }

    try {
        const username = await global.decodeJWTToken(context, token); // string
        // Use context.env.DB to prepare and execute the query
        const userQuery = context.env.DB.prepare(
        'SELECT id, first_name, last_name, email, username FROM user WHERE username = ?',
        );

        const userData = await userQuery.bind(username).run(); // Use the username from the decoded token
        console.log("User retrieved: " + JSON.stringify(userData.results[0]));
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
