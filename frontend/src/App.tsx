// src/App.tsx

import { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Register from './components/Register';
import Feed from './components/Feed';
import Profile from './components/Profile';
import UserList from './components/UserList';

function App() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const fetchUserProfile = async () => {
        try {
          const response = await axios.get('https://tiereis.pythonanywhere.com/api/users/profile/', {
            headers: {
              'Authorization': `Token ${token}`,
            },
          });
          setUser(response.data.user);
        } catch (error) {
          console.error('Falha ao buscar perfil', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      };
      fetchUserProfile();
    }
  }, []);

  const handleLogin = (username: string) => {
    setUser({ username });
    navigate('/feed');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
        <div className="container">
          <Link className="navbar-brand" to="/">Bubble-Talk</Link>
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link text-dark me-2">Olá, {user.username}</span>
                </li>
                <li className="nav-item">
                  {location.pathname === '/profile' ? (
                    <Link className="nav-link" to="/feed">Feed</Link>
                  ) : (
                    <Link className="nav-link" to="/profile">Perfil</Link>
                  )}
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/users">Descobrir</Link>
                </li>
                <li className="nav-item">
                  <span className="nav-link" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                    Logout
                  </span>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Registro</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
      
      {/* Centraliza o corpo da aplicação com a nova classe CSS */}
      <div className="centered-content" style={{ paddingTop: '70px' }}>
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/users" element={<UserList />} />
        </Routes>
      </div>
    </>
  );
}

export default App;