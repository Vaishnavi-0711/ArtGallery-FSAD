import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Badge, Tab, Tabs, Spinner, Form, Modal, Card } from 'react-bootstrap';
import { getReports, getUsers, approveUser, blockUser, assignRole, getAdminArtworks, approveArtwork, createAdminArtwork, deleteAdminArtwork, getCategories } from '../../services/api';
import DashboardCard from '../../components/DashboardCard';
import { toast } from 'react-toastify';

const EMPTY_FORM = { title: '', description: '', price: '', categoryId: '', culturalHistory: '', artistId: '' };

const AdminDashboard = () => {
  const [reports, setReports]       = useState({});
  const [users, setUsers]           = useState([]);
  const [artworks, setArtworks]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [imageFile, setImageFile]   = useState(null);
  const [saving, setSaving]         = useState(false);

  useEffect(() => {
    Promise.all([
      getReports(), getUsers(), getAdminArtworks(0),
      getCategories()
    ]).then(([r, u, a, cats]) => {
      setReports(r.data); setUsers(u.data);
      setArtworks(a.data.content || []);
      setCategories(cats.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleApproveUser    = async id => { const { data } = await approveUser(id); setUsers(u => u.map(x => x.id === id ? data : x)); toast.success('User approved'); };
  const handleBlockUser      = async id => { await blockUser(id); setUsers(u => u.map(x => x.id === id ? { ...x, status: 'BLOCKED' } : x)); toast.success('User blocked'); };
  const handleAssignRole     = async (id, role) => { const { data } = await assignRole(id, role); setUsers(u => u.map(x => x.id === id ? data : x)); toast.success('Role updated'); };
  const handleApproveArtwork = async id => { const { data } = await approveArtwork(id); setArtworks(a => a.map(x => x.id === id ? data : x)); toast.success('Artwork approved'); };
  const handleDeleteArtwork  = async id => {
    if (!window.confirm('Delete this artwork?')) return;
    await deleteAdminArtwork(id);
    setArtworks(a => a.filter(x => x.id !== id));
    toast.success('Artwork deleted');
  };

  const handleAddArtwork = async e => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      const { data } = await createAdminArtwork(fd);
      setArtworks(a => [data, ...a]);
      setShowModal(false); setForm(EMPTY_FORM); setImageFile(null);
      toast.success('Artwork added!');
    } catch { toast.error('Failed to add artwork'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="danger" /></div>;

  const artists = users.filter(u => u.role === 'ARTIST');

  return (
    <div className="fade-in" style={{ background: 'var(--bg-gray)', minHeight: '100vh' }}>
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4 p-4 bg-white rounded-4 border shadow-sm">
          <div>
            <h2 className="fw-800 mb-0 uppercase letter-spacing-1">COMMAND <span className="text-accent">CENTER</span></h2>
            <p className="mb-0 text-muted small fw-bold">ADMINISTRATIVE OVERVIEW & SYSTEM CONTROL</p>
          </div>
          <Button className="btn-premium btn-premium-primary" onClick={() => setShowModal(true)}>+ ADD ARTWORK</Button>
        </div>

        <Row className="g-3 mb-4">
          <Col md={3}><DashboardCard title="Total Users" value={reports.totalUsers} icon="👥" color="dark" /></Col>
          <Col md={3}><DashboardCard title="Total Artworks" value={reports.totalArtworks} icon="🖼️" color="dark" /></Col>
          <Col md={3}><DashboardCard title="Total Orders" value={reports.totalOrders} icon="🛒" color="dark" /></Col>
          <Col md={3}><DashboardCard title="Pending" value={reports.pendingArtworks} icon="⏳" color="danger" /></Col>
        </Row>

        <Card className="card-premium border-0 bg-white shadow-sm overflow-hidden">
          <Tabs defaultActiveKey="users" className="admin-tabs border-0 bg-light p-2">
            <Tab eventKey="users" title="USER MANAGEMENT" className="p-3">
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead>
                    <tr className="text-muted small uppercase fw-bold border-bottom">
                      <th className="py-3">Member</th>
                      <th>Email</th>
                      <th>Access Role</th>
                      <th>Status</th>
                      <th className="text-end">Command</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td className="fw-bold">{u.name}</td>
                        <td className="text-muted small">{u.email}</td>
                        <td>
                          <Form.Select size="sm" value={u.role} className="bg-light border-0 small fw-bold" style={{ width: '130px' }}
                            onChange={e => handleAssignRole(u.id, e.target.value)}>
                            {['VISITOR','ARTIST','CURATOR','ADMIN'].map(r => <option key={r} value={r}>{r}</option>)}
                          </Form.Select>
                        </td>
                        <td>
                          <Badge bg={u.status === 'ACTIVE' ? 'dark' : 'danger'} className="px-2">{u.status}</Badge>
                        </td>
                        <td className="text-end">
                          <div className="d-flex gap-2 justify-content-end">
                            {u.status === 'PENDING' && <Button size="sm" variant="dark" onClick={() => handleApproveUser(u.id)}>Approve</Button>}
                            {u.status !== 'BLOCKED' && <Button size="sm" variant="outline-danger" onClick={() => handleBlockUser(u.id)}>Block</Button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Tab>

            <Tab eventKey="artworks" title="GALLERY CURATION" className="p-3">
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead>
                    <tr className="text-muted small uppercase fw-bold border-bottom">
                      <th className="py-3">Cover</th>
                      <th>Title</th>
                      <th>Artist</th>
                      <th>Value</th>
                      <th>Status</th>
                      <th className="text-end">Command</th>
                    </tr>
                  </thead>
                  <tbody>
                    {artworks.map(a => (
                      <tr key={a.id}>
                        <td>
                          <div className="rounded-2 overflow-hidden" style={{ width: '40px', height: '40px' }}>
                            {a.imageUrl ? <img src={`http://localhost:8080${a.imageUrl}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🖼️'}
                          </div>
                        </td>
                        <td className="fw-bold">{a.title}</td>
                        <td className="text-muted small">{a.artistName}</td>
                        <td className="fw-bold">₹{Number(a.price).toLocaleString()}</td>
                        <td><Badge bg={a.status === 'APPROVED' ? 'dark' : 'warning'}>{a.status}</Badge></td>
                        <td className="text-end">
                          <div className="d-flex gap-2 justify-content-end">
                             <Button size="sm" variant="dark" onClick={() => handleApproveArtwork(a.id)}>Approve</Button>
                             <Button size="sm" variant="outline-danger" onClick={() => handleDeleteArtwork(a.id)}>Delete</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Tab>
          </Tabs>
        </Card>

        {/* Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
          <Modal.Header closeButton className="border-0 pb-0"><Modal.Title className="fw-800">ADD SYSTEM ARTWORK</Modal.Title></Modal.Header>
          <Form onSubmit={handleAddArtwork}>
            <Modal.Body className="p-4">
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group><Form.Label className="small fw-bold text-muted uppercase">Title</Form.Label>
                    <Form.Control required className="bg-light border-0 py-2" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group><Form.Label className="small fw-bold text-muted uppercase">Artist</Form.Label>
                    <Form.Select required className="bg-light border-0 py-2" value={form.artistId} onChange={e => setForm(f => ({ ...f, artistId: e.target.value }))}>
                      <option value="">Select artist...</option>
                      {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </Form.Select></Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group><Form.Label className="small fw-bold text-muted uppercase">Price (₹)</Form.Label>
                    <Form.Control required type="number" className="bg-light border-0 py-2" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></Form.Group>
                </Col>
                <Col md={6}>
                   <Form.Group><Form.Label className="small fw-bold text-muted uppercase">Category</Form.Label>
                    <Form.Select required className="bg-light border-0 py-2" value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
                      <option value="">Select category...</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </Form.Select></Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group><Form.Label className="small fw-bold text-muted uppercase">Artwork Image</Form.Label>
                    <Form.Control type="file" className="bg-light border-0" accept="image/*" onChange={e => setImageFile(e.target.files[0])} /></Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer className="border-0 pt-0">
               <Button variant="link" className="text-muted text-decoration-none fw-bold" onClick={() => setShowModal(false)}>CANCEL</Button>
               <Button className="btn-premium btn-premium-primary px-4 py-2" type="submit" disabled={saving}>{saving ? 'PROCESSING...' : 'SAVE ARTWORK'}</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
};

export default AdminDashboard;
