import urls from "../configs/urls"

export const userService = {
    login,
    oauth,
    info
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
        .then(response => {
            if (response.status !== 200) {
                throw new Error("Bad Credentials");
            }

            return response.json()
        })
        .then(body => body['id_token']);
}

function oauth(): Promise<String> {
    let url = urls.LOGIN;

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    return fetch(url, requestOptions)
        .then(response => {
            if (response.status !== 200) {
                throw new Error("Bad Credentials");
            }

            return response.json()
        })
        .then(body => body['id_token']);
}

function info(): Promise<String> {
    let url = urls.USER_INFO;

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('id_token')
        }
    };

    return fetch(url, requestOptions)
        .then(response => {
            if (response.status !== 200) {
                throw new Error("Bad Credentials");
            }

            return response.json()
        });
}
