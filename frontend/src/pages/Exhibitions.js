import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getExhibitions } from '../services/api';

const Exhibitions = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getExhibitions().then(r => setExhibitions(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="danger" /></div>;

  return (
    <div className="fade-in" style={{ background: 'var(--bg-gray)', minHeight: '100vh' }}>
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h1 className="fw-800 mb-0">ACTIVE <span className="text-accent">EXHIBITIONS</span></h1>
        <Badge bg="dark" className="px-3 py-2 rounded-pill uppercase">Current Shows</Badge>
      </div>

      {exhibitions.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm">
          <div style={{ fontSize: '4rem', opacity: 0.2 }}>🏛️</div>
          <h4 className="fw-bold mt-4">Doors are currently closed</h4>
          <p className="text-muted">Check back soon for our next curated thematic journey.</p>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {exhibitions.map(ex => (
            <Col key={ex.id}>
              <Card className="card-premium h-100 border-0" 
                    onClick={() => navigate(`/exhibitions/${ex.id}`)} style={{ cursor: 'pointer' }}>
                <div style={{ height: '220px', overflow: 'hidden', background: '#f8f9fa' }}>
                  {ex.artworks && ex.artworks.length > 0 && ex.artworks[0].imageUrl ? (
                    <Card.Img
                      variant="top"
                      src={`http://localhost:8080${ex.artworks[0].imageUrl}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition)' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  ) : (
                    <div style={{ height: '100%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                      <span className="text-white opacity-20 fw-800 fs-1">EXHIBITION</span>
                    </div>
                  )}
                </div>
                <Card.Body className="p-4">
                  {ex.theme && <Badge bg="accent" className="mb-3 px-3 py-2" style={{ background: 'var(--accent)' }}>{ex.theme}</Badge>}
                  <Card.Title className="fw-bold h4 mb-3">{ex.title}</Card.Title>
                  <Card.Text className="text-muted small mb-4">{ex.description?.substring(0, 120)}...</Card.Text>
                  <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top border-light">
                    <small className="text-muted fw-bold">By {ex.curatorName}</small>
                    <Badge bg="light" text="dark" className="border">{ex.artworks?.length || 0} works</Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
    </div>
  );
};

export default Exhibitions;
