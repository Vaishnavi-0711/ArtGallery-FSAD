import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Badge, Button, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getExhibition } from '../services/api';
import ArtworkCard from '../components/ArtworkCard';

const ExhibitionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exhibition, setExhibition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tourMode, setTourMode] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(0);

  useEffect(() => {
    getExhibition(id).then(r => setExhibition(r.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="danger" /></div>;
  if (!exhibition) return <div className="text-center py-5">Exhibition not found</div>;

  const artworks = exhibition.artworks || [];
  const rooms = [];
  for (let i = 0; i < artworks.length; i += 3) rooms.push(artworks.slice(i, i + 3));

  if (tourMode) {
    const room = rooms[currentRoom] || [];
    return (
      <div style={{ minHeight: '100vh', background: 'var(--primary)', color: 'white' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px 24px' }}
             className="d-flex justify-content-between align-items-center border-bottom border-secondary">
          <h5 className="mb-0 fw-800 uppercase letter-spacing-1">🏛️ {exhibition.title} <span className="text-muted ms-3 small">ROOM {currentRoom + 1} / {rooms.length}</span></h5>
          <Button variant="outline-light" className="btn-premium py-1 px-3" onClick={() => setTourMode(false)}>EXIT TOUR</Button>
        </div>
        <Container className="py-5">
          <div className="card-premium p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="text-center mb-5">
              <div className="mb-2 uppercase small fw-bold opacity-50 letter-spacing-2">GALLERY WALL</div>
              <div style={{ width: '100px', height: '4px', background: 'var(--accent)', margin: '0 auto', borderRadius: '2px' }} />
            </div>
            <Row className="justify-content-center g-5">
              {room.map(artwork => (
                <Col key={artwork.id} xs={12} md={4}>
                  <div className="card-premium p-2 bg-white" style={{ cursor: 'pointer', transition: 'var(--transition)' }} 
                       onClick={() => navigate(`/artworks/${artwork.id}`)}
                       onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px)'}
                       onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div className="rounded-2 overflow-hidden mb-3">
                      {artwork.imageUrl ? (
                        <img src={`http://localhost:8080${artwork.imageUrl}`} alt={artwork.title}
                             style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ height: '240px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🖼️</div>
                      )}
                    </div>
                    <div className="p-2 text-center">
                      <div className="fw-800 text-dark small mb-1 uppercase">{artwork.title}</div>
                      <div className="text-muted xx-small uppercase letter-spacing-1">{artwork.artistName}</div>
                      <div className="text-accent fw-900 mt-2">₹{Number(artwork.price).toLocaleString()}</div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
          <div className="d-flex justify-content-center gap-4 mt-5">
            <Button variant="outline-light" className="btn-premium" disabled={currentRoom === 0} onClick={() => setCurrentRoom(r => r - 1)}>
              PREVIOUS
            </Button>
            <Button variant="outline-light" className="btn-premium" disabled={currentRoom === rooms.length - 1} onClick={() => setCurrentRoom(r => r + 1)}>
              NEXT ROOM
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ background: 'var(--bg-gray)', minHeight: '100vh' }}>
    <Container className="py-5">
      <div className="card-premium border-0 overflow-hidden mb-5" style={{ background: 'var(--primary)', color: 'white' }}>
        <Row className="g-0 align-items-stretch">
          <Col lg={8} className="p-5">
            {exhibition.theme && <Badge bg="accent" className="mb-4 px-3 py-2" style={{ background: 'var(--accent)' }}>{exhibition.theme.toUpperCase()}</Badge>}
            <h1 className="display-4 fw-800 mb-3 uppercase letter-spacing-1">{exhibition.title}</h1>
            <p className="lead opacity-75 mb-4 lh-base" style={{ fontSize: '1.1rem' }}>{exhibition.description}</p>
            <div className="d-flex gap-4 align-items-center flex-wrap pt-4 border-top border-secondary">
              <div>
                <small className="text-muted d-block uppercase fw-bold mb-1">Curated By</small>
                <strong className="text-white uppercase letter-spacing-1">{exhibition.curatorName}</strong>
              </div>
              <div className="border-start border-secondary ps-4">
                <small className="text-muted d-block uppercase fw-bold mb-1">Inventory</small>
                <strong className="text-white">{artworks.length} PIECES</strong>
              </div>
              {artworks.length > 0 && (
                <Button className="ms-auto btn-premium btn-premium-primary border-primary" style={{ background: 'var(--accent)', borderColor: 'var(--accent)' }} onClick={() => setTourMode(true)}>
                  🚶 START VIRTUAL TOUR
                </Button>
              )}
            </div>
          </Col>
          <Col lg={4} className="d-none d-lg-block position-relative">
             <div style={{ background: 'linear-gradient(45deg, var(--primary), var(--accent))', height: '100%', width: '100%', opacity: 0.2 }} />
             <div className="position-absolute top-50 start-50 translate-middle text-white fw-900 fs-1 opacity-25 uppercase" style={{ transform: 'rotate(-90deg) translate(-50%, -50%)', whiteSpace: 'nowrap' }}>
               {exhibition.theme || 'EXHIBITION'}
             </div>
          </Col>
        </Row>
      </div>

      <div className="d-flex justify-content-between align-items-end mb-4">
        <h3 className="fw-800 mb-0 uppercase mb-2">WORKS ON <span className="text-accent">DISPLAY</span></h3>
      </div>
      
      {artworks.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4 border">
          <p className="text-muted mb-0">The curation is currently being finalized.</p>
        </div>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {artworks.map(a => <Col key={a.id}><ArtworkCard artwork={a} /></Col>)}
        </Row>
      )}
    </Container>
    </div>
  );
};

export default ExhibitionDetail;
