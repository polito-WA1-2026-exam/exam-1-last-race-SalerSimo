// imports
import express from "express";
import session from "express-session";
import passport from "passport";
import LocalStrategy from "passport-local";
import crypto from "crypto";
import morgan from "morgan";
import db, { initDatabase } from "./db.js";

// init express
const app = new express();
const port = 3001;

app.use(express.json());
app.use(morgan('dev'));

passport.use(new LocalStrategy(async (username, password, callback) => {
    const user = await new Promise((resolve, reject) => {
        db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
            if (err) {
                return reject(err);
            }
            else if (!row) {
                return resolve(false);
            }
            else {
                const user = { id: row.userId, username: row.username, bestScore: row.best_score };

                crypto.scrypt(password, row.salt, 64, (err, derivedKey) => {
                    if (err) {
                        return reject(err);
                    }
                    if (crypto.timingSafeEqual(derivedKey, Buffer.from(row.password_hash, "hex"))) {
                        return resolve(user);
                    }
                    resolve(false);
                });
            }
        });
    });
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


await initDatabase();
// activate the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});