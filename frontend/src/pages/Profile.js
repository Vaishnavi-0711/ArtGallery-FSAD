import React, { useEffect, useState } from 'react';
import { Container, Card, Form, Button, Badge, Row, Col, Spinner } from 'react-bootstrap';
import { getProfile, updateProfile } from '../services/api';
import { toast } from 'react-toastify';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', bio: '' });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProfile().then(r => {
      setProfile(r.data);
      setForm({ name: r.data.name, bio: r.data.bio || '' });
    });
  }, []);

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await updateProfile(form);
      setProfile(data);
      setEditing(false);
      toast.success('Profile updated!');
    } catch { toast.error('Error updating profile'); }
    finally { setSaving(false); }
  };

  if (!profile) return <div className="text-center py-5"><Spinner animation="border" /></div>;

  const roleColor = { ADMIN: 'danger', ARTIST: 'primary', CURATOR: 'success', VISITOR: 'secondary' };

  return (
    <div className="fade-in" style={{ background: 'var(--bg-gray)', minHeight: '100vh' }}>
    <Container className="py-5" style={{ maxWidth: '750px' }}>
      <Card className="card-premium border-0 shadow-lg overflow-visible">
        <div style={{ height: '160px', background: 'var(--accent)', borderRadius: '20px 20px 0 0' }} />
        <Card.Body className="p-4 pt-0">
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div className="position-relative">
              <div style={{
                width: '100px', height: '100px', borderRadius: '50%',
                background: 'var(--white)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '2.5rem', color: 'var(--primary)',
                marginTop: '-50px', border: '5px solid var(--white)',
                boxShadow: 'var(--shadow-md)', fontWeight: '800'
              }}>
                {profile.name?.charAt(0).toUpperCase()}
              </div>
              <h1 className="fw-800 fs-2 mt-3 mb-1" style={{ letterSpacing: '-0.04em' }}>{profile.name}</h1>
              <p className="text-muted mb-2">{profile.email}</p>
              <div className="d-flex gap-2">
                <Badge bg={roleColor[profile.role] || 'dark'}>{profile.role}</Badge>
                <Badge bg={profile.status === 'ACTIVE' ? 'success' : 'warning'}>{profile.status}</Badge>
              </div>
            </div>
            {!editing && (
              <Button className="btn-premium btn-premium-primary py-2 px-4 shadow-sm" onClick={() => setEditing(true)}>Edit Profile</Button>
            )}
          </div>

          {editing ? (
            <Form onSubmit={handleSave}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Bio</Form.Label>
                <Form.Control as="textarea" rows={4} placeholder="Tell us about yourself..."
                  value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
              </Form.Group>
              <div className="d-flex gap-2">
                <Button type="submit" variant="dark" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                <Button variant="outline-secondary" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </Form>
          ) : (
            <div>
              {profile.bio ? (
                <div>
                  <h6 className="fw-bold text-muted mb-2">About</h6>
                  <p>{profile.bio}</p>
                </div>
              ) : (
                <p className="text-muted fst-italic">No bio added yet. Click Edit Profile to add one.</p>
              )}
              <hr />
              <Row className="text-muted small">
                <Col>Member since: {new Date(profile.createdAt).toLocaleDateString()}</Col>
              </Row>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
    </div>
  );
};

export default Profile;
