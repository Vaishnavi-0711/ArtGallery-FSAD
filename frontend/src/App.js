import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppNavbar from './components/Navbar';
import ChatBox from './components/ChatBox';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ArtworkListing from './pages/ArtworkListing';
import ArtworkDetail from './pages/ArtworkDetail';
import Exhibitions from './pages/Exhibitions';
import ExhibitionDetail from './pages/ExhibitionDetail';
import Profile from './pages/Profile';

import AdminDashboard from './pages/admin/AdminDashboard';
import ArtistDashboard from './pages/artist/ArtistDashboard';
import CuratorDashboard from './pages/curator/CuratorDashboard';

import Cart from './pages/visitor/Cart';
import Wishlist from './pages/visitor/Wishlist';
import Orders from './pages/visitor/Orders';

const Layout = ({ children }) => (
  <>
    <AppNavbar />
    {children}
    <ChatBox />
  </>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/artworks" element={<Layout><ArtworkListing /></Layout>} />
          <Route path="/artworks/:id" element={<Layout><ArtworkDetail /></Layout>} />
          <Route path="/exhibitions" element={<Layout><Exhibitions /></Layout>} />
          <Route path="/exhibitions/:id" element={<Layout><ExhibitionDetail /></Layout>} />

          {/* Protected — All roles */}
          <Route path="/profile" element={<Layout><ProtectedRoute><Profile /></ProtectedRoute></Layout>} />

          {/* Admin */}
          <Route path="/admin" element={
            <Layout><ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute></Layout>
          } />

          {/* Artist */}
          <Route path="/artist" element={
            <Layout><ProtectedRoute roles={['ARTIST']}><ArtistDashboard /></ProtectedRoute></Layout>
          } />

          {/* Curator */}
          <Route path="/curator" element={
            <Layout><ProtectedRoute roles={['CURATOR']}><CuratorDashboard /></ProtectedRoute></Layout>
          } />

          {/* Visitor */}
          <Route path="/cart" element={
            <Layout><ProtectedRoute roles={['VISITOR']}><Cart /></ProtectedRoute></Layout>
          } />
          <Route path="/wishlist" element={
            <Layout><ProtectedRoute roles={['VISITOR']}><Wishlist /></ProtectedRoute></Layout>
          } />
          <Route path="/orders" element={
            <Layout><ProtectedRoute roles={['VISITOR']}><Orders /></ProtectedRoute></Layout>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
