import { useState, useEffect } from 'react';
import { Col, Row, Container, Badge, ListGroup } from 'react-bootstrap';
import Header from './Header';
import SetupPhase from './Phases';
import { PlanningPhase, ExecutionPhase } from './Phases';
import { LoginButton } from "./Auth.jsx";
import API from '../API';

const PHASES = {
    SETUP: 'setup',
    PLANNING: 'planning',
    EXECUTION: 'execution',
    RESULT: 'result',
};


export function PublicPage() {
    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>

                    <div className="text-center mb-4">
                        <h1 className="h2 fw-semibold">Last Race</h1>
                        <p className="text-muted">
                            Navigate a fictional underground network, beat the clock, and reach
                            your destination with as many coins as possible.
                        </p>
                    </div>

                    <h2 className="h5 fw-semibold mt-4">How to play</h2>
                    <ListGroup className="mb-4">
                        <ListGroup.Item>
                            <Badge className="me-2">1</Badge>
                            <strong>Setup.</strong> Study the full metro map — all stations,
                            lines, and connections are visible. When ready, move on.
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Badge className="me-2">2</Badge>
                            <strong>Planning</strong> <span className="text-muted">(90 s).</span>{" "}
                            The lines disappear. You are assigned a start and a destination
                            station. Build your route from a list of connected
                            pairs before time runs out.
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Badge className="me-2">3</Badge>
                            <strong>Execution.</strong> Each segment plays out one at a time.
                            A random event fires at every step, adding or removing coins.
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Badge className="me-2">4</Badge>
                            <strong>Result.</strong> Your remaining coins are your final score. Play again or check the leaderboard.
                        </ListGroup.Item>
                    </ListGroup>
                    <LoginButton></LoginButton>
                </Col>
            </Row>
        </Container>
    );
}



export function GamePage(props) {
    const [phase, setPhase] = useState(PHASES.SETUP);
    const [assignment, setAssignment] = useState(null);
    const [segments, setSegments] = useState([]);
    const [events, setEvents] = useState([]);
    const [validRoute, setValidRoute] = useState(false);


    const handleReadyToPlay = async () => {
        const segments = await API.getSegments();
        const assignment = await API.startGame();
        setAssignment(assignment);
        setSegments(segments);
        setEvents([]);
        setValidRoute(false);
        setPhase(PHASES.PLANNING);
    };

    const handleRouteSubmitted = async (submittedRoute) => {
        const route = [];
        submittedRoute.forEach(segment => { route.push([segment.station1Id, segment.station2Id]); });

        const result = await API.submitRoute(route);

        setValidRoute(result.valid);
        setEvents(result.events || []);

        setPhase(PHASES.EXECUTION);
    };

    const handlePlayAgain = () => {
        setPhase(PHASES.SETUP);
    };


    return (
        <div>
            <Header loggedIn={props.loggedIn} logout={props.logout} />
            {phase === PHASES.SETUP && (
                <SetupPhase onReady={handleReadyToPlay} />
            )}

            {phase === PHASES.PLANNING && (
                <PlanningPhase
                    assignment={assignment}
                    segments={segments}
                    onSubmitRoute={handleRouteSubmitted}
                    timeLimit={20}
                />
            )}

            {phase === PHASES.EXECUTION && (
                <ExecutionPhase
                    events={events}
                    valid={validRoute}
                    onPlayAgain={handlePlayAgain}
                />
            )}

            {/* 

            {phase === PHASES.RESULT && (
                <ResultPhase
                    finalScore={finalScore}
                    assignment={assignment}
                    route={route}
                    onPlayAgain={handlePlayAgain}
                />
            )} */}
        </div>
    );
}

export function ScoreboardPage({ loggedIn, logout }) {

    const [scores, setScores] = useState([]);

    useEffect(() => {
        API.getScoreboard()
            .then(scores => setScores(scores))
            .catch(err => console.error("Failed to load scoreboard:", err));
    }, []);
    return (
        <div>
            <Header loggedIn={loggedIn} logout={logout} />
            <Row>
                <Col>
                    <h2>Scoreboard</h2>
                </Col>
            </Row>

            <Row>
                <Col>
                    {scores.map((score) => (
                        <Container key={score.username} className="p-3 mb-2 bg-light border">
                            <Row>
                                <Col>
                                    <p>{score.username}</p>
                                </Col>
                                <Col className="text-end">
                                    <p>{score.bestScore} coins</p>
                                </Col>
                            </Row>
                        </Container>
                    )
                    )}
                </Col>
            </Row>
        </div>
    );
}