export async function onRequestPost(context) {
    return new Response(JSON.stringify({ message: 'Logged out successfully' }), {
        headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': 'jwt=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0;', // Expire the cookie
        },
    });
}
