import axios from "axios";

// Configuração base do axios
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";

// Interceptor para adicionar o token em todas as requisições
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createPost = async (postData) => {
  try {
    const response = await axios.post("/posts", {
      post: postData,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Erro ao criar o post." };
  }
};

export const getPosts = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`/posts?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Erro ao buscar os posts." };
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await axios.delete(`/posts/${postId}`);
    return response.data; 
  } catch (error) {
    throw error.response?.data || { message: "Erro ao deletar o post." };
  }
};

export const updatePost = async (postId, postData) => {
  try {
    const response = await axios.put(`/posts/${postId}`, {
      post: postData, 
    });
    return response.data; 
  } catch (error) {
    throw error.response?.data || { message: "Erro ao atualizar o post." };
  }
};
