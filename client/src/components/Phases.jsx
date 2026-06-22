import { Button, Container, Row, Col } from 'react-bootstrap';
import { GameTitle } from './GameTitle';
import { Segment, SegmentHorizontal, MetroMap } from './Metro';
import { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import '../App.css';
import coinSvg from '../assets/coin.svg';

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
        }, 1000);
        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        if (remainingTime === 0) {
            onSubmitRoute(route);
        }
    }, [remainingTime, route, onSubmitRoute]);

    return (
        <Container fluid className="d-flex flex-column py-3">
            <Row className="align-items-center mb-2 flex-shrink-0">
                <Col md={8} className="d-flex align-items-center justify-content-center">
                    <div className="d-flex align-items-center gap-3">
                        <span className="fw-bold fs-5 px-3 py-1 rounded-pill bg-light border">{assignment.start}</span>
                        <svg width="48" height="32" viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-muted">
                            <path d="M0 10h24M18 4l8 6-8 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                        <span className="fw-bold fs-5 px-3 py-1 rounded-pill bg-light border">{assignment.destination}</span>
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

                <Col md={4} className="d-flex h-100 overflow-auto justify-content-between">
                    <Col md={6} className='h-100 pe-2' id="segments-container">
                        <Col className="d-flex flex-column border-0 rounded-3 shadow-sm h-100 overflow-hidden">
                            <div className="fw-semibold text-center py-2 border-bottom bg-primary text-white flex-shrink-0">Segments</div>
                            <div style={{ background: '#fafafa' }}>
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
                            </div>
                        </Col>
                    </Col>
                    <Col md={6} className='h-100 ps-2' id="route-container">
                        <Col className="d-flex flex-column border-0 rounded-3 shadow-sm h-100 overflow-hidden">
                            <div className="fw-semibold text-center py-2 border-bottom bg-primary text-white flex-shrink-0">Route</div>
                            <div style={{ background: '#fafafa' }}>
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
                            </div>
                        </Col>
                    </Col>
                </Col>
            </Row>
        </Container >
    );
}

function EventCard({ description, effect }) {
    const isPositive = effect >= 0;
    return (
        <div className={`event-card p-4 mx-5 border rounded-4 shadow-sm text-center ${isPositive ? 'border-success border-opacity-25' : 'border-danger border-opacity-25'}`}
            style={{ background: isPositive ? 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)' : 'linear-gradient(135deg, #fef2f2 0%, #ffffff 100%)' }}>
            <p className="fs-5 fw-medium mb-3">{description}</p>
            <div className="d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill bg-white border shadow-sm">
                <span className={`fs-4 fw-bold ${isPositive ? "text-success" : "text-danger"}`}>
                    {isPositive ? `+${effect}` : effect}
                </span>
                <img src={coinSvg} alt="coin" width="30" height="30" />
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
        <Container className="d-flex flex-column justify-content-center align-items-center py-5">
            <div className="text-center p-5 border rounded-4 shadow-sm bg-white mt-5" style={{ maxWidth: '480px' }}>
                <h2 className="fw-semibold mb-1">Game Over</h2>
                <p className="text-muted mb-4">Here is your final score.</p>
                <div className="d-inline-flex align-items-center gap-3 px-4 py-3 rounded-4 bg-light border mb-4">
                    <span className="display-6 fw-bold">{finalScore}</span>
                    <img src={coinSvg} alt="coin" width="40" height="40" />
                </div>
                <div>
                    <Button size="lg" className="btn-accent px-5" onClick={onPlayAgain}>
                        Play Again
                    </Button>
                </div>
            </div>
        </Container>
    );

};

SetupPhase.propTypes = {
    onReady: PropTypes.func.isRequired,
};

PlanningPhase.propTypes = {
    assignment: PropTypes.shape({
        start: PropTypes.string,
        destination: PropTypes.string
    }).isRequired,
    segments: PropTypes.array.isRequired,
    onSubmitRoute: PropTypes.func.isRequired,
    timeLimit: PropTypes.number.isRequired,
};

EventCard.propTypes = {
    description: PropTypes.string,
    effect: PropTypes.number,
};

ExecutionPhase.propTypes = {
    events: PropTypes.array.isRequired,
    valid: PropTypes.bool.isRequired,
    onSeeResult: PropTypes.func.isRequired,
};

ResultPhase.propTypes = {
    finalScore: PropTypes.number.isRequired,
    onPlayAgain: PropTypes.func.isRequired,
};
