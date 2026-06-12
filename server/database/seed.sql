-- username: simone
-- password: password
INSERT INTO users (username, password_hash, salt, best_score) VALUES ('simone', 'd865615ae46b32df11b3924ddd045ddc462cb44256665555d43a7aa423880d0d63564865d8df7e84055ed9983225c017de8bea44c8676e37ce274d2b1c07a772', 'e52475d49a4b4f071ebacdb3dcd5318e', 100);


INSERT INTO stations (stationId, name) VALUES (1, 'Coolmine');
INSERT INTO stations (stationId, name) VALUES (2, 'Broombridge');
INSERT INTO stations (stationId, name) VALUES (3, 'Drumcondra');
INSERT INTO stations (stationId, name) VALUES (4, 'Connolly');
INSERT INTO stations (stationId, name) VALUES (5, 'Marlborough');
INSERT INTO stations (stationId, name) VALUES (6, 'Fatima');
INSERT INTO stations (stationId, name) VALUES (7, 'Kingswood');
INSERT INTO stations (stationId, name) VALUES (8, 'Beechwood');
INSERT INTO stations (stationId, name) VALUES (9, 'The Gallops');
INSERT INTO stations (stationId, name) VALUES (10, 'Bray');
INSERT INTO stations (stationId, name) VALUES (11, 'Sandymount');
INSERT INTO stations (stationId, name) VALUES (12, 'Kilbarrack');


INSERT INTO lines (lineId, name) VALUES (1, 'Red Line');
INSERT INTO lines (lineId, name) VALUES (2, 'Green Line');
INSERT INTO lines (lineId, name) VALUES (3, 'Blue Line');
INSERT INTO lines (lineId, name) VALUES (4, 'Yellow Line');


INSERT INTO segments (station1Id, station2Id) VALUES (1, 2);
INSERT INTO segments (station1Id, station2Id) VALUES (2, 3);
INSERT INTO segments (station1Id, station2Id) VALUES (2, 5);
INSERT INTO segments (station1Id, station2Id) VALUES (4, 5);
INSERT INTO segments (station1Id, station2Id) VALUES (5, 6);
INSERT INTO segments (station1Id, station2Id) VALUES (6, 7);
INSERT INTO segments (station1Id, station2Id) VALUES (5, 8);
INSERT INTO segments (station1Id, station2Id) VALUES (8, 9);
INSERT INTO segments (station1Id, station2Id) VALUES (4, 11);
INSERT INTO segments (station1Id, station2Id) VALUES (10, 11);
INSERT INTO segments (station1Id, station2Id) VALUES (4, 12);


INSERT INTO line_stations (lineId, stationId) VALUES (1, 7);
INSERT INTO line_stations (lineId, stationId) VALUES (1, 6);
INSERT INTO line_stations (lineId, stationId) VALUES (1, 5);
INSERT INTO line_stations (lineId, stationId) VALUES (1, 4);

INSERT INTO line_stations (lineId, stationId) VALUES (2, 2);
INSERT INTO line_stations (lineId, stationId) VALUES (2, 5);
INSERT INTO line_stations (lineId, stationId) VALUES (2, 8);
INSERT INTO line_stations (lineId, stationId) VALUES (2, 9);

INSERT INTO line_stations (lineId, stationId) VALUES (3, 1);
INSERT INTO line_stations (lineId, stationId) VALUES (3, 2);
INSERT INTO line_stations (lineId, stationId) VALUES (3, 3);

INSERT INTO line_stations (lineId, stationId) VALUES (4, 4);
INSERT INTO line_stations (lineId, stationId) VALUES (4, 10);
INSERT INTO line_stations (lineId, stationId) VALUES (4, 11);
INSERT INTO line_stations (lineId, stationId) VALUES (4, 12);