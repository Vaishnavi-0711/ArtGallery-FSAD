import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, Pagination, Spinner, Badge } from 'react-bootstrap';
import { getArtworks } from '../services/api';
import ArtworkCard from '../components/ArtworkCard';
import FilterSidebar from '../components/FilterSidebar';

const ArtworkListing = () => {
  const [artworks, setArtworks] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchArtworks = useCallback(async (f = filters, p = page) => {
    setLoading(true);
    try {
      const params = { ...f, page: p };
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const { data } = await getArtworks(params);
      setArtworks(data.content || []);
      setTotalPages(data.totalPages || 0);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchArtworks(); }, [page, fetchArtworks]);

  const handleFilter = (f) => {
    setFilters(f);
    setPage(0);
    fetchArtworks(f, 0);
  };

  return (
    <div className="fade-in" style={{ background: 'var(--bg-gray)', minHeight: '100vh' }}>
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h1 className="fw-800 display-5 mb-1 uppercase">THE <span className="text-accent">GALLERY</span></h1>
          <p className="text-muted small fw-bold uppercase letter-spacing-1">DISCOVER UNIQUE PERSPECTIVES FROM ACROSS THE GLOBE</p>
        </div>
        <Badge bg="dark" className="px-3 py-2 rounded-pill shadow-sm">{artworks.length} PIECES DISCOVERED</Badge>
      </div>

      <Row className="g-4">
        <Col lg={3}>
           <div className="sticky-top" style={{ top: '100px' }}>
             <FilterSidebar onFilter={handleFilter} />
           </div>
        </Col>
        <Col lg={9}>
          {loading ? (
            <div className="text-center py-5"><Spinner animation="border" variant="danger" /></div>
          ) : artworks.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-4 border shadow-sm">
              <div style={{ fontSize: '3rem', opacity: 0.2 }} className="mb-3">🖼️</div>
              <h5 className="fw-bold">No artworks match your criteria</h5>
              <p className="text-muted mb-0">Try adjusting your filters to explore our other pieces.</p>
            </div>
          ) : (
            <>
              <Row xs={1} md={2} lg={3} className="g-4">
                {artworks.map(a => <Col key={a.id}><ArtworkCard artwork={a} /></Col>)}
              </Row>
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-5">
                  <Pagination className="pagination-premium">
                    <Pagination.Prev disabled={page === 0} onClick={() => setPage(p => p - 1)} />
                    {[...Array(totalPages)].map((_, i) => (
                      <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>{i + 1}</Pagination.Item>
                    ))}
                    <Pagination.Next disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)} />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default ArtworkListing;
