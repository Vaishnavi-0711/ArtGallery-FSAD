import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Form, Spinner, ListGroup } from 'react-bootstrap';
import {
  getMyExhibitions, createExhibition, updateExhibition, deleteExhibition,
  addArtworkToExhibition, removeArtworkFromExhibition, getArtworks
} from '../../services/api';
import DashboardCard from '../../components/DashboardCard';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const emptyForm = { title: '', description: '', theme: '' };

const CuratorDashboard = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showArtworkModal, setShowArtworkModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedEx, setSelectedEx] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [allArtworks, setAllArtworks] = useState([]);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getMyExhibitions().then(r => setExhibitions(r.data)).finally(() => setLoading(false));
  }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = ex => { setEditing(ex); setForm({ title: ex.title, description: ex.description || '', theme: ex.theme || '' }); setShowModal(true); };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const { data } = await updateExhibition(editing.id, form);
        setExhibitions(ex => ex.map(x => x.id === editing.id ? data : x));
        toast.success('Exhibition updated!');
      } else {
        const { data } = await createExhibition(form);
        setExhibitions(ex => [data, ...ex]);
        toast.success('Exhibition created!');
      }
      setShowModal(false);
    } catch { toast.error('Error saving exhibition'); }
    finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this exhibition?')) return;
    try {
      await deleteExhibition(id);
      setExhibitions(ex => ex.filter(x => x.id !== id));
      toast.success('Exhibition deleted');
    } catch { toast.error('Error'); }
  };

  const openArtworkManager = async ex => {
    setSelectedEx(ex);
    const { data } = await getArtworks({ page: 0 });
    setAllArtworks(data.content || []);
    setShowArtworkModal(true);
  };

  const handleAddArtwork = async artworkId => {
    try {
      const { data } = await addArtworkToExhibition(selectedEx.id, artworkId);
      setExhibitions(ex => ex.map(x => x.id === selectedEx.id ? data : x));
      setSelectedEx(data);
      toast.success('Artwork added!');
    } catch { toast.error('Error adding artwork'); }
  };

  const handleRemoveArtwork = async artworkId => {
    try {
      const { data } = await removeArtworkFromExhibition(selectedEx.id, artworkId);
      setExhibitions(ex => ex.map(x => x.id === selectedEx.id ? data : x));
      setSelectedEx(data);
      toast.success('Artwork removed');
    } catch { toast.error('Error'); }
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="danger" /></div>;

  const totalArtworks = exhibitions.reduce((s, ex) => s + (ex.artworks?.length || 0), 0);

  return (
    <div className="fade-in" style={{ background: 'var(--bg-gray)', minHeight: '100vh' }}>
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 p-4 bg-white rounded-4 border shadow-sm">
        <div>
          <h2 className="fw-800 mb-0 uppercase letter-spacing-1">CURATOR <span className="text-accent">DASHBOARD</span></h2>
          <p className="mb-0 text-muted small fw-bold">ORCHESTRATE THEMATIC EXHIBITIONS & GALLERY SHOWS</p>
        </div>
        <Button className="btn-premium btn-premium-primary" onClick={openCreate}>+ NEW SHOW</Button>
      </div>

      <Row className="g-3 mb-4">
        <Col md={6}><DashboardCard title="Active Exhibitions" value={exhibitions.length} icon="🏛️" color="dark" /></Col>
        <Col md={6}><DashboardCard title="Total Artworks" value={totalArtworks} icon="🖼️" color="dark" /></Col>
      </Row>

      {exhibitions.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm">
          <div style={{ fontSize: '4rem', opacity: 0.2 }}>🏛️</div>
          <h4 className="fw-bold mt-4">No shows scheduled</h4>
          <p className="text-muted mb-4">Start curating your first thematic journey today.</p>
          <Button className="btn-premium btn-premium-primary" onClick={openCreate}>Create Show</Button>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {exhibitions.map(ex => (
            <Col key={ex.id}>
              <Card className="card-premium h-100 border-0 bg-white">
                <div style={{ height: '140px', background: 'var(--primary)', borderRadius: '20px 20px 0 0' }}
                     className="d-flex align-items-center justify-content-center">
                  <span className="text-white opacity-20 fw-800" style={{ fontSize: '2rem' }}>EXHIBITION</span>
                </div>
                <Card.Body className="p-4">
                  {ex.theme && <Badge bg="dark" className="mb-3 px-3 py-2 uppercase">{ex.theme}</Badge>}
                  <Card.Title className="fw-800 h4 mb-3">{ex.title}</Card.Title>
                  <Card.Text className="text-muted small mb-4 lh-base">{ex.description?.substring(0, 100)}...</Card.Text>
                  <div className="d-flex gap-2 flex-wrap pt-3 border-top border-light mt-auto">
                    <Button size="sm" variant="dark" className="fw-bold small py-1 px-3" onClick={() => openArtworkManager(ex)}>MANAGE</Button>
                    <Button size="sm" variant="outline-dark" className="fw-bold small py-1 px-3" onClick={() => openEdit(ex)}>EDIT</Button>
                    <Button size="sm" variant="outline-danger" className="fw-bold small py-1 px-3" onClick={() => handleDelete(ex.id)}>✕</Button>
                    <Button size="sm" variant="outline-secondary" className="fw-bold small py-1 px-3" onClick={() => navigate(`/exhibitions/${ex.id}`)}>VIEW</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-800 uppercase">{editing ? 'EDIT SHOW' : 'NEW SHOW'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body className="p-4">
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted uppercase">Show Title</Form.Label>
              <Form.Control required className="bg-light border-0 py-2" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted uppercase">Thematic Category</Form.Label>
              <Form.Control className="bg-light border-0 py-2" placeholder="e.g. Modern Art, Nature" value={form.theme}
                onChange={e => setForm(f => ({ ...f, theme: e.target.value }))} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted uppercase">Curatorial Statement</Form.Label>
              <Form.Control as="textarea" rows={4} className="bg-light border-0 py-2" value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
             <Button variant="link" className="text-muted text-decoration-none fw-bold" onClick={() => setShowModal(false)}>CANCEL</Button>
             <Button className="btn-premium btn-premium-primary px-4 py-2" type="submit" disabled={saving}>{saving ? 'ORCHESTRATING...' : editing ? 'UPDATE SHOW' : 'PUBLISH SHOW'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Artwork Manager Modal */}
      <Modal show={showArtworkModal} onHide={() => setShowArtworkModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0 shadow-sm bg-light">
          <Modal.Title className="fw-800 uppercase text-dark">CURATION PANEL — {selectedEx?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Row className="g-4">
            <Col md={6}>
              <h6 className="fw-800 mb-3 uppercase">IN EXHIBITION <span className="text-accent">({selectedEx?.artworks?.length || 0})</span></h6>
              <div className="bg-light rounded-4 p-2 border" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <ListGroup variant="flush">
                  {selectedEx?.artworks?.map(a => (
                    <ListGroup.Item key={a.id} className="d-flex justify-content-between align-items-center px-2 bg-transparent">
                      <div className="d-flex align-items-center gap-2">
                        {a.imageUrl ? <img src={`http://localhost:8080${a.imageUrl}`} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} /> : '🖼️'}
                        <div>
                          <div className="fw-bold small">{a.title.toUpperCase()}</div>
                          <div className="text-muted" style={{ fontSize: '0.7rem' }}>{a.artistName}</div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline-danger" className="fw-bold small border-0" onClick={() => handleRemoveArtwork(a.id)}>REMOVE</Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            </Col>
            <Col md={6}>
              <h6 className="fw-800 mb-3 uppercase">VAULT ACCESS <span className="text-muted">(AVAILABLE)</span></h6>
              <div className="bg-light rounded-4 p-2 border" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <ListGroup variant="flush">
                  {allArtworks
                    .filter(a => !selectedEx?.artworks?.find(ea => ea.id === a.id))
                    .map(a => (
                      <ListGroup.Item key={a.id} className="d-flex justify-content-between align-items-center px-2 bg-transparent">
                        <div className="d-flex align-items-center gap-2">
                          {a.imageUrl ? <img src={`http://localhost:8080${a.imageUrl}`} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} /> : '🖼️'}
                          <div>
                            <div className="fw-bold small">{a.title.toUpperCase()}</div>
                            <div className="text-muted" style={{ fontSize: '0.7rem' }}>{a.artistName}</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline-success" className="fw-bold small border-0" onClick={() => handleAddArtwork(a.id)}>ADD</Button>
                      </ListGroup.Item>
                    ))}
                </ListGroup>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button className="btn-premium btn-premium-primary px-4 py-2" onClick={() => setShowArtworkModal(false)}>DONE</Button>
        </Modal.Footer>
      </Modal>
    </Container>
    </div>
  );
};

export default CuratorDashboard;
