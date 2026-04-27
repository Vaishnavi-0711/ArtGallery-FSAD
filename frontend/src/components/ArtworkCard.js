import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const ArtworkCard = ({ artwork }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCart = async (e) => {
    e.stopPropagation();
    if (!user) return navigate('/login');
    try { await addToCart(artwork.id); toast.success('Added to cart!'); }
    catch { toast.error('Error adding to cart'); }
  };

  return (
    <Card className="card-premium h-100" onClick={() => navigate(`/artworks/${artwork.id}`)} style={{ cursor: 'pointer' }}>
      <div style={{ height: '240px', overflow: 'hidden' }}>
        {artwork.imageUrl ? (
          <Card.Img variant="top" src={`http://localhost:8080${artwork.imageUrl}`} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition)' }} 
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
        ) : (
          <div className="d-flex align-items-center justify-content-center h-100 bg-light text-muted fs-1 opacity-20">🖼️</div>
        )}
      </div>
      <Card.Body className="p-3 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <Card.Title className="fs-6 fw-bold mb-0 text-truncate" style={{ maxWidth: '75%' }}>{artwork.title}</Card.Title>
          <div className="fw-bold text-accent">₹{Number(artwork.price).toLocaleString()}</div>
        </div>
        <Card.Text className="text-muted small mb-3">by {artwork.artistName}</Card.Text>
        
        {user?.role === 'VISITOR' && (
          <div className="mt-auto pt-2 border-top">
            <Button onClick={handleCart} className="btn-premium btn-premium-primary w-100 py-1" style={{ fontSize: '0.75rem' }}>+ ADD TO CART</Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ArtworkCard;
