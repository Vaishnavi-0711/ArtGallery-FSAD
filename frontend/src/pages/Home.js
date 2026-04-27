import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { getArtworks } from '../services/api';
import ArtworkCard from '../components/ArtworkCard';

const Home = () => {
  const [artworks, setArtworks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getArtworks({ page: 0, sort: 'newest' }).then(r => setArtworks(r.data.content?.slice(0, 8) || []));
  }, []);

  return (
    <div className="fade-in">
      <section className="hero-section position-relative overflow-hidden" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={7}>
              <Badge bg="light" text="dark" className="border px-3 py-2 mb-4 fw-600 rounded-pill" style={{ letterSpacing: '0.1em' }}>COLLEGE PROJECT SHOWCASE 2024</Badge>
              <h1 className="display-2 fw-800 mb-4" style={{ lineHeight: '0.9', letterSpacing: '-0.06em' }}>
                WHERE ART <br />
                MEETS <span style={{ color: 'var(--accent)' }}>SOUL</span>.
              </h1>
              <p className="fs-5 text-muted mb-5 pe-lg-5" style={{ lineHeight: '1.6' }}>
                Experience a world-class selection of contemporary and digital art, 
                meticulously managed through our high-performance curation engine.
              </p>
              <div className="d-flex gap-3">
                <Button className="btn-premium btn-premium-primary px-5 py-3" onClick={() => navigate('/artworks')}>Discover Art</Button>
                <Button className="btn-premium px-5 py-3 border text-dark" onClick={() => navigate('/exhibitions')}>Exhibitions</Button>
              </div>
            </Col>
            <Col lg={5} className="d-none d-lg-block">
               <div className="position-relative">
                  <img src="https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=1000" 
                       alt="Gallery" className="img-fluid rounded-4 shadow-lg" />
                  <div className="position-absolute p-4 bg-white shadow-lg rounded-4" style={{ bottom: '-30px', right: '-30px', maxWidth: '240px' }}>
                     <p className="mb-0 fw-bold small">"Art is the only way to run away without leaving home."</p>
                     <small className="text-muted mt-2 d-block">— Twyla Tharp</small>
                  </div>
               </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="bg-gray py-5 border-top border-bottom">
        <Container>
          <Row className="text-center g-4">
            {[
              { l: '12K+', d: 'Authentic Artworks' },
              { l: '450+', d: 'Global Artists' },
              { l: '85+', d: 'Curated Shows' },
              { l: '100%', d: 'Verified Listings' }
            ].map((s, i) => (
              <Col key={i} md={3}>
                <div className="fs-2 fw-800 mb-1">{s.l}</div>
                <div className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>{s.d}</div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <div className="d-flex justify-content-between align-items-end mb-5">
            <h2 className="section-title mb-0">Featured Pieces</h2>
            <Link to="/artworks" className="text-dark fw-bold text-decoration-none small">BROWSE COLLECTION →</Link>
          </div>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {artworks.map(a => (
              <Col key={a.id}><ArtworkCard artwork={a} /></Col>
            ))}
          </Row>
        </Container>
      </section>

      <footer className="py-5 border-top">
        <Container>
          <Row className="justify-content-between align-items-center">
            <Col md={4}><h3 className="fs-4 mb-0">ART GALLERY • <span className="text-muted">PROJECT</span></h3></Col>
            <Col md={4} className="text-md-end text-muted small">© 2024 Final Year Case Study</Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default Home;
