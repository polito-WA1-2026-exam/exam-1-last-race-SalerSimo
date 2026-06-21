import { Button, Container, Row, Col } from 'react-bootstrap';
import { Segment, SegmentHorizontal } from './Metro';
import { useState, useEffect } from 'react';

function SetupPhase({ onReady }) {
    return (
        <Container className="py-4">
            <Row className="mb-3">
                <Col>
                    <img src="/src/assets/map_selected_stations.png" alt="Metro Map" className="img-fluid" />
                </Col>
                <Col>
                    <h2>Welcome to Race the Rails</h2>
                    <p className="text-muted">
                        Study the metro network carefully before starting. You will not see
                        the lines during the planning phase — only the station names.
                    </p>
                </Col>
            </Row>

            <Row>
                <Col>
                    <p className="text-muted fst-italic">
                        Once you press <strong>Start Game</strong>, a starting station
                        and destination will be assigned and the 90-second timer will begin.
                    </p>
                    <Button variant="success" size="lg" onClick={onReady}>
                        Start Game
                    </Button>
                </Col>
            </Row>
        </Container>
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
        <Container fluid>
            <div>Go from {assignment?.start} to {assignment?.destination}</div>
            <div className="d-flex flex-column align-items-center mb-4">
                {remainingTime}
            </div>
            <Row>
                <Col md={8}>
                    <img src="/src/assets/map_only_stations.png" alt="Metro Map" className="img-fluid" />
                </Col>

                <Col md={2} className="d-flex flex-column border-top p-0 m-10" id="segments-container">
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

                <Col md={2} className="d-flex flex-column border-top p-0" id="route-container">
                    {route.map((seg) => (
                        <Segment
                            key={seg.index}
                            station1Id={seg.station1Id}
                            station1Name={seg.station1Name}
                            station2Id={seg.station2Id}
                            station2Name={seg.station2Name}
                            onClick={() => deselectSegment(seg)}
                        />
                    ))}
                </Col>
            </Row>

            <Button variant="primary" className="mt-3" onClick={() => onSubmitRoute(route)}>
                Submit Route
            </Button>
        </Container >
    );
}

function EventCard({ description, effect }) {
    return (
        <Container className="p-3 mb-2 bg-light border">
            <Row>
                <Col>
                    <p>{description}</p>
                </Col>
                <Col className="text-end">
                    <p>{effect > 0 ? `+${effect} coins` : `${effect} coins`}</p>
                </Col>
            </Row>
        </Container>
    );
};


export function ExecutionPhase({ events, valid, onPlayAgain }) {
    const [currentEventIdx, setCurrentEventIdx] = useState(0);

    return (
        <Container>
            {!valid && (
                <Row>
                    <Col>
                        <p className="text-danger">Invalid route submitted. Your score is 0.</p>
                    </Col>
                </Row>
            )}
            {valid && events.length > 0 && (
                <Container>
                    <SegmentHorizontal
                        station1Name={events[currentEventIdx].station1}
                        station2Name={events[currentEventIdx].station2}
                    />

                    <Col>
                        <EventCard description={events[currentEventIdx].event?.description || "No event"} effect={events[currentEventIdx].event?.effect || 0} />
                        <Button variant="primary" disabled={currentEventIdx >= events.length - 1} onClick={() => {
                            if (currentEventIdx < events.length - 1) {
                                setCurrentEventIdx(currentEventIdx + 1);
                            }
                        }}>
                            Next
                        </Button>
                    </Col>
                    <p> {currentEventIdx === events.length - 1 ? "Final" : "Current"} Score: {events[currentEventIdx].currentScore}</p>
                </Container>
            )}

            {(!valid || currentEventIdx === events.length - 1) && (
                <Button variant="success" onClick={onPlayAgain}>
                    Start New Game
                </Button>
            )}
        </Container>
    );
};

export default SetupPhase;

export function ResultPhase() { };
