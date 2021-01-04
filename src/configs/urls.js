const host = {
    url: "http://chess-backend:8080/api"
};

const urls = {
    LOGIN: host.url + "/authentication/token",
    SIGN_UP: host.url + "/signup",
    GAMES: host.url + "/games",
    MOVE: host.url + "/games/${gameId}"
    // MOVE: host.url + "/api/games/5fec594d99e1ad0506787389/move/${move}"
};

export default urls;
