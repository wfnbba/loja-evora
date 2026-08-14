import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getAddressByCep = createServerFn({ method: "GET" })
  .validator((cep: string) => z.string().length(8).parse(cep.replace(/\D/g, "")))
  .handler(async ({ data: cep }) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        return { success: false, message: "CEP não encontrado" };
      }
      
      return {
        success: true,
        data: {
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf
        }
      };
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      return { success: false, message: "Erro ao buscar CEP" };
    }
  });