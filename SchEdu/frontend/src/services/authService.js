// SchEdu/frontend/src/services/authService.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export async function login(email, password, role) {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
    role,
  });

  // Store token and role in localStorage
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('role', response.data.role);
  return response.data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
}

export function getToken() {
  return localStorage.getItem('token');
}

export function getRole() {
  return localStorage.getItem('role');
}
