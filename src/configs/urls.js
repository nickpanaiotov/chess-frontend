const baseUrl = "/api";

const urls = {
    LOGIN: baseUrl + "/authentication/token",
    SIGN_UP: baseUrl + "/signup",
    GAMES: baseUrl + "/games",
    MOVE: baseUrl + "/games/${gameId}"
    // MOVE: host.url + "/api/games/5fec594d99e1ad0506787389/move/${move}"
};

export default urls;
