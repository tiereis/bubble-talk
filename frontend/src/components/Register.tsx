// src/components/Register.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/users/register/', {
        username,
        email,
        password,
      });
      alert('Registro bem-sucedido! Agora você pode fazer login.');
      navigate('/login');
    } catch (error) {
      alert('Erro ao registrar. Verifique os dados ou tente outro nome de usuário.');
      console.error(error);
    }
  };

  return (
    <div className="mt-5">
      <h2 className='text-light'>Registro</h2>
      <Form onSubmit={handleSubmit}>
        <div className="mb-3 text-light">
          <Form.Label>Nome de Usuário</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3 text-light">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3 text-light">
          <Form.Label>Senha</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" variant="primary">Registrar</Button>
      </Form>
    </div>
  );
};

export default Register;