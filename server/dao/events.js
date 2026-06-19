

export default class EventDAO {
    constructor(db) {
        this.db = db;
    }

    getEvents() {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM events", (err, rows) => {
                if (err) {
                    return reject(err);
                }
                return resolve(rows);
            });
        });
    }
}