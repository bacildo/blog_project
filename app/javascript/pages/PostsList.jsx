import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
// import { transactionSchema } from "../schemas/Transaction";
// import { createTransaction } from "../services/Transactions";
import { useState } from "react";

export default function PostsLists() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [errorsApi, setErrorsApi] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(transactionSchema) });

  async function handleForm(data) {
    try {
      const body = await { ...data, type };
      console.log(body);
      await createTransaction(body);
      navigate("/");
    } catch (error) {
      setErrorsApi(error.message);
      console.error(error.message, error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-around bg-zinc-900 rounded p-8 gap-7 relative">
      <header>
        <Link to="/">
          <IoArrowBackCircleOutline className="text-white absolute top-3 left-3 text-2xl  hover:text-teal-200" />
        </Link>
        <h1 className="text-white font-bold text-5xl"> Novo {type}</h1>
      </header>
      {errorsApi && <ErrorsInput message={errorsApi} />}
      <form
        onSubmit={handleSubmit(handleForm)}
        className="flex flex-col justify-center gap-4 w-full text-2xl"
      >
        <Input
          type="number"
          placeholder="Valor"
          register={register}
          name="value"
        />
        {errors.value && <ErrorsInput message={errors.value.message} />}
        <Input
          type="text"
          placeholder="Descrição"
          register={register}
          name="description"
        />
        {errors.description && (
          <ErrorsInput message={errors.description.message} />
        )}
        <Button type="submit" title="Salvar" />
      </form>
    </div>
  );
}
