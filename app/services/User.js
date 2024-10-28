import axios from 'axios';

// Configuração base do axios
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Interceptor para adicionar o token em todas as requisições
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post('/users/sign_in', {
      user: credentials
    });
    const { token } = response.data;
    localStorage.setItem('token', token);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erro ao fazer login' };
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post('/users', {
      user: userData
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erro ao registrar usuário' };
  }
};