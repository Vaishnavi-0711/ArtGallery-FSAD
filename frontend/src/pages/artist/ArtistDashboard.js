import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Badge, Modal, Form, Spinner, Table, Card } from 'react-bootstrap';
import { getMyArtworks, createArtwork, updateArtwork, deleteArtwork, getCategories } from '../../services/api';
import DashboardCard from '../../components/DashboardCard';
import { toast } from 'react-toastify';

const emptyForm = { title: '', description: '', price: '', categoryId: '', culturalHistory: '' };

const ArtistDashboard = () => {
  const [artworks, setArtworks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([getMyArtworks(), getCategories()]).then(([a, c]) => {
      setArtworks(a.data);
      setCategories(c.data);
    }).finally(() => setLoading(false));
  }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setImage(null); setShowModal(true); };
  const openEdit = (a) => {
    setEditing(a);
    setForm({ title: a.title, description: a.description || '', price: a.price, categoryId: a.categoryId || '', culturalHistory: a.culturalHistory || '' });
    setImage(null);
    setShowModal(true);
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('data', new Blob([JSON.stringify(form)], { type: 'application/json' }));
      if (image) fd.append('image', image);
      if (editing) {
        const { data } = await updateArtwork(editing.id, fd);
        setArtworks(a => a.map(x => x.id === editing.id ? data : x));
        toast.success('Artwork updated!');
      } else {
        const { data } = await createArtwork(fd);
        setArtworks(a => [data, ...a]);
        toast.success('Artwork uploaded! Awaiting approval.');
      }
      setShowModal(false);
    } catch { toast.error('Error saving artwork'); }
    finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this artwork?')) return;
    try {
      await deleteArtwork(id);
      setArtworks(a => a.filter(x => x.id !== id));
      toast.success('Artwork deleted');
    } catch { toast.error('Error deleting artwork'); }
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="danger" /></div>;

  const approved = artworks.filter(a => a.status === 'APPROVED').length;
  const pending = artworks.filter(a => a.status === 'PENDING').length;

  return (
    <div className="fade-in" style={{ background: 'var(--bg-gray)', minHeight: '100vh' }}>
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 p-4 bg-white rounded-4 border shadow-sm">
        <div>
          <h2 className="fw-800 mb-0 uppercase letter-spacing-1">ARTIST <span className="text-accent">STUDIO</span></h2>
          <p className="mb-0 text-muted small fw-bold">TRACK PERFORMANCE & UPLOAD NEW MASTERPIECES</p>
        </div>
        <Button className="btn-premium btn-premium-primary" onClick={openCreate}>+ UPLOAD ART</Button>
      </div>

      <Row className="g-3 mb-4">
        <Col md={3}><DashboardCard title="Total Works" value={artworks.length} icon="🖼️" color="dark" /></Col>
        <Col md={3}><DashboardCard title="Live" value={approved} icon="✅" color="dark" /></Col>
        <Col md={3}><DashboardCard title="Pending" value={pending} icon="⏳" color="dark" /></Col>
        <Col md={3}><DashboardCard title="Rejected" value={artworks.length - approved - pending} icon="❌" color="danger" /></Col>
      </Row>

      {artworks.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm">
          <div style={{ fontSize: '4rem', opacity: 0.2 }}>🎨</div>
          <h4 className="fw-bold mt-4">No artworks yet</h4>
          <p className="text-muted mb-4">You haven't uploaded any masterpieces yet.</p>
          <Button className="btn-premium btn-premium-primary" onClick={openCreate}>Upload First Piece</Button>
        </div>
      ) : (
        <Card className="card-premium border-0 bg-white shadow-sm overflow-hidden p-3">
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead>
                <tr className="text-muted small uppercase fw-bold border-bottom">
                  <th className="py-3">Cover</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Value</th>
                  <th>Status</th>
                  <th>Review</th>
                  <th className="text-end">Command</th>
                </tr>
              </thead>
              <tbody>
                {artworks.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div className="rounded-2 overflow-hidden" style={{ width: '50px', height: '50px', border: '1px solid var(--border)' }}>
                        {a.imageUrl ? <img src={`http://localhost:8080${a.imageUrl}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🖼️'}
                      </div>
                    </td>
                    <td className="fw-bold">{a.title}</td>
                    <td><Badge bg="light" text="dark" className="border uppercase small">{a.categoryName || 'GENERAL'}</Badge></td>
                    <td className="fw-bold">₹{Number(a.price).toLocaleString()}</td>
                    <td><Badge bg={a.status === 'APPROVED' ? 'dark' : 'warning'}>{a.status}</Badge></td>
                    <td>{a.avgRating ? `⭐ ${a.avgRating.toFixed(1)}` : '—'}</td>
                    <td className="text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        <Button size="sm" variant="outline-dark" className="fw-bold px-3 py-1" style={{ fontSize: '0.7rem' }} onClick={() => openEdit(a)}>EDIT</Button>
                        <Button size="sm" variant="outline-danger" className="fw-bold px-3 py-1" style={{ fontSize: '0.7rem' }} onClick={() => handleDelete(a.id)}>REMOVE</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-800 uppercase">{editing ? 'EDIT PERFORMANCE' : 'NEW MASTERPIECE'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body className="p-4">
            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-muted uppercase">TITLE</Form.Label>
                  <Form.Control required className="bg-light border-0 py-2" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-muted uppercase">PRICE (₹)</Form.Label>
                  <Form.Control type="number" required className="bg-light border-0 py-2" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-muted uppercase">CATEGORY</Form.Label>
                  <Form.Select className="bg-light border-0 py-2" value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-muted uppercase">DESCRIPTION</Form.Label>
                  <Form.Control as="textarea" rows={3} className="bg-light border-0 py-2" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-muted uppercase">ARTWORK IMAGE</Form.Label>
                  <Form.Control type="file" className="bg-light border-0 py-2" accept="image/*" onChange={e => setImage(e.target.files[0])} />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-muted uppercase">CULTURAL HISTORY</Form.Label>
                  <Form.Control as="textarea" rows={3} className="bg-light border-0 py-2" placeholder="Describe the history and cultural significance..." value={form.culturalHistory} onChange={e => setForm(f => ({ ...f, culturalHistory: e.target.value }))} />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button variant="link" className="text-muted text-decoration-none fw-bold" onClick={() => setShowModal(false)}>CANCEL</Button>
            <Button className="btn-premium btn-premium-primary px-4 py-2" type="submit" disabled={saving}>{saving ? 'UPLOADING...' : editing ? 'UPDATE WORKS' : 'PUBLISH PIECE'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
    </div>
  );
};

export default ArtistDashboard;
