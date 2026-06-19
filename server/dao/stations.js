
export default class StationDAO {

    constructor(db) {
        this.db = db;
    }

    getStationIds() {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT stationId FROM stations", (err, rows) => {
                if (err) {
                    return reject(err);
                }
                return resolve(rows.map(row => row.stationId));
            });
        });
    }

    getConnectedStations(stationId) {
        const query = `
            SELECT station2Id AS id FROM segments WHERE station1Id = ?
            UNION
            SELECT station1Id AS id FROM segments WHERE station2Id = ?
        `;

        return new Promise((resolve, reject) => {
            this.db.all(query, [stationId, stationId], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                const connectedStations = rows.map(row => row.id);
                resolve(connectedStations);
            });
        });
    }

    getStationName(stationId) {
        return new Promise((resolve, reject) => {
            this.db.get("SELECT name FROM stations WHERE stationId = ?", [stationId], (err, row) => {
                if (err) {
                    return reject(err);
                }
                if (!row) {
                    return resolve(null);
                }
                return resolve(row.name);
            });
        });
    };


}