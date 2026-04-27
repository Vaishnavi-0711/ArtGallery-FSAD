import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';

const checks = [
  { label: 'At least 6 characters',        test: p => p.length >= 6 },
  { label: 'At least one uppercase letter', test: p => /[A-Z]/.test(p) },
  { label: 'At least one number',           test: p => /[0-9]/.test(p) },
  { label: 'At least one special character',test: p => /[^A-Za-z0-9]/.test(p) },
];

const Register = () => {
  const [form, setForm]           = useState({ name: '', email: '', password: '', role: 'VISITOR' });
  const [confirm, setConfirm]     = useState('');
  const [showPwd, setShowPwd]     = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const { loginUser }             = useAuth();
  const navigate                  = useNavigate();

  const allPassed   = checks.every(c => c.test(form.password));
  const pwdMatch    = form.password === confirm;

  const handleSubmit = async e => {
    e.preventDefault();
    if (!allPassed)  { setError('Please meet all password requirements.'); return; }
    if (!pwdMatch)   { setError('Passwords do not match.'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await register(form);
      loginUser(data);
      if (form.role === 'VISITOR') navigate('/');
      else navigate('/login', { state: { message: 'Registration successful! Await admin approval.' } });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '90vh', background: 'var(--bg-gray)' }}
         className="d-flex align-items-center py-5 fade-in">
      <Container style={{ maxWidth: '440px', marginTop: '-20px' }}>
        <div className="text-center mb-4">
           <h2 className="fw-800" style={{ letterSpacing: '-0.05em', fontSize: '2rem' }}>CREATE ACCOUNT</h2>
           <p className="text-muted small">Join our global community of art collectors.</p>
        </div>
        <Card className="card-premium p-3 border-0">
          <Card.Body className="p-4">
            {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold text-muted">Full Name</Form.Label>
                <Form.Control placeholder="Jane Doe" required value={form.name} className="bg-light border-0 py-2"
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold text-muted">Email Address</Form.Label>
                <Form.Control type="email" placeholder="jane@example.com" required value={form.email} className="bg-light border-0 py-2"
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </Form.Group>

              {/* Password */}
              <Form.Group className="mb-2">
                <Form.Label className="small fw-semibold text-muted">Password</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPwd ? 'text' : 'password'}
                    placeholder="••••••••" required
                    className="bg-light border-0 py-2"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  />
                  <button type="button" onClick={() => setShowPwd(s => !s)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: '#888', zIndex: 10 }}>
                    {showPwd ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </Form.Group>

              {/* Password strength checklist */}
              {form.password.length > 0 && (
                <div className="mb-3 p-3 rounded-3" style={{ background: 'var(--bg-gray)', fontSize: '0.75rem' }}>
                  {checks.map((c, i) => (
                    <div key={i} className="d-flex align-items-center gap-2 mb-1" style={{ color: c.test(form.password) ? '#059669' : '#DC2626' }}>
                      <span style={{ fontSize: '0.8rem' }}>{c.test(form.password) ? '●' : '○'}</span> {c.label}
                    </div>
                  ))}
                </div>
              )}

              {/* Confirm Password */}
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold text-muted">Confirm Password</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type="password"
                    placeholder="••••••••" required
                    className="bg-light border-0 py-2"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                  />
                </div>
                {confirm.length > 0 && !pwdMatch && (
                  <div className="small mt-1 text-danger">Passwords do not match</div>
                )}
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="small fw-semibold text-muted">Account Type</Form.Label>
                <Form.Select className="bg-light border-0 py-2" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                  <option value="VISITOR">Visitor (Art Lover)</option>
                  <option value="ARTIST">Artist (Upload Art)</option>
                  <option value="CURATOR">Curator (Organize Events)</option>
                </Form.Select>
              </Form.Group>
              <Button type="submit" className="btn-premium btn-premium-primary w-100 py-2" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </Form>
            <p className="text-center mb-0 text-muted small mt-4">
              Already have an account? <Link to="/login" className="text-dark fw-bold text-decoration-none">Sign in</Link>
            </p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Register;
