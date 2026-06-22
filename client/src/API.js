const SERVER_URL = 'http://localhost:3001/api';


const logIn = async (credentials) => {
    return await fetch(SERVER_URL + '/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',  // this parameter specifies that authentication cookie must be forwared. It is included in all the authenticated APIs.
        body: JSON.stringify(credentials),
    }).then(handleInvalidResponse)
        .then(response => response.json());
};


const logOut = async () => {
    return await fetch(SERVER_URL + '/sessions/current', {
        method: 'DELETE',
        credentials: 'include'
    }).then(handleInvalidResponse);
}

/**
 * This function is used to verify if the user is still logged-in.
 * It returns a JSON object with the user info.
 */
const getUserInfo = async () => {
    return await fetch(SERVER_URL + '/sessions/current', {
        credentials: 'include'
    }).then(handleInvalidResponse)
        .then(response => response.json());
};


const startGame = async () => {
    const assignment = await fetch(
        SERVER_URL + '/game/start',
        { method: 'GET', credentials: 'include' }
    ).then(handleInvalidResponse)
        .then(response => response.json());
    return assignment;
}

const getSegments = async () => {
    const segments = await fetch(SERVER_URL + '/segments', { credentials: 'include' }).then(handleInvalidResponse).then(response => response.json());
    return segments;
}

const submitRoute = async (route) => {
    const result = await fetch(SERVER_URL + '/game/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ route: route })
    }).then(handleInvalidResponse)
        .then(response => response.json());
    return result;
}

const getScoreboard = async () => {
    const scoreboard = await fetch(SERVER_URL + '/scoreboard', { credentials: 'include' }).then(handleInvalidResponse).then(response => response.json());
    return scoreboard;
}

function handleInvalidResponse(response) {
    if (!response.ok) { throw Error(response.statusText) }
    let type = response.headers.get('Content-Type');
    if (type !== null && type.indexOf('application/json') === -1) {
        throw new TypeError(`Expected JSON, got ${type}`)
    }
    return response;
}


const API = { logIn, logOut, startGame, getSegments, submitRoute, getScoreboard, getUserInfo };
export default API;