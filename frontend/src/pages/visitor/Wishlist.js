import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Spinner, Badge } from 'react-bootstrap';
import { getWishlist, removeFromWishlist } from '../../services/api';
import ArtworkCard from '../../components/ArtworkCard';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getWishlist().then(r => setItems(r.data)).finally(() => setLoading(false));
  }, []);

  const handleRemove = async id => {
    await removeFromWishlist(id);
    setItems(i => i.filter(x => x.id !== id));
    toast.success('Removed from wishlist');
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="danger" /></div>;

  return (
    <div className="fade-in" style={{ background: 'var(--bg-gray)', minHeight: '100vh' }}>
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h1 className="fw-800 mb-0">MY <span className="text-accent">WISHLIST</span></h1>
        <Badge bg="dark" className="px-3 py-2 rounded-pill">{items.length} SAVED</Badge>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm">
          <div style={{ fontSize: '4rem', opacity: 0.2 }}>❤️</div>
          <h4 className="fw-bold mt-4">No favorites yet</h4>
          <p className="text-muted mb-4">Start your journey and save the pieces that speak to you.</p>
          <Button className="btn-premium btn-premium-primary" onClick={() => navigate('/artworks')}>Discover Works</Button>
        </div>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {items.map(item => (
            <Col key={item.id}>
              <div className="position-relative h-100">
                <ArtworkCard artwork={item} />
                <Button
                  size="sm"
                  className="rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                  style={{ position: 'absolute', top: '12px', right: '12px', width: '32px', height: '32px', zIndex: 10, background: 'rgba(255,255,255,0.8)', border: 'none', color: 'var(--accent)' }}
                  onClick={(e) => { e.stopPropagation(); handleRemove(item.id); }}
                >✕</Button>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </Container>
    </div>
  );
};

export default Wishlist;
