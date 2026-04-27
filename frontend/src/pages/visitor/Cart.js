import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Form, Badge } from 'react-bootstrap';
import { getCart, removeFromCart, checkout } from '../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCart().then(r => setItems(r.data)).finally(() => setLoading(false));
  }, []);

  const handleRemove = async id => {
    await removeFromCart(id);
    setItems(i => i.filter(x => x.id !== id));
    toast.success('Removed from cart');
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      await checkout();
      toast.success('Order placed successfully! 🎉');
      setItems([]);
      navigate('/orders');
    } catch { toast.error('Checkout failed'); }
    finally { setCheckingOut(false); }
  };

  const total = items.reduce((s, i) => s + Number(i.price), 0);

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="danger" /></div>;

  return (
    <div className="fade-in" style={{ background: 'var(--bg-gray)', minHeight: '100vh' }}>
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h1 className="fw-800 mb-0">SHOPPING <span className="text-accent">CART</span></h1>
        <Badge bg="dark" className="px-3 py-2 rounded-pill">{items.length} ITEMS</Badge>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm">
          <div style={{ fontSize: '4rem', opacity: 0.2 }}>🛒</div>
          <h4 className="fw-bold mt-4">Your bag is empty</h4>
          <p className="text-muted">Explore our curated collections and find your next masterpiece.</p>
          <Button className="btn-premium btn-premium-primary" onClick={() => navigate('/artworks')}>Browse Collections</Button>
        </div>
      ) : (
        <Row className="g-4">
          <Col lg={8}>
            {items.map(item => (
              <Card key={item.id} className="card-premium mb-3 border-0">
                <Card.Body className="p-3">
                  <Row className="align-items-center">
                    <Col xs={3} md={2}>
                      <div className="rounded-3 overflow-hidden" style={{ height: '80px' }}>
                        {item.imageUrl
                          ? <img src={`http://localhost:8080${item.imageUrl}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div className="h-100 bg-light d-flex align-items-center justify-content-center">🖼️</div>}
                      </div>
                    </Col>
                    <Col xs={6} md={7}>
                      <h6 className="fw-bold mb-1">{item.title}</h6>
                      <p className="text-muted small mb-0">by {item.artistName}</p>
                    </Col>
                    <Col xs={3} md={3} className="text-end">
                      <div className="fw-800 text-accent fs-5">₹{Number(item.price).toLocaleString()}</div>
                      <Button variant="link" className="text-muted p-0 small fw-bold" onClick={() => handleRemove(item.id)}>Remove</Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </Col>
          <Col lg={4}>
            <div className="sticky-top" style={{ top: '80px' }}>
              <Card className="card-premium border-0 mb-4 bg-white">
                <Card.Body className="p-4">
                  <h5 className="fw-800 mb-4">SECURE PAY</h5>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-muted">CARD NUMBER</Form.Label>
                    <Form.Control type="text" placeholder="XXXX XXXX XXXX XXXX" defaultValue="4242 4242 4242 4242" className="bg-light" />
                  </Form.Group>
                  <Row>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold text-muted">EXPIRY</Form.Label>
                        <Form.Control type="text" placeholder="12/26" defaultValue="12/26" className="bg-light" />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold text-muted">CVC</Form.Label>
                        <Form.Control type="text" placeholder="123" defaultValue="123" className="bg-light" />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              
              <Card className="card-premium border-0 bg-white">
                <Card.Body className="p-4">
                  <h5 className="fw-800 mb-4">SUMMARY</h5>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotal</span>
                    <span className="fw-bold">₹{total.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Tax & Shipping</span>
                    <span className="fw-bold">₹0.00</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-900 fs-4 mb-4">
                    <span>Total</span>
                    <span className="text-accent">₹{total.toLocaleString()}</span>
                  </div>
                  <Button className="btn-premium btn-premium-primary w-100 py-3" onClick={handleCheckout} disabled={checkingOut}>
                    {checkingOut ? 'AUTHENTICATING...' : 'CHECKOUT NOW'}
                  </Button>
                  <p className="text-center text-muted x-small mt-3 mb-0">SSL SECURE PAYMENT GATEWAY</p>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      )}
    </Container>
    </div>
  );
};

export default Cart;
