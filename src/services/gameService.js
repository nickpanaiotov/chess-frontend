import urls from "../configs/urls"

export const gameService = {
    startGame,
    move,
    getGames,
    getGame
}

function getGame(gameId): Promise {
    let url = urls.GAME + "/" + gameId;

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('id_token')
        }
    };

    return fetch(url, requestOptions)
        .then(response => response.json());
}

function getGames(): Promise {
    let url = urls.GAME;

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('id_token')
        }
    };

    return fetch(url, requestOptions)
        .then(response => response.json());
}

function startGame(joinAs, body): Promise {
    let url = urls.GAME + (joinAs ? '?join=' + joinAs.toUpperCase() : '');

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('id_token')
        },
        body: JSON.stringify(body)
    };

    return fetch(url, requestOptions)
        .then(response => response.json());
}

async function move(gameId, move): Promise {
    let url = urls.MOVE.replace('${gameId}', gameId) + (move ? "?move=" + move : "");

    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('id_token')
        }
    };

    return fetch(url, requestOptions)
        .then(response => response.json());
}
