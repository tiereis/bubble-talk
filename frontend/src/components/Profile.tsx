// src/components/Profile.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';

interface ProfileData {
  user: {
    id: number;
    username: string;
    email: string;
  };
  profile_picture: string | null;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const response = await axios.get('https://tiereis.pythonanywhere.com/api/users/profile/', {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      setProfile(response.data);
      setNewUsername(response.data.user.username);
      setNewEmail(response.data.user.email);
    } catch (err) {
      setError('Não foi possível carregar o perfil.');
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const formData = new FormData();
      if (newUsername !== profile?.user.username) {
        formData.append('username', newUsername);
      }
      if (newEmail !== profile?.user.email) {
        formData.append('email', newEmail);
      }
      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      }

      await axios.patch('https://tiereis.pythonanywhere.com/api/users/profile/', formData, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Perfil atualizado com sucesso!');
      setEditing(false);
      fetchProfile();
    } catch (err) {
      alert('Erro ao atualizar o perfil. Tente novamente.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="mt-5">{error}</Alert>;
  }

  return (
    <div className="mt-5">
      <h2 className='text-light'>Perfil do Usuário</h2>
      <Card>
        <Card.Body>
          <Card.Title>@{profile?.user.username}</Card.Title>
          <Card.Text>Email: {profile?.user.email}</Card.Text>
          {profile?.profile_picture && (
            <img src={`https://tiereis.pythonanywhere.com${profile.profile_picture}`} alt="Foto de Perfil" className="img-thumbnail" style={{ width: '150px' }} />
          )}
          <Button onClick={() => setEditing(!editing)} className="mt-3">
            {editing ? 'Cancelar' : 'Editar Perfil'}
          </Button>
        </Card.Body>
      </Card>

      {editing && (
        <Card className="mt-4">
          <Card.Body>
            <h4>Editar Dados</h4>
            <Form onSubmit={handleUpdate}>
              <Form.Group className="mb-3">
                <Form.Label>Nome de Usuário</Form.Label>
                <Form.Control type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Foto de Perfil</Form.Label>
                <Form.Control type="file" onChange={(e: any) => setProfilePicture(e.target.files[0])} />
              </Form.Group>
              <Button type="submit" variant="success">Salvar Alterações</Button>
            </Form>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default Profile;