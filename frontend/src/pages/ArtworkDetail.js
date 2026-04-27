import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Badge, Button, Form, Card, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getArtwork, getReviews, addReview, addToCart, addToWishlist } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ArtworkDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getArtwork(id), getReviews(id)]).then(([a, r]) => {
      setArtwork(a.data);
      setReviews(r.data);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleCart = async () => {
    if (!user) return navigate('/login');
    try { await addToCart(id); toast.success('Added to cart!'); }
    catch { toast.error('Already in cart'); }
  };

  const handleWishlist = async () => {
    if (!user) return navigate('/login');
    try { await addToWishlist(id); toast.success('Added to wishlist!'); }
    catch { toast.error('Error adding to wishlist'); }
  };

  const handleReview = async e => {
    e.preventDefault();
    if (!user) return navigate('/login');
    try {
      const { data } = await addReview({ artworkId: Number(id), ...review });
      setReviews(r => [data, ...r.filter(x => x.id !== data.id)]);
      toast.success('Review submitted!');
      setReview({ rating: 5, comment: '' });
    } catch { toast.error('Error submitting review'); }
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="danger" /></div>;
  if (!artwork) return <div className="text-center py-5">Artwork not found</div>;

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="fade-in" style={{ background: 'var(--bg-gray)', minHeight: '100vh' }}>
    <Container className="py-5">
      <Row className="g-5">
        <Col lg={7}>
          <div className="card-premium p-2 bg-white sticky-top" style={{ top: '100px' }}>
            <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#fff' }}
                 className="d-flex align-items-center justify-content-center">
              {artwork.imageUrl ? (
                <img src={`http://localhost:8080${artwork.imageUrl}`} alt={artwork.title}
                     className="img-fluid" style={{ maxHeight: '600px', width: 'auto', objectFit: 'contain' }} />
              ) : (
                <div style={{ fontSize: '8rem', opacity: 0.1 }} className="py-5">🖼️</div>
              )}
            </div>
          </div>
        </Col>
        <Col lg={5}>
          <div className="d-flex gap-2 mb-4">
            {artwork.categoryName && <Badge bg="dark" className="px-3 py-2">{artwork.categoryName}</Badge>}
            <Badge bg={artwork.status === 'APPROVED' ? 'success' : 'warning'} className="px-3 py-2">{artwork.status}</Badge>
          </div>
          
          <h1 className="display-5 fw-800 mb-2">{artwork.title}</h1>
          <p className="fs-5 text-muted mb-4">by <span className="text-dark fw-bold">{artwork.artistName}</span></p>
          
          {avgRating && (
            <div className="d-flex align-items-center gap-2 mb-4">
              <div className="text-warning fs-4">
                {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
              </div>
              <span className="fw-bold fs-5">{avgRating}</span>
              <span className="text-muted small">({reviews.length} reviews)</span>
            </div>
          )}
          
          <h2 className="display-4 fw-900 text-accent mb-4">₹{Number(artwork.price).toLocaleString()}</h2>
          
          <div className="mb-5 pb-5 border-bottom">
            <h6 className="fw-800 text-muted uppercase small mb-3">Description</h6>
            <p className="lead text-dark lh-base" style={{ fontSize: '1.1rem' }}>{artwork.description}</p>
          </div>

          {artwork.culturalHistory && (
            <Card className="card-premium mb-5 border-0 bg-white">
              <Card.Body className="p-4">
                <h6 className="fw-800 mb-3"><span role="img" aria-label="history">📜</span> CULTURAL HISTORY</h6>
                <p className="mb-0 text-muted lh-lg" style={{ fontSize: '0.95rem' }}>{artwork.culturalHistory}</p>
              </Card.Body>
            </Card>
          )}

          {user?.role === 'VISITOR' && (
            <div className="d-flex gap-3 position-sticky bg-white p-3 rounded-4 shadow-sm border" style={{ bottom: '20px', zIndex: 100 }}>
              <Button onClick={handleCart} className="btn-premium btn-premium-primary flex-grow-1 py-3">Add to Cart</Button>
              <Button variant="outline-danger" onClick={handleWishlist} className="btn-premium p-3 border-dark d-flex align-items-center justify-content-center" style={{ width: '60px' }}>❤️</Button>
            </div>
          )}
          
          {!user && (
            <Button className="btn-premium btn-premium-primary w-100 py-3 mt-4" onClick={() => navigate('/login')}>
              Sign in to Purchase
            </Button>
          )}

          {/* Social Proof */}
          <div className="mt-5 p-4 bg-light rounded-4 border-dashed border-2 text-center text-muted small">
            ✨ Only one original piece available. Includes Certificate of Authenticity.
          </div>
        </Col>
      </Row>

      {/* Reviews Section */}
      <Row className="mt-5 pt-5">
        <Col lg={7}>
          <div className="d-flex justify-content-between align-items-center mb-5">
            <h3 className="fw-800 mb-0">REVIEWS <span className="text-muted opacity-50">({reviews.length})</span></h3>
            {user?.role === 'VISITOR' && (
               <Badge bg="dark" className="px-3 py-2 pointer" style={{ cursor: 'pointer' }} onClick={() => document.getElementById('review-form').scrollIntoView()}>SHARE FEEDBACK</Badge>
            )}
          </div>
          
          {reviews.length === 0 ? (
            <div className="py-5 text-center bg-white rounded-4 border">
              <p className="text-muted mb-0">No reviews yet. Be the first to collector to share your thoughts.</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-4">
              {reviews.map(r => (
                <Card key={r.id} className="card-premium border-0 bg-white shadow-sm">
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <div className="fw-800 mb-1">{r.userName.toUpperCase()}</div>
                        <small className="text-muted">{new Date(r.createdAt).toLocaleDateString()}</small>
                      </div>
                      <div className="text-warning">
                        {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                      </div>
                    </div>
                    <p className="mb-0 text-dark lh-lg" style={{ fontSize: '1rem' }}>{r.comment}</p>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Col>
        
        <Col lg={5} id="review-form">
          {user?.role === 'VISITOR' && (
            <Card className="card-premium border-0 bg-white shadow-md sticky-top" style={{ top: '100px' }}>
              <Card.Body className="p-4">
                <h5 className="fw-800 mb-4 text-center">WRITE A REVIEW</h5>
                <Form onSubmit={handleReview}>
                  <Form.Group className="mb-4">
                    <Form.Label className="small fw-bold text-muted">RATING</Form.Label>
                    <Form.Select className="bg-light border-0 py-2" value={review.rating} onChange={e => setReview(r => ({ ...r, rating: Number(e.target.value) }))}>
                      {[5,4,3,2,1].map(n => <option key={n} value={n}>{'★'.repeat(n)} — {n} Star{n > 1 ? 's' : ''}</option>)}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label className="small fw-bold text-muted">YOUR COMMENTS</Form.Label>
                    <Form.Control as="textarea" rows={4} className="bg-light border-0" placeholder="Describe your experience with this artwork..."
                      value={review.comment} onChange={e => setReview(r => ({ ...r, comment: e.target.value }))} />
                  </Form.Group>
                  <Button type="submit" className="btn-premium btn-premium-primary w-100 py-3">SUBMIT REVIEW</Button>
                </Form>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default ArtworkDetail;
