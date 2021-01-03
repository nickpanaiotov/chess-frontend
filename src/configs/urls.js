const host = {
    url: "http://localhost:8080/api"
};

const urls = {
    LOGIN: host.url + "/authentication/token",
    SIGN_UP: host.url + "/signup",
    GAME: host.url + "/games",
    MOVE: host.url + "/games/${gameId}"
    // MOVE: host.url + "/api/games/5fec594d99e1ad0506787389/move/${move}"
};

export default urls;
