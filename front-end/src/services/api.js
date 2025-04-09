import axios from 'axios';

const API_URL = 'http://localhost:3007/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Auth APIs
export const authAPI = {
    register: (userData) => api.post('/users/register', userData),
    login: (credentials) => api.post('/users/login', credentials),
    getCurrentUser: () => api.get('/users/current', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
};

// Contact APIs
export const contactAPI = {
    getContacts: () => api.get('/contacts', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }),
    createContact: (contactData) => api.post('/contacts', contactData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }),
    updateContact: (id, contactData) => api.put(`/contacts/${id}`, contactData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }),
    deleteContact: (id) => api.delete(`/contacts/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
};

// Product APIs
export const productService = {
    getAll() {
        return api.get('/products');
    },
    get(id) {
        return api.get(`/products/${id}`);
    },
    create(data) {
        return api.post('/products', data);
    },
    update(id, data) {
        return api.put(`/products/${id}`, data);
    },
    delete(id) {
        return api.delete(`/products/${id}`);
    }
};

// Thêm vào phần API
export const cartAPI = {
    getCart: () => api.get('/cart', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }),
    addToCart: (data) => api.post('/cart', data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }),
    updateCartItem: (data) => api.put('/cart', data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }),
    removeFromCart: (productId) => api.delete(`/cart/${productId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }),
    clearCart: () => api.delete('/cart', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
};
