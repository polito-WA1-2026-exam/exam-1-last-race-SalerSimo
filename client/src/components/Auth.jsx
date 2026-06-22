import { useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PropTypes from "prop-types";
import '../App.css';


function LoginForm(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [show, setShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        setShow(false);

        const trimmedUsername = username.trim();
        if (!trimmedUsername) {
            setErrorMessage("Username is required.");
            setShow(true);
            return;
        }
        if (!password) {
            setErrorMessage("Password is required.");
            setShow(true);
            return;
        }


        const credentials = { username: trimmedUsername, password };

        props.login(credentials)
            .then(() => navigate("/game"))
            .catch((err) => {
                if (err.message === "Unauthorized")
                    setErrorMessage("Invalid username and/or password");
                else
                    setErrorMessage(err.message);
                setShow(true);
            });
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 p-3">
            <Card className="login-card shadow rounded-3 p-4 w-100" style={{ maxWidth: 420 }}>
                <h1 className="h3 text-center mb-1">Welcome back</h1>
                <p className="text-center text-muted mb-4">Sign in to your account</p>
                <Form onSubmit={handleSubmit}>
                    <Alert
                        dismissible
                        show={show}
                        onClose={() => setShow(false)}
                        variant="danger">
                        {errorMessage}
                    </Alert>
                    <Form.Group className="mb-3" controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            value={username}
                            placeholder="Enter your username"
                            onChange={(ev) => setUsername(ev.target.value)}
                            required={true}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            placeholder="Enter your password"
                            onChange={(ev) => setPassword(ev.target.value)}
                            required={true}
                            minLength={6}
                        />
                    </Form.Group>
                    <Button type="submit" className="w-100">Sign In</Button>
                </Form>
            </Card>
        </div>
    )
}

LoginForm.propTypes = {
    login: PropTypes.func,
}

function LogoutButton(props) {
    return (
        <Button variant="outline-light" onClick={props.logout}>Logout</Button>
    )
}

LogoutButton.propTypes = {
    logout: PropTypes.func
}

function LoginButton() {
    const navigate = useNavigate();
    return (
        <Button className="py-2 px-3 fs-5" onClick={() => navigate('/login')}>Login</Button>
    )
}

export { LoginForm, LogoutButton, LoginButton };