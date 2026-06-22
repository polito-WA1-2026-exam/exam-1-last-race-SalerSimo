// imports
import express from "express";
import session from "express-session";
import passport from "passport";
import LocalStrategy from "passport-local";
import morgan from "morgan";
import cors from "cors";
import db, { initDatabase } from "./db.js";
import MetroNetwork from "./metro.js";
import StationDAO from "./dao/stations.js";
import EventDAO from "./dao/events.js";
import UserDAO from "./dao/users.js";

// init express
const app = new express();
const port = 3001;

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));
app.use(morgan('dev'));

await initDatabase();
const metroNetwork = new MetroNetwork();
await metroNetwork.buildNetwork();
const stationDAO = new StationDAO(db);
const eventDAO = new EventDAO(db);
const userDAO = new UserDAO(db);


passport.use(new LocalStrategy(async (username, password, callback) => {
    const user = await userDAO.getUserByCredentials(username, password);
    if (!user) {
        return callback(null, false, { message: "Incorrect username or password." });
    }
    return callback(null, user);
}));

passport.serializeUser((user, callback) => {
    callback(null, user);
});

passport.deserializeUser((user, callback) => {
    callback(null, user);
});

app.use(session({
    secret: "This is a very secret information used to initialize the session!",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.authenticate('session'));


/** Defining authentication verification middleware **/
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ error: 'Not authenticated' });
}


// This route is used for performing login.
app.post('/api/sessions', function (req, res, next) {
    if (!req.body || typeof req.body.username !== 'string' || typeof req.body.password !== 'string') {
        return res.status(400).json({ error: 'Username and password are required.' });
    }
    const username = req.body.username.trim();
    const password = req.body.password;
    if (!username || username.length > 50) {
        return res.status(400).json({ error: 'Username must be between 1 and 50 characters.' });
    }
    if (!password) {
        return res.status(400).json({ error: 'Password is required.' });
    }
    req.body.username = username;
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            return res.status(401).json({ error: info });
        }
        req.login(user, (err) => {
            if (err)
                return next(err);

            return res.json(req.user);
        });
    })(req, res, next);
});

// This route checks whether the user is logged in or not.
app.get('/api/sessions/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    }
    else
        res.status(401).json({ error: 'Not authenticated' });
});

// This route is used for loggin out the current user.
app.delete('/api/sessions/current', (req, res) => {
    req.logout(() => {
        res.end();
    });
});


app.post("/api/game/start", isLoggedIn, async (req, res) => {
    const minDistance = 3;
    const result = metroNetwork.getRandomStartAndDestination(minDistance);
    if (!result) {
        return res.status(500).json({ error: "Unable to find valid start and destination stations." });
    }
    const { start, destination } = result;
    req.session.start = start;
    req.session.destination = destination;
    const startName = await stationDAO.getStationName(start);
    const destinationName = await stationDAO.getStationName(destination);
    res.json({ start: startName, destination: destinationName });
});

app.post("/api/game/submit", isLoggedIn, async (req, res) => {
    if (!req.body) {
        return res.json({ valid: false, error: "Invalid route." });
    }
    if (!req.session.start || !req.session.destination) {
        return res.json({ valid: false, error: "No active game session found." });
    }
    const route = req.body.route;
    const start = parseInt(req.session.start);
    const destination = parseInt(req.session.destination);
    req.session.start = null;
    req.session.destination = null;
    if (!route) {
        return res.json({ valid: false, error: "Invalid route." });
    }
    const stations = metroNetwork.validateRoute(route, start, destination);
    if (!stations) {
        return res.json({ valid: false, error: "Invalid route." });
    }

    let score = 20;
    const events = await eventDAO.getEvents();
    const result = []
    for (let i = 1; i < stations.length; i++) {
        const station1Id = stations[i - 1];
        const station2Id = stations[i];
        const randomIndex = Math.floor(Math.random() * events.length);
        const randomEvent = events[randomIndex];
        if (randomEvent) {
            score = Math.max(score + randomEvent.effect, 0);
        }
        const station1Name = await stationDAO.getStationName(station1Id);
        const station2Name = await stationDAO.getStationName(station2Id);

        result.push({
            station1: station1Name,
            station2: station2Name,
            event: randomEvent ? { description: randomEvent.description, effect: randomEvent.effect } : null,
        });
    }

    const userId = req.user.id;
    const currentBestScore = await userDAO.getScoreById(userId);
    if (!currentBestScore || score > currentBestScore.bestScore) {
        await userDAO.updateBestScore(userId, score);
    }

    res.json({ valid: true, events: result, finalScore: score });
});

app.get("/api/segments", isLoggedIn, async (req, res) => {
    const segments = await stationDAO.getSegments();
    res.json(segments);
});

app.get("/api/scoreboard", isLoggedIn, async (req, res) => {
    const scoreboard = await userDAO.getScoreboard();
    res.json(scoreboard);
});

app.get("/api/metro-map.svg", isLoggedIn, async (req, res) => {
    res.sendFile('metro-map.svg', { root: 'public' });
});

// activate the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});