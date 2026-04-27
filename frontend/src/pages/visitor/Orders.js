import React, { useEffect, useState } from 'react';
import { Container, Badge, Spinner, Accordion, Card } from 'react-bootstrap';
import { getOrders } from '../../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders().then(r => setOrders(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="danger" /></div>;

  return (
    <div className="fade-in" style={{ background: 'var(--bg-gray)', minHeight: '100vh' }}>
    <Container className="py-5" style={{ maxWidth: '900px' }}>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h1 className="fw-800 mb-0">ORDER <span className="text-accent">HISTORY</span></h1>
        <Badge bg="dark" className="px-3 py-2 rounded-pill">{orders.length} ORDERS</Badge>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm">
          <div style={{ fontSize: '4rem', opacity: 0.2 }}>📦</div>
          <h4 className="fw-bold mt-4">No records found</h4>
          <p className="text-muted">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <Accordion className="order-accordion">
          {orders.map((order, i) => (
            <Card key={order.id} className="card-premium mb-3 border-0 overflow-hidden">
               <Accordion.Item eventKey={String(i)} className="border-0">
                <Accordion.Header className="order-accordion-header">
                  <div className="d-flex justify-content-between w-100 me-3 align-items-center">
                    <div>
                      <span className="fw-bold">ORD-00{order.id}</span>
                      <small className="text-muted ms-3">{new Date(order.createdAt).toLocaleDateString()}</small>
                    </div>
                    <div className="d-flex gap-3 align-items-center">
                      <Badge bg={order.status === 'COMPLETED' ? 'dark' : 'secondary'} className="px-3">{order.status}</Badge>
                      <strong className="text-accent fs-5">₹{Number(order.totalPrice).toLocaleString()}</strong>
                    </div>
                  </div>
                </Accordion.Header>
                <Accordion.Body className="bg-white">
                  {order.items?.map(item => (
                    <div key={item.artworkId} className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom border-light">
                      <div className="rounded-2 overflow-hidden" style={{ width: '60px', height: '60px' }}>
                        {item.imageUrl
                          ? <img src={`http://localhost:8080${item.imageUrl}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div className="h-100 bg-light d-flex align-items-center justify-content-center">🖼️</div>}
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-bold small mb-1 uppercase">{item.artworkTitle}</div>
                        <small className="text-muted">Item ID: {item.artworkId}</small>
                      </div>
                      <div className="fw-bold text-accent">₹{Number(item.price).toLocaleString()}</div>
                    </div>
                  ))}
                  <div className="pt-2 text-end">
                    <span className="text-muted small me-2">Grand Total</span>
                    <span className="fw-900 fs-4 text-accent">₹{Number(order.totalPrice).toLocaleString()}</span>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Card>
          ))}
        </Accordion>
      )}
    </Container>
    </div>
  );
};

export default Orders;
