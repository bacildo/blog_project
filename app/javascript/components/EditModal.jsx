import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema } from "../../schemas/Posts";
import Button from "../components/Button";

const EditModal = ({ isOpen, onClose, postData, onSave }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(postSchema), defaultValues: postData });

  const onSubmit = async (data) => {
    await onSave(data);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-gray-800 bg-opacity-90 p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold text-white mb-4">Editar Post</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Título"
              {...register("title")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            {errors.title && <span className="text-red-500">{errors.title.message}</span>}
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Conteúdo"
              {...register("content")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            {errors.content && <span className="text-red-500">{errors.content.message}</span>}
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="URL da Imagem"
              {...register("image_url")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            {errors.image_url && <span className="text-red-500">{errors.image_url.message}</span>}
          </div>

          <div className="flex justify-end">
            <Button type="submit" title="Salvar" className="mr-2" />
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Fechar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
