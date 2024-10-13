import * as crypto from "crypto";


const hashPassword = (password: string, salt: string, iterations=100000, keyLength=64): Promise<string> => {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, iterations, keyLength, 'sha256', (err, derivedKey) => {
            if (err) {
                return reject(err);
            }
            resolve(derivedKey.toString('hex'));
        });
    });
};

const generateSalt = (length: number): string => {
    return crypto.randomBytes(length).toString('hex');
};

export async function onRequestPost(context) {
    const json = await context.request.json();
    const salt = generateSalt(16); // 16 bytes salt recommended by pbkdf2
    const iterations = 100000; // number of iterations
    const keyLength = 64; // length of the derived key

    // Check for duplicate username
    const existingUserStmt = context.env.DB.prepare("SELECT COUNT(*) as count FROM user WHERE username = ?");
    const existingUserRes = await existingUserStmt.bind(json.username).first();

    if (existingUserRes.count > 0) {
        return new Response("Username already exists!", { status: 409 });
    }

    // Check for duplicate email 
    const existingEmailstmt = context.env.DB.prepare("SELECT COUNT(*) as count FROM user WHERE email = ?");
    const existingEmailRes = await existingEmailstmt.bind(json.email).first();

    if (existingEmailRes.count > 0) {
        return new Response("Email already exists!", { status: 409 });
    }


    let hashed_pw = await hashPassword(json.password, salt, iterations, keyLength);

    const stmt = context.env.DB.prepare("INSERT INTO user "
        + "(first_name, last_name, username, hashed_pw, salt, email) "
        + "VALUES "
        + "(?, ?, ?, ?, ?, ?)");

    const res = await stmt.bind(json.first_name, json.last_name, json.username, 
        hashed_pw, salt, json.email).run();
    return new Response(JSON.stringify({ message: "You're registered!" }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
}