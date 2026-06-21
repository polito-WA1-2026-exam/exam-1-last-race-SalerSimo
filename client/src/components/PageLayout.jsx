import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Row, Container, Badge, ListGroup } from 'react-bootstrap';
import Header from './Header';
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
                            <strong>Result.</strong> Your remaining coins are your final score. Play again or check the scoreboard.
                        </ListGroup.Item>
                    </ListGroup>
                    <LoginButton></LoginButton>
                </Col>
            </Row>
        </Container>
    );
}



export function GamePage(props) {
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
        if (result.valid) {
            setFinalScore(result.events[result.events.length - 1].currentScore);
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
            <Header loggedIn={props.loggedIn} logout={props.logout} onClickTitle={onClickTitle} />
            <div className="d-flex">
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
                                        <Col className="pe-0">
                                            <span className="fw-bold text-muted">{i + 1}.</span>
                                        </Col>
                                        <Col>
                                            <span className="fw-semibold">{score.username}</span>
                                        </Col>
                                        <Col className="d-flex align-items-center gap-2">
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