import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'farmer' | 'landowner';
}

interface LoginData {
  email: string;
  password: string;
}

export const register = async (data: RegisterData) => {
  const response = await axios.post(`${API_URL}/register`, data);
  return response.data;
};

export const login = async (data: LoginData) => {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data;
};
