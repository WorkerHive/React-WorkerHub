export const authenticate = (username : string, password : string) => {
    return fetch('http://localhost:4002/login', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            strategy: 'jwt',
            username: username,
            password: password
        })
    }).then((r) => r.json())
}