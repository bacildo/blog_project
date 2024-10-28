import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { postSchema } from "../../schemas/Posts";
import {
  createPost,
  deletePost,
  getPosts,
  getRemotePosts,
  updatePost,
} from "../../services/Posts";
import Button from "../components/Button";
import Input from "../components/Input";
import EditModal from "../components/EditModal";
import DeleteModal from "../components/DeleteModal";

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [remotePosts, setRemotePosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [remotePage, setRemotePage] = useState(1);
  const [editingPost, setEditingPost] = useState(null);
  const [errorsApi, setErrorsApi] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const loadingRef = useRef({ local: false, remote: false });
  const scrollContainerLocalRef = useRef(null);
  const scrollContainerRemoteRef = useRef(null);
  const postsPerPage = 10;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(postSchema) });

  const fetchPosts = async (page = 1) => {
    try {
      const response = await getPosts(page, postsPerPage, "created_at", "desc");
      if (response.posts.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...response.posts]);
      }
      loadingRef.current.local = false;
    } catch (error) {
      console.error(error);
      setErrorsApi(error.message);
      setPosts([]);
    }
  };

  const fetchRemotePosts = async (page = 1) => {
    try {
      const response = await getRemotePosts(
        page,
        postsPerPage,
        "source.name",
        "desc"
      );
      if (response.articles.length > 0) {
        setRemotePosts((prevRemotePosts) => [
          ...prevRemotePosts,
          ...response.articles,
        ]);
      }
      loadingRef.current.remote = false;
    } catch (error) {
      console.error(error);
      setErrorsApi(error.message);
      setRemotePosts([]);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
    fetchRemotePosts(remotePage);
  }, [currentPage, remotePage]);

  const handleLocalScroll = () => {
    if (
      scrollContainerLocalRef.current &&
      scrollContainerLocalRef.current.scrollTop +
        scrollContainerLocalRef.current.clientHeight >=
        scrollContainerLocalRef.current.scrollHeight - 10 &&
      !loadingRef.current.local
    ) {
      loadingRef.current.local = true;
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleRemoteScroll = () => {
    if (
      scrollContainerRemoteRef.current &&
      scrollContainerRemoteRef.current.scrollTop +
        scrollContainerRemoteRef.current.clientHeight >=
        scrollContainerRemoteRef.current.scrollHeight - 10 &&
      !loadingRef.current.remote
    ) {
      loadingRef.current.remote = true;
      setRemotePage((prevRemotePage) => prevRemotePage + 1);
    }
  };

  useEffect(() => {
    const localScrollContainer = scrollContainerLocalRef.current;
    const remoteScrollContainer = scrollContainerRemoteRef.current;

    if (localScrollContainer) {
      localScrollContainer.addEventListener("scroll", handleLocalScroll);
    }
    if (remoteScrollContainer) {
      remoteScrollContainer.addEventListener("scroll", handleRemoteScroll);
    }

    return () => {
      if (localScrollContainer) {
        localScrollContainer.removeEventListener("scroll", handleLocalScroll);
      }
      if (remoteScrollContainer) {
        remoteScrollContainer.removeEventListener("scroll", handleRemoteScroll);
      }
    };
  }, []);

  const handleEdit = (post) => {
    setEditingPost(post);
    reset(post);
    setShowEditModal(true);
  };

  const handleDeleteConfirmation = (postId) => {
    setPostToDelete(postId);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    try {
      // Exclui o post do servidor
      await deletePost(postToDelete);

      // Atualiza o estado local removendo o post excluído
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== postToDelete)
      );

      setShowConfirmModal(false); // Fecha o modal de confirmação
    } catch (error) {
      console.error(error);
      setErrorsApi(error.message);
    }
  };

  const handleForm = async (data) => {
    try {
      if (editingPost) {
        await updatePost(editingPost.id, data);

        // Atualiza o estado local sem precisar buscar novamente
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === editingPost.id ? { ...post, ...data } : post
          )
        );
        setEditingPost(null); // Limpa o estado de edição
      } else {
        const newPost = await createPost(data);
        setPosts((prevPosts) => [...prevPosts, newPost]);
      }
      reset();
    } catch (error) {
      setErrorsApi(error.message);
      console.error(error.message, error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-around bg-zinc-900 rounded p-8 gap-7 relative">
      <header>
        <Link to="/login">
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
        {errors.title && (
          <div className="text-red-500">{errors.title.message}</div>
        )}

        <Input
          type="text"
          placeholder="Conteúdo"
          register={register}
          name="content"
        />
        {errors.content && (
          <div className="text-red-500">{errors.content.message}</div>
        )}

        <Input
          type="text"
          placeholder="URL da Imagem"
          register={register}
          name="image_url"
        />
        {errors.image_url && (
          <div className="text-red-500">{errors.image_url.message}</div>
        )}

        <Button type="submit" title={editingPost ? "Atualizar" : "Salvar"} />
      </form>

      <div className="mt-6 flex gap-4 w-full">
        <div className="w-1/2">
          <h2 className="text-white font-bold text-3xl">
            Lista de Posts Locais
          </h2>
          <div
            ref={scrollContainerLocalRef}
            style={{ maxHeight: "400px", overflowY: "auto" }}
            className="border border-gray-300"
          >
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="border-b-2 border-gray-300 px-4 py-2">
                    Título
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">
                    Conteúdo
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">Url</th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.length > 0 ? (
                  posts.map((post, index) => (
                    <tr key={`${post.id}-${index}`}>
                      <td className="border-b border-gray-300 px-4 py-2">
                        {post.title}
                      </td>
                      <td className="border-b border-gray-300 px-4 py-2">
                        {post.content}
                      </td>
                      <td className="border-b border-gray-300 px-4 py-2">
                        {post.image_url}
                      </td>
                      <td className="border-b border-gray-300 px-4 py-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="text-blue-500 hover:underline"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteConfirmation(post.id)}
                          className="text-red-500 hover:underline ml-2"
                        >
                          Deletar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      Nenhum post encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-1/2">
          <h2 className="text-white font-bold text-3xl">
            Lista de Posts Remotos
          </h2>
          <div
            ref={scrollContainerRemoteRef}
            style={{ maxHeight: "400px", overflowY: "auto" }}
            className="border border-gray-300"
          >
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="border-b-2 border-gray-300 px-4 py-2">
                    Título
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">
                    Fonte
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">Url</th>
                </tr>
              </thead>
              <tbody>
                {remotePosts.length > 0 ? (
                  remotePosts.map((post, index) => (
                    <tr key={`${post.title}-${post.publishedAt}-${index}`}>
                      <td className="border-b border-gray-300 px-4 py-2">
                        {post.title}
                      </td>
                      <td className="border-b border-gray-300 px-4 py-2">
                        {post.source.name}
                      </td>
                      <td className="border-b border-gray-300 px-4 py-2">
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Visualizar
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      Nenhum post encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modais */}
      {showEditModal && (
        <EditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          postData={editingPost}
          onSave={handleForm}
        />
      )}

      {showConfirmModal && (
        <DeleteModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
