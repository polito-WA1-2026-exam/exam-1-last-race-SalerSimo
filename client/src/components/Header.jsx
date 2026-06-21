import PropTypes from "prop-types";
import { Button, Col, Container, Row } from "react-bootstrap/";
import { LogoutButton, LoginButton } from './Auth';
import { useNavigate } from 'react-router-dom';

function Header(props) {
    const navigate = useNavigate();
    return <header className="py-1 py-md-3 border-bottom bg-primary">
        <Container fluid className="gap-3 align-items-center">
            <Row>
                <Col xs={3} className="d-md-none">
                    <Button
                        onClick={() => props.setIsSidebarExpanded(p => !p)}
                        aria-controls="films-filters"
                        aria-expanded={props.isSidebarExpanded}
                    >
                        <i className="bi bi-list" />
                    </Button>
                </Col>
                <Col xs={4} md={4}>
                    <a onClick={() => props.loggedIn ? navigate("/game") : navigate("/")} style={{ cursor: "pointer" }}
                        className="d-flex align-items-center justify-content-center justify-content-md-start h-100 link-light text-decoration-none">
                        <i className="bi bi-collection-play me-2 flex-shrink-0"></i>
                        <span className="h5 mb-0">Last Race</span>
                    </a>
                </Col>
                <Col xs={5} md={8} className="d-flex align-items-center justify-content-end">
                    {props.loggedIn &&
                        <span className="me-3">
                            <a onClick={() => navigate("/scoreboard")} className="btn btn-outline-light">Scoreboard</a>
                        </span>
                    }
                    <span className="ml-md-auto">
                        {props.loggedIn ? <LogoutButton logout={props.logout} /> : <LoginButton />}
                    </span>
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