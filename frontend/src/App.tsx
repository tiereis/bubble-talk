// src/App.tsx

import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Register from './components/Register';
import Feed from './components/Feed';
import Profile from './components/Profile';

function App() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Esta função é chamada ao carregar a página para verificar o token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const fetchUserProfile = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/users/profile/', {
            headers: {
              'Authorization': `Token ${token}`,
            },
          });
          setUser(response.data.user);
        } catch (error) {
          console.error('Falha ao buscar perfil', error);
          localStorage.removeItem('token');
          setUser(null); // Limpa o estado se o token for inválido
        }
      };
      fetchUserProfile();
    }
  }, []);

  // Nova função para lidar com o login bem-sucedido
  const handleLogin = (username: string) => {
    setUser({ username });
    navigate('/feed'); // Redireciona para o feed
  };

  // Nova função para lidar com o logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null); // Limpa o estado
    navigate('/login'); // Redireciona para a página de login
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
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
      
      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;