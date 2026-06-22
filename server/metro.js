import db from './db.js';
import StationDAO from './dao/stations.js';

const stationDAO = new StationDAO(db);


export default class MetroNetwork {
    constructor() {
        this.network = {};
        this.distances = {};
    }
    async buildNetwork() {
        try {
            const network = {};
            const stations = await stationDAO.getStationIds();

            for (const stationId of stations) {
                const connectedStations = await stationDAO.getConnectedStations(stationId);
                network[stationId] = connectedStations;
            }

            this.network = network;

            for (const station1 of stations) {
                for (const station2 of stations) {
                    if (this.distances[`${station1},${station2}`] === undefined || this.distances[`${station2},${station1}`] === undefined) {
                        const distance = this.shortestPath(station1, station2);
                        this.distances[`${station1},${station2}`] = distance;
                        this.distances[`${station2},${station1}`] = distance;
                    }
                }
            }
        } catch (err) {
            console.error("Failed to build network:", err);
            throw err;
        }
    }

    getRandomStartAndDestination(minDistance) {
        const stations = Object.keys(this.network);

        while (stations.length > 0) {
            const randomIndex = Math.floor(Math.random() * stations.length);
            const startStation = stations[randomIndex];

            const validDestinations = stations.filter(station => {
                const distance = this.distances[`${startStation},${station}`];
                return distance >= minDistance;
            });

            if (validDestinations.length === 0) {
                stations.splice(randomIndex, 1);
                continue;
            }

            const randomDestinationIndex = Math.floor(Math.random() * validDestinations.length);
            const destinationStation = validDestinations[randomDestinationIndex];

            return { start: startStation, destination: destinationStation };
        }

        return null;
    }

    shortestPath(start, end) {
        const visited = new Set();
        const queue = [[start, 0]];

        while (queue.length > 0) {
            const [currentStation, distance] = queue.shift();

            if (currentStation === end) {
                return distance;
            }

            if (!visited.has(currentStation)) {
                visited.add(currentStation);
                for (const neighbor of this.network[currentStation]) {
                    if (!visited.has(neighbor)) {
                        queue.push([neighbor, distance + 1]);
                    }
                }
            }
        }
        return -1;
    }

    validateRoute(route, start, destination) {

        if (!route || route.length === 0) {
            return false;
        }

        if (!Array.isArray(route)) {
            return false;
        }
        for (const segment of route) {
            if (!Array.isArray(segment) || segment.length !== 2) {
                return false;
            }
            const [s1, s2] = segment;
            if (!this.network[s1] || !this.network[s2]) {
                return false;
            }
        }

        if (!route[0].includes(start)) {
            return false;
        }
        if (!route[route.length - 1].includes(destination)) {
            return false;
        }

        let seenSegments = new Set();
        seenSegments.add(`${route[0][0]},${route[0][1]}`);
        const stations = [];
        if (route[0][0] === start) {
            stations.push(route[0][0]);
            stations.push(route[0][1]);
        } else {
            stations.push(route[0][1]);
            stations.push(route[0][0]);
        }

        for (let i = 1; i < route.length; i++) {
            const [station1, station2] = route[i];
            if (!this.network[station1] || !this.network[station2]) {
                return false;
            }
            if (!this.network[station1].includes(station2) && !this.network[station2].includes(station1)) {
                return false;
            }

            if (seenSegments.has(`${station1},${station2}`) || seenSegments.has(`${station2},${station1}`)) {
                return false;
            }
            seenSegments.add(`${station1},${station2}`);

            if (stations[stations.length - 1] === station1) {
                stations.push(station2);
            } else if (stations[stations.length - 1] === station2) {
                stations.push(station1);
            } else {
                return false;
            }
        }
        return stations;
    }
}