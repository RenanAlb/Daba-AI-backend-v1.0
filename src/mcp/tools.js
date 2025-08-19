import { z } from "zod";

// Definição da ferramenta para verificar estoque
export const verificarEstoqueTool = {
  name: "verificar_estoque",
  description: "Retorna a quantidade em estoque de um produto específico",
  inputSchema: {
    produto_id: z.number(),
  },
};

// Definição da ferramenta para listar clientes (sem schema)
export const listarClientesTool = {
  name: "listar_clientes",
  description: "Retorna todos os clientes cadastrados",
  inputSchema: {}, // Use z.object({}) para schemas vazios
};

// Definição da ferramenta para listar produtos
export const listarProdutosTool = {
  name: "listar_produtos",
  description: "Retorna todos os produtos cadastrados",
  inputSchema: {},
};

// Definição da ferramenta para retornar os produtos mais vendidos
export const produtosMaisVendidosTool = {
  name: "produtos_mais_vendidos",
  description: "Retorna os produtos mais vendidos",
  inputSchema: {},
};

// Definição da ferramenta para retornar a lista de vendas
export const listarVendasTool = {
  name: "listar_vendas",
  description: "Retorna a lista de vendas",
  inputSchema: {},
};

// Definição da ferramenta para retornar os clientes que mais compram
export const clientesMaisCompramTool = {
  name: "clientes_mais_compram",
  description: " Retorna os clientes que mais compram ",
  inputSchema: {},
};
