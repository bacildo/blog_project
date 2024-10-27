import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { postSchema } from "../../schemas/Posts";
import { createPost, deletePost, getPosts, updatePost } from "../../services/Posts";
import Button from "../components/Button";
import Input from "../components/Input";

export default function PostsList() {
  const [posts, setPosts] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPost, setEditingPost] = useState(null); 
  const [errorsApi, setErrorsApi] = useState("");
  const loadingRef = useRef(false); 
  const scrollContainerRef = useRef(null);
  const postsPerPage = 10; 

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(postSchema) });

  const fetchPosts = async (page = 1) => {
    try {
      const response = await getPosts(page, postsPerPage); 
      setPosts((prevPosts) => [...prevPosts, ...response]); // Adiciona novos posts à lista
      loadingRef.current = false; 
    } catch (error) {
      console.error(error);
      setErrorsApi(error.message);
      setPosts([]); 
      loadingRef.current = false; 
    }
  };

  useEffect(() => {
    fetchPosts(currentPage); // Busca os posts ao carregar a página
  }, [currentPage]);

  // Função para detectar quando o usuário chega ao final do contêiner da tabela
  const handleScroll = () => {
    if (scrollContainerRef.current && 
        scrollContainerRef.current.scrollTop + scrollContainerRef.current.clientHeight >= scrollContainerRef.current.scrollHeight - 10 && 
        !loadingRef.current) {
      loadingRef.current = true; // Previne múltiplas requisições
      setCurrentPage((prevPage) => prevPage + 1); // Incrementa a página
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll); 
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll); 
      }
    };
  }, []);

  const handleEdit = (post) => {
    setEditingPost(post);
    reset(post); 
  };

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId)); 
    } catch (error) {
      console.error(error);
      setErrorsApi(error.message);
    }
  };

  const handleForm = async (data) => {
    try {
      if (editingPost) {
        await updatePost(editingPost.id, data); 
        setEditingPost(null); 
      } else {
        await createPost(data); 
      }
      reset(); 
      fetchPosts(currentPage); // Recarrega os posts
    } catch (error) {
      setErrorsApi(error.message);
      console.error(error.message, error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-around bg-zinc-900 rounded p-8 gap-7 relative">
      <header>
        <Link to="/">
          <IoArrowBackCircleOutline className="text-white absolute top-3 left-3 text-2xl hover:text-teal-200" />
        </Link>
        <h1 className="text-white font-bold text-5xl">Gerenciar Posts</h1>
      </header>
      {errorsApi && <div className="text-red-500">{errorsApi}</div>}
      <form
        onSubmit={handleSubmit(handleForm)}
        className="flex flex-col justify-center gap-4 w-full text-2xl"
      >
        <Input
          type="text"
          placeholder="Título"
          register={register}
          name="title"
        />
        {errors.title && <div className="text-red-500">{errors.title.message}</div>}
        
        <Input
          type="text"
          placeholder="Conteúdo"
          register={register}
          name="content"
        />
        {errors.content && <div className="text-red-500">{errors.content.message}</div>}
        
        <Input
          type="text"
          placeholder="URL da Imagem"
          register={register}
          name="image_url"
        />
        {errors.image_url && <div className="text-red-500">{errors.image_url.message}</div>}
        
        <Button type="submit" title={editingPost ? "Atualizar" : "Salvar"} />
      </form>

      <div className="mt-6 w-full">
        <h2 className="text-white font-bold text-3xl">Lista de Posts</h2>
        <div 
          ref={scrollContainerRef} 
          style={{ maxHeight: "400px", overflowY: "auto" }} // Define a altura e permite rolagem
          className="border border-gray-300"
        >
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="border-b-2 border-gray-300 px-4 py-2">Título</th>
                <th className="border-b-2 border-gray-300 px-4 py-2">Conteúdo</th>
                <th className="border-b-2 border-gray-300 px-4 py-2">URL da Imagem</th>
                <th className="border-b-2 border-gray-300 px-4 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <tr key={post.id}>
                    <td className="border-b border-gray-300 px-4 py-2">{post.title}</td>
                    <td className="border-b border-gray-300 px-4 py-2">{post.content}</td>
                    <td className="border-b border-gray-300 px-4 py-2">{post.image_url}</td>
                    <td className="border-b border-gray-300 px-4 py-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-blue-500 hover:underline mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-500 hover:underline"
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center border-b border-gray-300 px-4 py-2">
                    Nenhum post encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
