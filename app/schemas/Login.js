import z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "O campo email é obrigatório!")
    .email("Email inválido!")
    .toLowerCase(),
  password: z
    .string()
    .min(6, "A senha deve possuir no mínimo 6 caracteres!")
    .max(12, "A senha deve possuir no máximo 12 caracteres!"),
});