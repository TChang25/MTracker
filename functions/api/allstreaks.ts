// src/index.ts
import jwt from 'jsonwebtoken';
import * as global from './global';
interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
}


export async function onRequestGet(context) {
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
        // Use context.env.DB to prepare and execute the query

        const url = new URL(request.url);
        const id = url.searchParams.get('id'); // Retrieve id from query parameters
        console.log(id);
        // Validate the id
        if (!id) {
            return new Response('Missing id parameter', { status: 400 });
        }

        const userQuery = context.env.DB.prepare(
        'SELECT * FROM streaks WHERE user_id = ?',
        );

        const userData = await userQuery.bind(id).all(); // Use the username from the decoded token
        console.log(userData.results);
        if (userData) {
            return new Response(JSON.stringify(userData.results), {
                headers: {
                'Content-Type': 'application/json',
                },
                status: 200,
            });
        } else {
            return new Response('User streaks not found', { status: 404 });
        }
    } catch (error) {
        console.error('/api/allstreaks', error);
        return new Response('/api/allstreaks error', { status: 401 });
    }
};
