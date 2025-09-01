// src/components/Feed.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, Spinner, Alert, Form, Button } from 'react-bootstrap';

interface Post {
  id: number;
  author_username: string;
  content: string;
  created_at: string;
  likes_count: number;
  comments: Comment[];
}

interface Comment {
  id: number;
  author_username: string;
  content: string;
  created_at: string;
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newCommentContent, setNewCommentContent] = useState<{ [key: number]: string }>({});
  const navigate = useNavigate();

  const fetchFeed = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get('http://127.0.0.1:8000/api/posts/feed/', {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      setPosts(response.data);
    } catch (err) {
      console.error('Erro ao buscar o feed:', err);
      setError('Não foi possível carregar o feed. Por favor, tente novamente.');
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [navigate]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/posts/all/', {
        content: newPostContent,
      }, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      setPosts([response.data, ...posts]);
      setNewPostContent('');
    } catch (err) {
      alert('Erro ao criar a postagem.');
      console.error(err);
    }
  };
  
  const handleLike = async (postId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/posts/${postId}/like/`, {}, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (response.status === 201) {
        setPosts(posts.map(p =>
          p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p
        ));
      } else if (response.status === 204) {
        setPosts(posts.map(p =>
          p.id === postId ? { ...p, likes_count: p.likes_count - 1 } : p
        ));
      }
    } catch (err) {
      console.error('Erro ao curtir a postagem:', err);
      alert('Erro ao processar a curtida. Tente novamente.');
    }
  };

  const handleComment = async (postId: number) => {
    const token = localStorage.getItem('token');
    const commentContent = newCommentContent[postId];
    if (!token || !commentContent) return;

    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/posts/${postId}/comments/`, {
        content: commentContent
      }, {
        headers: {
          'Authorization': `Token ${token}`,
        }
      });
      setPosts(posts.map(p => 
        p.id === postId ? { ...p, comments: [...p.comments, response.data] } : p
      ));
      setNewCommentContent(prev => ({ ...prev, [postId]: '' }));
    } catch (err) {
      alert('Erro ao comentar. Tente novamente.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <h2 className='text-light'>Seu Feed de Notícias</h2>
      
      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleCreatePost}>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="O que você está pensando?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
            </Form.Group>
            <Button type="submit" variant="primary">Postar</Button>
          </Form>
        </Card.Body>
      </Card>

      {posts.length > 0 ? (
        posts.map((post) => (
          <Card key={post.id} className="mb-3">
            <Card.Body>
              <Card.Title>@{post.author_username}</Card.Title>
              <Card.Text>{post.content}</Card.Text>
              <Card.Text className="text-muted">
                <small>Postado em: {new Date(post.created_at).toLocaleDateString()}</small>
              </Card.Text>
              
              <div className="d-flex justify-content-between align-items-center">
                <Button variant="link" onClick={() => handleLike(post.id)}>
                  Curtir ({post.likes_count})
                </Button>
                <span>{post.comments.length} Comentários</span>
              </div>
              
              <hr />

              <div className="mt-3">
                <h5>Comentários</h5>
                {post.comments.length > 0 ? (
                  post.comments.map(comment => (
                    <Card key={comment.id} className="mb-2">
                      <Card.Body>
                        <Card.Text>
                          <strong>@{comment.author_username}:</strong> {comment.content}
                        </Card.Text>
                        <Card.Text className="text-muted text-end">
                          <small>em: {new Date(comment.created_at).toLocaleDateString()}</small>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  ))
                ) : (
                  <p>Nenhum comentário ainda.</p>
                )}

                <Form className="mt-3" onSubmit={(e) => { e.preventDefault(); handleComment(post.id); }}>
                  <Form.Group>
                    <Form.Control 
                      type="text" 
                      placeholder="Adicionar um comentário..." 
                      value={newCommentContent[post.id] || ''}
                      onChange={(e) => setNewCommentContent(prev => ({ ...prev, [post.id]: e.target.value }))}
                    />
                  </Form.Group>
                  <Button type="submit" size="sm" className="mt-2">Comentar</Button>
                </Form>
              </div>
            </Card.Body>
          </Card>
        ))
      ) : (
        <Alert variant="info">Seu feed está vazio. Siga algumas pessoas para ver as postagens!</Alert>
      )}
    </div>
  );
};

export default Feed;