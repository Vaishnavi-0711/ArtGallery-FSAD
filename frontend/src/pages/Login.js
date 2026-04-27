import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: 'admin@gallery.com', password: 'Admin123' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const roleRedirect = { ADMIN: '/admin', ARTIST: '/artist', CURATOR: '/curator', VISITOR: '/' };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await login(form);
      if (data.status === 'BLOCKED') { setError('Account blocked.'); return; }
      if (data.status === 'PENDING') { setError('Account pending approval.'); return; }
      loginUser(data);
      navigate(roleRedirect[data.role] || '/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '90vh', background: 'var(--bg-gray)' }} className="d-flex align-items-center justify-content-center fade-in">
      <Container style={{ maxWidth: '420px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-800">WELCOME BACK</h2>
          <p className="text-muted small">Please sign in to continue to the gallery.</p>
        </div>
        <Card className="card-premium p-3">
          <Card.Body>
            {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-muted">EMAIL ADDRESS</Form.Label>
                <Form.Control type="email" required value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-muted">PASSWORD</Form.Label>
                <div className="position-relative">
                  <Form.Control type={showPwd ? 'text' : 'password'} required value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                  <button type="button" onClick={() => setShowPwd(s => !s)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.7rem' }}>
                    {showPwd ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </Form.Group>
              <Button type="submit" className="btn-premium btn-premium-primary w-100 py-3" disabled={loading}>
                {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
              </Button>
            </Form>
            <div className="text-center mt-4">
               <p className="text-muted small mb-0">New here? <Link to="/register" className="text-accent fw-bold text-decoration-none">Create an account</Link></p>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Login;
