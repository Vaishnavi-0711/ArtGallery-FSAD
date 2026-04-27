import React from 'react';
import { Card } from 'react-bootstrap';

const palette = {
  primary:   { color: '#000000' },
  success:   { color: '#059669' },
  warning:   { color: '#D97706' },
  danger:    { color: '#DC2626' },
  info:      { color: '#2563EB' },
  secondary: { color: '#4B5563' },
};

const DashboardCard = ({ title, value, icon, color = 'primary' }) => {
  const p = palette[color] || palette.primary;
  return (
    <Card className="card-premium h-100 border-0 shadow-sm bg-white">
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span style={{ fontSize: '1.8rem' }}>{icon}</span>
          <span className="fw-bold fs-3" style={{ color: p.color }}>{value ?? 0}</span>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</div>
      </Card.Body>
    </Card>
  );
};

export default DashboardCard;
