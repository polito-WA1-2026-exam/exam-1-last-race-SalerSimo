import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap/';
import { Route, Routes, Navigate } from 'react-router-dom';
import { LoginForm } from './components/Auth.jsx';
import { PublicPage, GamePage, ScoreboardPage } from './components/PageLayout.jsx';
import API from "./API.js";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        // Checking if the user is already logged-in
        // This useEffect is called only the first time the component is mounted (i.e., when the page is (re)loaded.)
        API.getUserInfo()
            .then(() => {
                setLoggedIn(true);
            }).catch(() => {
                setLoggedIn(false);
            });
    }, []);


    const handleLogin = async (credentials) => {
        await API.logIn(credentials);
        setLoggedIn(true);
    };

    const handleLogout = async () => {
        await API.logOut();
        setLoggedIn(false);
    };


    return (
        <div className="min-vh-150 d-flex flex-column">
            <Container fluid className="flex-grow-1 d-flex flex-column">
                <Routes>
                    <Route path="/" element={!loggedIn ? <PublicPage loggedIn={loggedIn} logout={handleLogout} /> : <Navigate replace to='/game' />} />
                    <Route path="/login" element={
                        loggedIn ? <Navigate replace to='/game' />
                            : <LoginForm login={handleLogin} />
                    } />
                    <Route path="/game" element={
                        loggedIn ? <GamePage loggedIn={loggedIn} logout={handleLogout} /> : <Navigate replace to='/' />
                    } />
                    <Route path="/scoreboard" element={
                        loggedIn ? <ScoreboardPage loggedIn={loggedIn} logout={handleLogout} /> : <Navigate replace to='/' />
                    } />
                    <Route path="*" element={<Navigate replace to='/' />} />
                </Routes>
            </Container>
        </div>
    );
}

export default App;