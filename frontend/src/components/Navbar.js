import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  const roleLinks = {
    ADMIN: [{ to: '/admin', label: 'Admin Dashboard' }],
    ARTIST: [{ to: '/artist', label: 'Artist Studio' }],
    CURATOR: [{ to: '/curator', label: 'Curator Panel' }],
    VISITOR: [],
  };

  return (
    <Navbar className="navbar-glass" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ fontSize: '1.3rem', color: 'var(--primary)' }}>
          ART<span style={{ color: 'var(--accent)' }}>GALLERY</span>
        </Navbar.Brand>
        <Navbar.Toggle className="border-0 shadow-none" />
        <Navbar.Collapse>
          <Nav className="me-auto ms-lg-5">
            <Nav.Link as={Link} to="/artworks" className="fw-600">Browse</Nav.Link>
            <Nav.Link as={Link} to="/exhibitions" className="fw-600">Exhibitions</Nav.Link>
            {user && roleLinks[user.role]?.map(l => (
              <Nav.Link key={l.to} as={Link} to={l.to} className="fw-600 text-accent">{l.label}</Nav.Link>
            ))}
          </Nav>
          <Nav className="align-items-center gap-2">
            {user ? (
               <div className="d-flex align-items-center gap-1">
                {user.role === 'VISITOR' && (
                  <>
                    <Nav.Link as={Link} to="/cart" title="Cart" className="px-3">🛒</Nav.Link>
                    <Nav.Link as={Link} to="/wishlist" title="Wishlist" className="px-3">❤️</Nav.Link>
                    <Nav.Link as={Link} to="/orders" title="My Orders" className="px-3">📦</Nav.Link>
                  </>
                )}
                <NavDropdown title={<span className="fw-bold">👤 {user.name}</span>} id="user-dropdown" align="end">
                  <NavDropdown.Item as={Link} to="/profile">My Profile</NavDropdown.Item>
                  {user.role === 'VISITOR' && (
                    <>
                      <NavDropdown.Item as={Link} to="/orders">Order History</NavDropdown.Item>
                      <NavDropdown.Divider />
                    </>
                  )}
                  <NavDropdown.Item onClick={handleLogout} className="text-danger fw-bold">Logout</NavDropdown.Item>
                </NavDropdown>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Button variant="link" className="text-dark text-decoration-none fw-bold" onClick={() => navigate('/login')}>LOGIN</Button>
                <Button className="btn-premium btn-premium-primary" onClick={() => navigate('/register')}>JOIN FREE</Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
