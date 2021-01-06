import {userService} from "../services/userService";

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';


export function receiveLogin() {
    return {
        type: LOGIN_SUCCESS
    };
}

function loginError(payload) {
    return {
        type: LOGIN_FAILURE,
        payload,
    };
}

function requestLogout() {
    return {
        type: LOGOUT_REQUEST,
    };
}

export function receiveLogout() {
    return {
        type: LOGOUT_SUCCESS,
    };
}

export function logoutUser() {
    return (dispatch) => {
        dispatch(requestLogout());
        localStorage.removeItem('id_token');
        dispatch(receiveLogout());
    };
}

export function loginUser(email, password) {
    console.log(email);
    return (dispatch) => {
        userService.login(email, password)
            .then(token => {
                localStorage.setItem('id_token', token);
                dispatch(receiveLogin());
            })
            .catch(error => {
                dispatch(loginError(error.message ? error.message : 'Something went wrong. Try again'));
            })
    }
}
