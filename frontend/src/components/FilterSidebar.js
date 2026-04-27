import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { getCategories } from '../services/api';

const FilterSidebar = ({ onFilter }) => {
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ title: '', categoryId: '', minPrice: '', maxPrice: '', sort: 'newest' });

  useEffect(() => {
    getCategories().then(r => setCategories(r.data));
  }, []);

  const handleChange = e => setFilters(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    const reset = { title: '', categoryId: '', minPrice: '', maxPrice: '', sort: 'newest' };
    setFilters(reset);
    onFilter(reset);
  };

  return (
    <Card className="p-3 shadow-sm">
      <h6 className="fw-bold mb-3">🔍 Search & Filter</h6>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            placeholder="Search by title..."
            name="title"
            value={filters.title}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Select name="categoryId" value={filters.categoryId} onChange={handleChange}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="number" placeholder="Min Price" name="minPrice" value={filters.minPrice} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control type="number" placeholder="Max Price" name="maxPrice" value={filters.maxPrice} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Select name="sort" value={filters.sort} onChange={handleChange}>
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </Form.Select>
        </Form.Group>
        <div className="d-grid gap-2">
          <Button type="submit" variant="dark" size="sm">Apply Filters</Button>
          <Button type="button" variant="outline-secondary" size="sm" onClick={handleReset}>Reset</Button>
        </div>
      </Form>
    </Card>
  );
};

export default FilterSidebar;
