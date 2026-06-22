import PropTypes from "prop-types";
import { Button, Col, Container, Row } from "react-bootstrap/";
import { LogoutButton } from './Auth';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Header(props) {
    const navigate = useNavigate();
    return <header className="py-1 py-md-3 border-bottom bg-primary">
        <Container fluid>
            <Row className="align-items-center">
                <Col xs={3} className="d-md-none">
                    <Button
                        variant="outline-light"
                        onClick={() => props.setIsSidebarExpanded(p => !p)}
                        aria-controls="films-filters"
                        aria-expanded={props.isSidebarExpanded}
                    >
                        <i className="bi bi-list" />
                    </Button>
                </Col>
                <Col md={4}>
                    <a onClick={() => props.loggedIn ? props.onClickTitle() : navigate("/")} style={{ cursor: "pointer" }}
                        className="d-flex align-items-center justify-content-center justify-content-md-start h-100 text-decoration-none">
                        <span className="h3 fw-bold text-uppercase mb-0 text-white">
                            Last Race
                        </span>
                    </a>
                </Col>
                <Col md={8} className="d-flex align-items-center justify-content-end gap-2">
                    {props.loggedIn && props.user && (
                        <div className="d-flex align-items-center gap-2 bg-white rounded-pill px-3 py-1 me-2 shadow-sm">
                            <span className="d-flex align-items-center justify-content-center bg-primary text-white rounded-circle fw-bold my-1"
                                style={{ width: '28px', height: '28px', fontSize: '0.8rem' }}>
                                {(props.user.username).charAt(0).toUpperCase()}
                            </span>
                            <span className="text-dark fw-medium" style={{ fontSize: '0.9rem' }}>
                                {props.user.username}
                            </span>
                        </div>
                    )}
                    {props.loggedIn &&
                        <a onClick={() => navigate("/scoreboard")} className="btn btn-outline-light">Scoreboard</a>
                    }
                    {props.loggedIn && <LogoutButton logout={props.logout} />}
                </Col>
            </Row>
        </Container>
    </header>;
}

Header.propTypes = {
    logout: PropTypes.func,
    user: PropTypes.object,
    loggedIn: PropTypes.bool
}

export default Header;