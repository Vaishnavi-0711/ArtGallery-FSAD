import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8080/api' });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const register = data => API.post('/auth/register', data);
export const login = data => API.post('/auth/login', data);

// Artworks
export const getArtworks = params => API.get('/artworks', { params });
export const getArtwork = id => API.get(`/artworks/${id}`);
export const getCategories = () => API.get('/categories');

// Artist
export const createArtwork = formData => API.post('/artist/artworks', formData);
export const updateArtwork = (id, formData) => API.put(`/artist/artworks/${id}`, formData);
export const deleteArtwork = id => API.delete(`/artist/artworks/${id}`);
export const getMyArtworks = () => API.get('/artist/artworks');

// Admin
export const getUsers = () => API.get('/admin/users');
export const approveUser = id => API.put(`/admin/approve-user/${id}`);
export const blockUser = id => API.delete(`/admin/block-user/${id}`);
export const assignRole = (id, role) => API.put(`/admin/assign-role/${id}`, null, { params: { role } });
export const getAdminArtworks = page => API.get('/admin/artworks', { params: { page } });
export const approveArtwork = id => API.put(`/admin/approve-artwork/${id}`);
export const rejectArtwork = id => API.put(`/admin/reject-artwork/${id}`);
export const createAdminArtwork = formData => API.post('/admin/artworks', formData);
export const deleteAdminArtwork = id => API.delete(`/admin/artworks/${id}`);
export const getReports = () => API.get('/admin/reports');

// Curator
export const createExhibition = data => API.post('/curator/exhibitions', data);
export const getMyExhibitions = () => API.get('/curator/exhibitions');
export const updateExhibition = (id, data) => API.put(`/curator/exhibitions/${id}`, data);
export const deleteExhibition = id => API.delete(`/curator/exhibitions/${id}`);
export const addArtworkToExhibition = (exId, artId) => API.post(`/curator/exhibitions/${exId}/artworks/${artId}`);
export const removeArtworkFromExhibition = (exId, artId) => API.delete(`/curator/exhibitions/${exId}/artworks/${artId}`);

// Visitor
export const getCart = () => API.get('/cart');
export const addToCart = id => API.post(`/cart/${id}`);
export const removeFromCart = id => API.delete(`/cart/${id}`);
export const checkout = () => API.post('/orders/checkout');
export const getOrders = () => API.get('/orders');
export const getWishlist = () => API.get('/wishlist');
export const addToWishlist = id => API.post(`/wishlist/${id}`);
export const removeFromWishlist = id => API.delete(`/wishlist/${id}`);
export const addReview = data => API.post('/reviews', data);
export const getReviews = artworkId => API.get(`/reviews/${artworkId}`);

// Profile
export const getProfile = () => API.get('/profile');
export const updateProfile = data => API.put('/profile', data);

// Exhibitions (public)
export const getExhibitions = () => API.get('/exhibitions');
export const getExhibition = id => API.get(`/exhibitions/${id}`);

export default API;
