import crypto from "crypto";

export default class UserDAO {
    constructor(db) {
        this.db = db;
    }

    getUserByCredentials(username, password) {
        return new Promise((resolve, reject) => {
            this.db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
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
    }

    getScoreById(userId) {
        return new Promise((resolve, reject) => {
            this.db.get("SELECT bestScore FROM users WHERE userId = ?", [userId], (err, row) => {
                if (err) {
                    return reject(err);
                }
                return resolve(row);
            });
        });
    }

    getScoreboard() {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT username, bestScore FROM users WHERE bestScore IS NOT NULL ORDER BY bestScore DESC", (err, rows) => {
                if (err) {
                    return reject(err);
                }
                return resolve(rows);
            });
        });
    }

    updateBestScore(userId, newScore) {
        return new Promise((resolve, reject) => {
            this.db.run("UPDATE users SET bestScore = ? WHERE userId = ?", [newScore, userId], function (err) {
                if (err) {
                    return reject(err);
                }
                return resolve(this.changes);
            });
        });
    }
}