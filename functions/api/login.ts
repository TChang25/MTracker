import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";

function generateAccessToken(username, TOKEN_SECRET) {
    return jwt.sign({name: username}, TOKEN_SECRET, { expiresIn: '1h' });
}

const hashPassword = (password: string, salt: string, iterations = 100000, keyLength = 64): Promise<string> => {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, iterations, keyLength, 'sha256', (err, derivedKey) => {
            if (err) {
                return reject(err);
            }
            resolve(derivedKey.toString('hex'));
        });
    });
};

export async function onRequestPost(context) {
    const json = await context.request.json();

    // Retrieve user by username or email
    const userStmt = context.env.DB.prepare("SELECT hashed_pw, salt FROM user WHERE username = ?");
    const userRes = await userStmt.bind(json.username).first();

    if (!userRes) {
        return new Response(JSON.stringify({ message: "Invalid username or email!" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    const { hashed_pw, salt } = userRes;

    // Hash the provided password with the stored salt
    const hashedInputPw = await hashPassword(json.password, salt);

    // Compare the hashed password
    if (hashedInputPw !== hashed_pw) {
        return new Response(JSON.stringify({ message: "Invalid password!" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Authentication successful, return a success response
    const jwt_token = await generateAccessToken(json.username, `${context.env.TOKEN_SECRET}`)

    const cookie = `jwt=${jwt_token}; HttpOnly; Secure; SameSite=Strict; Path=/;`;

    return new Response(JSON.stringify({ 
        message: "Login successful!",
     }), {
        status: 200,
        headers: { 
            "Content-Type": "application/json",
            "Set-Cookie": cookie, // Set the cookie in the response
        },
    });
}
