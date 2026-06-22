-- username: Simone
-- password: password

-- username: User2
-- password: password2

--username: User3
--password: password3
INSERT INTO users (username, password_hash, salt, bestScore) VALUES 
(
    'Simone', 
    'd865615ae46b32df11b3924ddd045ddc462cb44256665555d43a7aa423880d0d63564865d8df7e84055ed9983225c017de8bea44c8676e37ce274d2b1c07a772', 
    'e52475d49a4b4f071ebacdb3dcd5318e', 
    22
),
(
    'User2', 
    '3f6de42c4d8aff09303726a27705e9443e6af472d7e280d10dcc88ef376e7b898afb8019870e455d265fe431accc9bd50385fe971c8b8e16528e68c737a9b2f1',
    '68a39e6911c73ee5aab26ccf0f29f508',
    18
);


INSERT INTO users (username, password_hash, salt) VALUES 
(
    'User3',
    '4395321dc2bb6c8ab18008d0515272eff0c39ca1f172e4d863e411633b1e8fb9721dce8fdef6e2b6cd503570db29ee6d953583fc09468e4fef5f811e65eac784',
    '0cfe588a55ef5ee3b2a26e399ccdafa5'
);



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
INSERT INTO segments (station1Id, station2Id) VALUES (3, 4);
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
INSERT INTO line_stations (lineId, stationId) VALUES (3, 4);

INSERT INTO line_stations (lineId, stationId) VALUES (4, 4);
INSERT INTO line_stations (lineId, stationId) VALUES (4, 10);
INSERT INTO line_stations (lineId, stationId) VALUES (4, 11);
INSERT INTO line_stations (lineId, stationId) VALUES (4, 12);

INSERT INTO events (description, effect) VALUES
('Quiet journey, nothing unusual happens', 0),
('Wrong platform, you miss your train', -2),
('Kind passenger shares a snack', 1),
('Ticket inspector finds an expired ticket', -3),
('You find a coin on the station floor', 1),
('Train delay gives time to help a traveler', 2),
('Lost luggage causes inconvenience', -4),
('Friendly station worker gives useful directions', 2),
('Lucky escape: the ticket inspector skips your seat', 3);