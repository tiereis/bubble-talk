// src/components/UserList.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Alert, Button, Spinner } from 'react-bootstrap';

interface User {
  id: number;
  username: string;
  is_following: boolean;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/users/list/', {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      setUsers(response.data);
    } catch (err) {
      setError('Não foi possível carregar a lista de usuários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [navigate]);

  const handleToggleFollow = async (userId: number, isCurrentlyFollowing: boolean) => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      if (isCurrentlyFollowing) {
        // Lógica para deixar de seguir (DELETE request)
        await axios.delete(`http://127.0.0.1:8000/api/users/follow/${userId}/`, {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
        alert('Você deixou de seguir este usuário!');
      } else {
        // Lógica para seguir (POST request)
        await axios.post(`http://127.0.0.1:8000/api/users/follow/${userId}/`, {}, {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
        alert('Agora você está seguindo este usuário!');
      }
      // Após a ação, atualize a lista de usuários para refletir a mudança
      fetchUsers(); 
    } catch (err) {
      alert('Erro ao processar a ação. Tente novamente.');
      console.error(err);
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-5">
      <h2>Descobrir Pessoas</h2>
      {users.map(user => (
        <Card key={user.id} className="mb-2">
          <Card.Body className="d-flex justify-content-between align-items-center">
            <h5>@{user.username}</h5>
            {/* Renderização condicional do botão */}
            <Button 
              onClick={() => handleToggleFollow(user.id, user.is_following)}
              variant={user.is_following ? "outline-secondary" : "primary"}
            >
              {user.is_following ? "Deixar de Seguir" : "Seguir"}
            </Button>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default UserList;