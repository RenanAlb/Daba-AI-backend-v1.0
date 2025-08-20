import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import dotenv from "dotenv";

dotenv.config();

const OPENROUTER_URL = process.env.OPENROUTER_URL;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Adicione estes logs
console.log("Valor de OPENROUTER_URL:", OPENROUTER_URL);
console.log("Valor de OPENROUTER_API_KEY:", OPENROUTER_API_KEY);

// Tipo do client para evitar "qualquer coisa"
let client;

export async function initMcpClient() {
  const transport = new StdioClientTransport({
    command: "node",
    args: ["./src/mcp/server.js"], // Ajustar caminho se precisar
  });

  client = new Client({
    name: "mcp-client",
    version: "1.0.0",
  });

  await client.connect(transport);
  console.log("✅ MCP Client conectado ao MCP Server");

  return client;
}

export function getMcpClient() {
  if (!client) {
    throw new Error("MCP Client ainda não foi inicializado!");
  }
  return client;
}
