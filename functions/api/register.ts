import * as crypto from "crypto";
export async function onRequestPost(context) {
      /*
    * TODO: Access DB to verify username + passcode
    */
    // 1. Obtain hash from db
    // 2. Compare to password
    // 3. return JWT on success

    const json = await context.request.json();
    const stmt = context.env.DB.prepare("INSERT INTO user "
        + "(first_name, last_name, username, hashed_pw, salt, email) "
        + "VALUES "
        + "(?, ?, ?, ?, ?, ?, ?)");

    const res = await stmt.bind(json.first_name, json.last_name, json.username, 
        json.hashed_pw, json.salt, json.email, json.phone_number).run();
    return new Response("You're registered!" + res);
}