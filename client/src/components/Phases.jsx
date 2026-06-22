import { Button, Container, Row, Col } from 'react-bootstrap';
import { GameTitle } from './GameTitle';
import { Segment, SegmentHorizontal, MetroMap } from './Metro';
import { useState, useEffect } from 'react';
import '../App.css';

export function SetupPhase({ onReady }) {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center py-4 h-100 w-100 px-0">
            <Row className="d-flex w-100 justify-content-center align-items-center">
                <Col md={8}>
                    <MetroMap></MetroMap>
                </Col>
                <Col md={4} className="px-5 d-flex flex-column justify-content-center align-items-center text-center">
                    <GameTitle />
                    <h2 className="h5 fw-semibold mt-3">Study the map</h2>
                    <p className="text-muted mb-1">
                        The full metro network is displayed — every station, line, and connection.
                    </p>
                    <p className="text-muted mb-1">
                        During the next phase, the lines will disappear and only station names will be visible, so take a moment to memorize the layout.
                    </p>
                    <p className="text-muted mb-4">
                        Press <strong>Start Game</strong> when you are ready. A random start and destination will be assigned, and the countdown will begin.
                    </p>
                    <Button size="lg" className="btn-accent" onClick={onReady}>
                        Start Game
                    </Button>
                </Col>
            </Row>
        </div>
    );
}

export function PlanningPhase({ assignment, segments, onSubmitRoute, timeLimit }) {

    const [route, setRoute] = useState([]);
    const [routeIdx, setRouteIdx] = useState(0);
    const [remainingTime, setRemainingTime] = useState(timeLimit);

    const selectSegment = (segment) => {
        const seg = { ...segment, index: routeIdx };
        setRoute((prevRoute) => {
            return [...prevRoute, seg];
        });
        setRouteIdx(routeIdx + 1);
    };

    const deselectSegment = (segment) => {
        setRoute((prevRoute) => {
            return prevRoute.filter(seg => seg.index !== segment.index);
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTime((prevTime) => {
                return Math.max(prevTime - 1, 0);
            });
            if (remainingTime <= 0) {
                clearInterval(interval);
                onSubmitRoute(route);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [onSubmitRoute, route, remainingTime]);

    return (
        <Container fluid className="d-flex flex-column py-3">
            <Row className="align-items-center mb-2 flex-shrink-0">
                <Col md={8} className="d-flex align-items-center justify-content-center">
                    <div className="d-flex align-items-center gap-3">
                        {/* <span className="text-muted small text-uppercase" style={{ letterSpacing: '0.05em' }}>Route</span> */}
                        <span className="fw-bold fs-5 px-3 py-1 rounded-pill bg-light border">{assignment?.start}</span>
                        <svg width="48" height="32" viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-muted">
                            <path d="M0 10h24M18 4l8 6-8 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                        <span className="fw-bold fs-5 px-3 py-1 rounded-pill bg-light border">{assignment?.destination}</span>
                    </div>
                </Col>
                <Col md={4} className="d-flex justify-content-end align-items-center gap-3">
                    <div className="timer" style={{ background: remainingTime <= 10 ? 'red' : 'green' }}>{remainingTime}</div>

                    <Button onClick={() => onSubmitRoute(route)}>
                        Submit Route
                    </Button>
                </Col>
            </Row>

            <Row className="d-flex">
                <Col md={8}>
                    <MetroMap showSegments={false}></MetroMap>
                </Col>

                <Col md={4} className="d-flex h-100 overflow-auto">
                    <Col md={6} className='pe-2 h-100' id="segments-container">
                        <Col className="d-flex flex-column border p-0 h-100">
                            <div className="fw-semibold text-center py-2 border-bottom bg-light flex-shrink-0">Segments</div>
                            {segments.map(seg => (
                                <Segment
                                    key={`${seg.station1Id},${seg.station2Id}`}
                                    station1Id={seg.station1Id}
                                    station1Name={seg.station1Name}
                                    station2Id={seg.station2Id}
                                    station2Name={seg.station2Name}
                                    onClick={() => selectSegment(seg)}
                                />
                            ))}
                        </Col>
                    </Col>
                    <Col md={6} className='ps-2 h-100' id="route-container">
                        <Col className="d-flex flex-column border p-0 overflow-scroll h-100">
                            <div className="fw-semibold text-center py-2 border-bottom bg-light flex-shrink-0">Route</div>
                            {route.length === 0 ? (
                                <div className="text-muted text-center py-3 small">Select segments to build your route</div>
                            ) : (
                                route.map((seg) => (
                                    <Segment
                                        key={seg.index}
                                        station1Id={seg.station1Id}
                                        station1Name={seg.station1Name}
                                        station2Id={seg.station2Id}
                                        station2Name={seg.station2Name}
                                        onClick={() => deselectSegment(seg)}
                                    />
                                ))
                            )}
                        </Col>
                    </Col>
                </Col>
            </Row>
        </Container >
    );
}

function EventCard({ description, effect }) {
    return (
        <div className="event-card py-4 mx-5 bg-light border rounded-3 text-center">
            <p className=" fs-5">{description}</p>
            <div className="d-inline-flex align-items-center gap-2">
                <span className={`fs-4 fw-bold ${effect >= 0 ? "text-success" : "text-danger"}`}>
                    {effect >= 0 ? `+${effect}` : effect}
                </span>
                <img src="/src/assets/coin.svg" alt="coin" width="28" height="28" />
            </div>
        </div>
    );
};


export function ExecutionPhase({ events, valid, onSeeResult }) {
    const [currentEventIdx, setCurrentEventIdx] = useState(0);

    return (
        <Container className="d-flex flex-column justify-content-center gap-4 py-4">
            {!valid && (
                <Row>
                    <Col>
                        <div className="alert alert-danger">Invalid route submitted. Your score is 0.</div>
                    </Col>
                </Row>
            )}
            {valid && events.length > 0 && (
                <div>
                    <Row className="mb-4">
                        <Col className="text-center">
                            <SegmentHorizontal
                                station1Name={events[currentEventIdx].station1}
                                station2Name={events[currentEventIdx].station2}
                            />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6} className="mx-auto">
                            <EventCard description={events[currentEventIdx].event?.description || "No event"} effect={events[currentEventIdx].event?.effect || 0} />
                        </Col>
                    </Row>

                    <Row>
                        <Col className="text-center">
                            <Button onClick={() => {
                                if (currentEventIdx < events.length - 1) {
                                    setCurrentEventIdx(currentEventIdx + 1);
                                } else {
                                    onSeeResult();
                                }
                            }}>
                                Next
                            </Button>
                        </Col>
                    </Row>
                </div>
            )}
        </Container>
    );
};


export function ResultPhase({ finalScore, onPlayAgain }) {
    return (
        <Container className="d-flex flex-column justify-content-center align-items-center align-self-center gap-4 py-4 mt-5">
            <Row>
                <Col className="text-center d-flex align-items-center gap-1">
                    <h2 className="mb-0">Your final score: {finalScore}</h2>
                    <img src="/src/assets/coin.svg" alt="coin" width="32" height="32" />
                </Col>
            </Row>

            <Row>
                <Col className="text-center">
                    <Button size="lg" className="btn-accent" onClick={onPlayAgain}>
                        Start New Game
                    </Button>
                </Col>
            </Row>
        </Container>
    );

};
