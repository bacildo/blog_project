import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../schemas/Register";
import { registerUser } from "../../services/User";
import { useState } from "react";
import ErrorsInput from "../components/ErrorsInput";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });
  const navigate = useNavigate();
  const [errorsApi, setErrorsApi] = useState("");

  async function handleForm(data) {
    try {
      await registerUser(data);
      navigate("/login");
    } catch (error) {
      setErrorsApi(error.message);
    }
  }

  return (
    <div className="flex flex-col items-center justify-around bg-zinc-900 rounded p-8 w-[30rem] h-[30rem] relative">
      <Link to="/login">
        <IoArrowBackCircleOutline className="text-white absolute top-3 left-3 text-2xl hover:text-teal-200" />
      </Link>
      {errorsApi && <ErrorsInput message={errorsApi} />}
      <form
        onSubmit={handleSubmit(handleForm)}
        className="flex flex-col justify-center gap-4 w-full text-2xl"
      >
        {errors.name && <ErrorsInput message={errors.name.message} />}
        <Input
          type="email"
          placeholder="Email"
          register={register}
          name="email"
        />
        {errors.email && <ErrorsInput message={errors.email.message} />}
        <Input
          type="password"
          placeholder="Senha"
          register={register}
          name="password"
        />
        {errors.password && <ErrorsInput message={errors.password.message} />}
        <Input
          type="password"
          placeholder="Confirmar Senha"
          register={register}
          name="confirmPassword"
        />
        {errors.confirmPassword && (
          <ErrorsInput message={errors.confirmPassword.message} />
        )}
        <Button type="submit" title="CONFIRMAR" />
      </form>
    </div>
  );
}

