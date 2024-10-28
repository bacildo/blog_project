import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(1, { message: "O título é obrigatório." }) 
    .max(100, { message: "O título deve ter no máximo 100 caracteres." }), 

  content: z
    .string()
    .min(1, { message: "O conteúdo é obrigatório." }) 
    .max(1000, { message: "O conteúdo deve ter no máximo 1000 caracteres." }), 

  image_url: z
    .string()
    .url({ message: "A URL da imagem deve ser uma URL válida." })
    .optional(), 
});

