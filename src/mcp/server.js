import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { initPool, getPool, testDbConnection } from "../database/db.js";
import {
  verificarEstoqueTool,
  listarClientesTool,
  listarProdutosTool,
  produtosMaisVendidosTool,
  listarVendasTool,
  clientesMaisCompramTool,
} from "./tools.js";
import dotenv from "dotenv";
dotenv.config();

const server = new McpServer({
  name: "meu-mcp",
  version: "1.0.0",
});

server.registerTool(
  listarClientesTool.name,
  {
    title: listarClientesTool.name,
    description: listarClientesTool.description,
    inputSchema: listarClientesTool.inputSchema,
  },
  async ({}) => {
    try {
      const pool = getPool();
      const result = await pool.query(
        "SELECT id, nome, email, data_cadastro FROM clientes"
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result.rows, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error(error);
      return {
        content: [
          {
            type: "text",
            text: "Ocorreu um erro ao listar os clientes",
          },
        ],
      };
    }
  }
);

server.registerTool(
  listarProdutosTool.name,
  {
    title: listarProdutosTool.name,
    description: listarProdutosTool.description,
    inputSchema: listarProdutosTool.inputSchema,
  },
  async () => {
    try {
      const pool = getPool();
      const resultListarProdutos = await pool.query("SELECT * FROM produtos");

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(resultListarProdutos.rows, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error(error);
      return {
        content: [
          {
            type: "text",
            text: "Ocorreu um erro ao listar os produtos",
          },
        ],
      };
    }
  }
);

server.registerTool(
  listarVendasTool.name,
  {
    title: listarVendasTool.name,
    description: listarVendasTool.description,
    inputSchema: listarVendasTool.inputSchema,
  },
  async () => {
    try {
      const pool = getPool();
      const resultListarVendas = await pool.query("SELECT * FROM vendas");

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(resultListarVendas.rows, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error(error);
      return {
        content: [
          {
            type: "text",
            text: "Ocorreu um erro ao listar as vendas",
          },
        ],
      };
    }
  }
);

server.registerTool(
  produtosMaisVendidosTool.name,
  {
    title: produtosMaisVendidosTool.name,
    description: produtosMaisVendidosTool.description,
    inputSchema: produtosMaisVendidosTool.inputSchema,
  },
  async () => {
    try {
      const pool = getPool();
      const resultProdutosMaisVendidos = await pool.query(
        `SELECT 
    p.id,
    p.nome,
    p.categoria,
    SUM(iv.quantidade) AS total_vendido,
    SUM(iv.quantidade * iv.preco_unitario) AS faturamento_total
FROM itens_venda iv
JOIN produtos p ON iv.produto_id = p.id
GROUP BY p.id, p.nome, p.categoria
ORDER BY total_vendido DESC
LIMIT 10;
`
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(resultProdutosMaisVendidos.rows, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error(error);
      return {
        content: [
          {
            type: "text",
            text: "Ocorreu um erro ao listar os produtos mais vendidos",
          },
        ],
      };
    }
  }
);

server.registerTool(
  clientesMaisCompramTool.name,
  {
    title: clientesMaisCompramTool.name,
    description: clientesMaisCompramTool.description,
    inputSchema: clientesMaisCompramTool.inputSchema,
  },
  async () => {
    try {
      const pool = getPool();
      const resultClientesMaisCompram = await pool.query(`SELECT 
    c.id AS cliente_id,
    c.nome AS cliente_nome,
    COUNT(iv.id) AS total_itens_comprados,
    SUM(iv.quantidade * iv.preco_unitario) AS total_gasto
FROM clientes c
JOIN vendas v ON c.id = v.cliente_id
JOIN itens_venda iv ON v.id = iv.venda_id
GROUP BY c.id, c.nome
ORDER BY total_itens_comprados DESC
LIMIT 10;
`);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(resultClientesMaisCompram.rows, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error(error);
      return {
        content: [
          {
            type: "text",
            text: "Ocorreu um erro ao listar as vendas",
          },
        ],
      };
    }
  }
);

server.registerTool(
  verificarEstoqueTool.name,
  {
    title: verificarEstoqueTool.name,
    description: verificarEstoqueTool.description,
    inputSchema: verificarEstoqueTool.inputSchema,
  },
  async ({ produto_id }) => {
    try {
      const pool = getPool();
      const resultVerificarEstoque = await pool.query(
        "SELECT estoque FROM produtos WHERE id = $1",
        [produto_id]
      );

      if (resultVerificarEstoque.rows.length == 0) {
        return {
          content: [
            {
              type: "text",
              text: "Ocorreu um erro ao listar os produtos mais vendidos",
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(resultVerificarEstoque.rows, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error(error);
      return {
        content: [
          {
            type: "text",
            text: "Ocorreu um erro ao verificar o estoque do produto",
          },
        ],
      };
    }
  }
);

// Conectar via STDIO
const transport = new StdioServerTransport();
// Inicializar o pool do banco de dados antes de conectar o servidor MCP
initPool();

// Testar a conexão com o banco de dados
await testDbConnection();
await server.connect(transport);
