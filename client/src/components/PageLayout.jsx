import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Row, Container, ListGroup, Badge } from 'react-bootstrap';
import Header from './Header';
import { GameTitle } from './GameTitle';
import { SetupPhase, PlanningPhase, ExecutionPhase, ResultPhase } from './Phases';
import { LoginButton } from "./Auth.jsx";
import API from '../API';
import '../App.css';

const PHASES = {
    SETUP: 'setup',
    PLANNING: 'planning',
    EXECUTION: 'execution',
    RESULT: 'result',
};


export function PublicPage() {
    return (
        <Container className="py-5">
            <Row className="justify-content-center py-5">
                <Col md={6}>
                    <GameTitle />
                    <div className="mt-4">
                        <h2 className="h5 fw-semibold">How to play</h2>
                        <div className="text-start">
                            <ListGroup className="mb-4">
                                <ListGroup.Item className="d-flex align-items-center gap-2">
                                    <Badge className="me-2 mt-1 fs-6">1</Badge>
                                    <span>
                                        <strong>Setup.</strong> Study the full metro map — all stations,
                                        lines, and connections are visible. When ready, move on.
                                    </span>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex align-items-center gap-2">
                                    <Badge className="me-2 mt-1 fs-6">2</Badge>
                                    <span>
                                        <strong>Planning</strong> <span className="text-muted">(90 s).</span>{' '}
                                        The lines disappear. You are assigned a start and a destination
                                        station. Build your route from a list of connected
                                        pairs before time runs out.
                                    </span>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex align-items-center gap-2">
                                    <Badge className="me-2 mt-1 fs-6">3</Badge>
                                    <span>
                                        <strong>Execution.</strong> Each segment plays out one at a time.
                                        A random event fires at every step, adding or removing coins.
                                    </span>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex align-items-center gap-2">
                                    <Badge className="me-2 mt-1 fs-6">4</Badge>
                                    <span>
                                        <strong>Result.</strong> Your remaining coins are your final score. Play again or check the scoreboard.
                                    </span>
                                </ListGroup.Item>
                            </ListGroup>
                        </div>
                    </div>
                    <LoginButton />
                </Col>
            </Row>
        </Container >
    );
}



export function GamePage({ user, logout }) {
    const navigate = useNavigate();

    const [phase, setPhase] = useState(PHASES.SETUP);
    const [assignment, setAssignment] = useState(null);
    const [segments, setSegments] = useState([]);
    const [events, setEvents] = useState([]);
    const [validRoute, setValidRoute] = useState(false);
    const [finalScore, setFinalScore] = useState(0);


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
        setFinalScore(result.finalScore || 0);
        if (result.valid) {
            setPhase(PHASES.EXECUTION);
        }
        else {
            setPhase(PHASES.RESULT);
        }
    };

    const handleResultPhase = () => {
        setPhase(PHASES.RESULT);
    }

    const handlePlayAgain = () => {
        setPhase(PHASES.SETUP);
    };

    const onClickTitle = () => {
        navigate("/game");
        setPhase(PHASES.SETUP);
    }


    return (
        <div className="d-flex flex-column h-100" >
            <Header loggedIn={true} user={user} logout={logout} onClickTitle={onClickTitle} />
            <div className="d-flex">
                {phase === PHASES.SETUP && (
                    <SetupPhase onReady={handleReadyToPlay} />
                )}

                {phase === PHASES.PLANNING && (
                    <PlanningPhase
                        assignment={assignment}
                        segments={segments}
                        onSubmitRoute={handleRouteSubmitted}
                        timeLimit={90}
                    />
                )}

                {phase === PHASES.EXECUTION && (
                    <ExecutionPhase
                        events={events}
                        valid={validRoute}
                        onSeeResult={handleResultPhase}
                    />
                )}
                {phase === PHASES.RESULT && (
                    <ResultPhase
                        finalScore={finalScore}
                        onPlayAgain={handlePlayAgain}
                    />
                )}
            </div>
        </div>
    );
}

export function ScoreboardPage({ user, logout }) {
    const navigate = useNavigate();

    const [scores, setScores] = useState([]);

    useEffect(() => {
        API.getScoreboard()
            .then(scores => setScores(scores))
            .catch(err => console.error("Failed to load scoreboard:", err));
    }, []);

    const onClickTitle = () => {
        navigate("/game");
    }

    return (
        <div>
            <Header loggedIn={true} user={user} logout={logout} onClickTitle={onClickTitle} />
            <Container className="py-4">
                <Row className="mb-4">
                    <Col className="text-center">
                        <h2 className="fw-bold">Scoreboard</h2>
                        <p className="text-muted">Top players and their best scores</p>
                    </Col>
                </Row>

                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        {scores.length === 0 ? (
                            <p className="text-center text-muted">No scores yet.</p>
                        ) : (
                            scores.map((score, i) => (
                                <div key={score.username} className="scoreboard-card p-3 mb-3 bg-light border rounded-3">
                                    <Row className="align-items-center">
                                        <Col className="pe-0 d-flex align-items-center justify-content-start">
                                            <span className="fw-bold text-muted">{i + 1}.</span>
                                        </Col>
                                        <Col>
                                            <span className="fw-semibold">{score.username}</span>
                                        </Col>
                                        <Col className="d-flex align-items-center justify-content-end gap-2">
                                            <span className="fw-bold fs-5">{score.bestScore}</span>
                                            <img src="/src/assets/coin.svg" alt="coin" width="22" height="22" />
                                        </Col>
                                    </Row>
                                </div>
                            ))
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}