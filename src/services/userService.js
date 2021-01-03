import urls from "../configs/urls"

export const userService = {
    login
}

function login(username, password): Promise<String> {
    let url = urls.LOGIN;

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username: username, password: password})
    };

    return fetch(url, requestOptions)
        .then(response => response.json())
        .then(body => body['id_token']);
}
