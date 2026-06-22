CREATE TABLE IF NOT EXISTS stations (
    stationId INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS lines (
    lineId INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS segments (
    station1Id INTEGER NOT NULL,
    station2Id INTEGER NOT NULL,

    CHECK (station1Id < station2Id),

    PRIMARY KEY(station1Id, station2Id),
    FOREIGN KEY (station1Id) REFERENCES stations(stationId),
    FOREIGN KEY (station2Id) REFERENCES stations(stationId)
);

CREATE TABLE IF NOT EXISTS line_stations (
    lineId INTEGER NOT NULL,
    stationId INTEGER NOT NULL,

    PRIMARY KEY(lineId, stationId),
    FOREIGN KEY (lineId) REFERENCES lines(lineId),
    FOREIGN KEY (stationId) REFERENCES stations(stationId)
);

CREATE TABLE IF NOT EXISTS users (
    userId INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    salt TEXT NOT NULL,
    bestScore INTEGER
);

CREATE TABLE IF NOT EXISTS events (
    eventId INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    effect integer NOT NULL,

    CHECK (effect >= -4 AND effect <= 4)
)