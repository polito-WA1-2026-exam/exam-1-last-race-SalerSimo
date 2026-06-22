
import { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import PropTypes from "prop-types";
import '../App.css';
import API from '../API';


export function Segment({ station1Name, station2Name, onClick }) {
    const circle = {
        width: 18,
        height: 18,
        borderRadius: '50%',
        border: '4px solid var(--accent)',
        backgroundColor: 'white',
        flexShrink: 0,
    };
    return (
        <Container className="segment d-flex flex-column align-items-left border-bottom w-100" style={{ width: 'fit-content', cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
            <Row className="d-flex flex-row align-items-center" style={{ width: 'fit-content' }}>
                <Col className="d-flex flex-column align-items-center py-1 px-2">
                    <div className="segment-circle" style={circle} />
                    <div style={{
                        width: 4,
                        height: 6,
                        backgroundColor: 'var(--accent)',
                    }} />
                    <div className="segment-circle" style={circle} />
                </Col>

                <Col className="d-flex flex-column align-items-start justify-content-between py-1 px-0" >
                    <span style={{ fontSize: '16px' }}>{station1Name}</span>
                    <span style={{ fontSize: '16px' }}>{station2Name}</span>
                </Col>
            </Row>
        </Container>
    );
}

export function SegmentHorizontal({ station1Name, station2Name }) {
    const circle = {
        width: 28,
        height: 28,
        borderRadius: '50%',
        border: '6px solid var(--accent)',
        backgroundColor: 'white',
        flexShrink: 0,
    };

    return (
        <div className="d-inline-flex flex-row align-items-center justify-content-center" style={{ gap: 16 }}>
            <span className="fw-semibold" style={{ fontSize: '1.2rem', textAlign: 'right', minWidth: 220 }}>{station1Name}</span>
            <div className="d-flex flex-row align-items-center" style={{ gap: 0 }}>
                <div style={circle} />
                <div style={{
                    width: 60,
                    height: 6,
                    backgroundColor: 'var(--accent)',
                }} />
                <div style={circle} />
            </div>
            <span className="fw-semibold" style={{ fontSize: '1.2rem', textAlign: 'left', minWidth: 220 }}>{station2Name}</span>
        </div>
    );
}

export function MetroMap({ showSegments = true }) {
    const [svgContent, setSvgContent] = useState('');

    useEffect(() => {
        API.getMap().then(svg => setSvgContent(svg)).catch(err => console.error('Failed to fetch map SVG:', err));
    }, []);

    if (!svgContent) {
        return (
            <div className="bg-light bg-opacity-50 p-4 rounded-4 shadow-sm border-0 d-flex justify-content-center align-items-center" style={{ minHeight: 300, background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
                <p className="text-muted">Loading map...</p>
            </div>
        );
    }

    return (
        <div className={`bg-light bg-opacity-50 p-4 rounded-4 shadow-sm border-0${showSegments ? '' : ' hide-lines'}`} style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}
            dangerouslySetInnerHTML={{ __html: svgContent }} />
    );
}

Segment.propTypes = {
    station1Name: PropTypes.string.isRequired,
    station2Name: PropTypes.string.isRequired,
    onClick: PropTypes.func,
};

SegmentHorizontal.propTypes = {
    station1Name: PropTypes.string.isRequired,
    station2Name: PropTypes.string.isRequired,
};

MetroMap.propTypes = {
    showSegments: PropTypes.bool,
};