import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { LoginForm } from './components/Auth.jsx';
import { PublicPage, GamePage, ScoreboardPage } from './components/PageLayout.jsx';
import API from "./API.js";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    // useEffect(() => {
    //     API.getUserInfo()
    //         .then((user) => {
    //             setLoggedIn(true);
    //             setUser(user);
    //         }).catch(() => {
    //             setLoggedIn(false);
    //             setUser(null);
    //         });
    // }, []);


    const handleLogin = async (credentials) => {
        const user = await API.logIn(credentials);
        setLoggedIn(true);
        setUser(user);
    };

    const handleLogout = async () => {
        await API.logOut();
        setLoggedIn(false);
        setUser(null);
    };

    return (
        <div className="d-flex flex-column h-100">
            <Routes>
                <Route path="/" element={!loggedIn ? <PublicPage /> : <Navigate replace to='/game' />} />
                <Route path="/login" element={
                    loggedIn ? <Navigate replace to='/game' />
                        : <LoginForm login={handleLogin} />
                } />
                <Route path="/game" element={
                    loggedIn ? <GamePage user={user} logout={handleLogout} /> : <Navigate replace to='/' />
                } />
                <Route path="/scoreboard" element={
                    loggedIn ? <ScoreboardPage user={user} logout={handleLogout} /> : <Navigate replace to='/' />
                } />
                <Route path="*" element={<Navigate replace to='/' />} />
            </Routes>
        </div>
    );
}

export default App;