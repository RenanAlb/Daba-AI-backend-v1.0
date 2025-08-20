import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

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
