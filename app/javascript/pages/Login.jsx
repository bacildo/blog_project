import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { loginSchema } from "../../schemas/Login";
import { loginUser } from "../../services/User";
import { useEffect, useState } from "react";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const navigate = useNavigate();

  const [errorsApi, setErrorsApi] = useState("");

  async function handleForm(data) {
    try {
      const token = await loginUser(data);
      Cookies.set("token", token.data, { expires: 1 });
      navigate("/posts");
    } catch (error) {
      console.log("Erro na requisição:", error.errors[0]);
      setErrorsApi(error.errors[0]);
    }
  }

  useEffect(() => {
    Cookies.remove("token");
  });

  return (
    <div className="flex flex-col items-center justify-around bg-zinc-900 rounded p-8 w-[30rem] h-[30rem] relative">
      <form
        onSubmit={handleSubmit(handleForm)}
        className="flex flex-col justify-center gap-4 w-full text-2xl"
      >
        <Input
          type="email"
          placeholder="Email"
          register={register}
          name="email"
        />
        {errors.email && (
          <div className="text-red-500">{errors.email.message}</div>
        )}
        
        <Input
          type="password"
          placeholder="Senha"
          register={register}
          name="password"
        />
        {errors.password && (
          <div className="text-red-500">{errors.password.message}</div>
        )}
        
        <Button type="submit" title="Login" />
        
        {errorsApi && (
          <div className="text-red-500 mt-2">{errorsApi}</div>
        )}
      </form>
      
      <p className="text-white text-2xl">
        Não possui uma conta?{" "}
        <Link to="/users" className="text-lime-300 hover:text-lime-500">
          Clique aqui!
        </Link>
      </p>
    </div>
  );
}