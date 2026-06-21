
import { Col, Container, Row } from 'react-bootstrap';


export function Segment({ station1Name, station2Name, onClick }) {
    const circle = {
        width: 16,
        height: 16,
        borderRadius: '50%',
        border: '2px solid black',
        backgroundColor: 'white',
        flexShrink: 0,
    };

    return (
        <Container className="d-flex flex-column align-items-left border-bottom w-100" style={{ width: 'fit-content', cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
            <Row className="d-flex flex-row align-items-center" style={{ width: 'fit-content' }}>
                <Col style={{ paddingTop: 4, paddingBottom: 4 }}>
                    <div style={circle} />
                    <div style={{
                        width: 2,
                        height: 14,
                        backgroundColor: 'black',
                        marginLeft: 7,
                    }} />
                    <div style={circle} />
                </Col>

                <Col className="d-flex flex-column align-items-left">
                    <span>{station1Name}</span>
                    <span>{station2Name}</span>
                </Col>
            </Row>
        </Container>
    );
}

export function SegmentHorizontal({ station1Name, station2Name }) {
    const circle = {
        width: 16,
        height: 16,
        borderRadius: '50%',
        border: '2px solid black',
        backgroundColor: 'white',
        flexShrink: 0,
    };

    return (
        <Container className="d-flex flex-row align-items-center justify-content-center border-bottom w-100" style={{ width: 'fit-content' }}>
            <span>{station1Name}</span>
            <div style={circle} />
            <div style={{
                width: 30,
                height: 2,
                backgroundColor: 'black',
                marginLeft: 7,
                marginRight: 7,
            }} />
            <div style={circle} />

            <span>{station2Name}</span>

        </Container>
    );
}