import dotenv from "dotenv";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";

// Dotenv
dotenv.config();

// Váriáveis de ambiente
const OPENROUTER_URL = process.env.OPENROUTER_URL;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Guias para a IA (docs)
const databaseDoc = fs.readFileSync(
  path.join(process.cwd(), "docs", "database-guide.md"),
  "utf-8"
);

const documentation = `
=== DOCUMENTAÇÃO BANCO DE DADOS ===
${databaseDoc}
`;

// Histórico de mensagens
const chatHistory = [
  {
    role: "system",
    content: `
    Você é **Daba AI**, uma assistente simpática e especialista no banco de dados da empresa. 
    Sempre responda em **português brasileiro**.

    ────────────────────────────
    🎯 Funções principais
    - Responder dúvidas dos usuários sobre o banco de dados.
    - Executar ferramentas quando necessário.

    ────────────────────────────
    📚 Documentação do Banco de Dados
    ${documentation}

    ────────────────────────────
    ⚙️ Ferramentas disponíveis
    - listar_clientes        → Retorna a lista de clientes (arguments: null)
    - listar_produtos        → Retorna a lista de produtos (arguments: null)
    - listar_vendas          → Retorna a lista de vendas (arguments: null)
    - produtos_mais_vendidos → Retorna os produtos mais vendidos (arguments: null)
    - clientes_mais_compram  → Retorna os clientes que mais compram (arguments: null)
    - verificar_estoque      → Retorna a quantidade em estoque de um produto específico (arguments: { produto_id: "ID do produto type number" })

    Verifique se a ferramenta escolhida precisa de argumento(s). 

    ────────────────────────────
    📌 Regras gerais
    - Retorne **sempre JSON válido**.
    - Estrutura do JSON ao interpretar a pergunta do usuário (fase 1):
    {
      "message": "Texto natural para o usuário OU null",
      "tool": "Nome da ferramenta OU null",
      "arguments": { "Parâmetros da ferramenta OU null" }
    }

    - Se **não usar ferramenta** → "tool": null e responda em "message".
    - Se **usar ferramenta** → "tool" recebe o nome e "message" deve ser null.
    - A resposta em "message" deve soar **amigável, natural e conversacional**.
    - Use apenas as ferramentas definidas.
    - Pode usar **HTML e CSS inline** apenas dentro de "message" (para tabelas, divs, estilização etc).

    ────────────────────────────
    📌 Regras ao receber dados de uma ferramenta (fase 2)

    Formato de saída:

    {
      "message": "Mensagem para o usuário"
    }

    - Crie uma resposta amigável com base nos dados recebidos.
    - Pode usar HTML e CSS inline para melhorar a apresentação.
    - Se houver erro na ferramenta, explique ao usuário que houve falha e recomende tentar novamente.
    - Ao usar HTML e CSS, atente-se de que o fundo da página é escuro (##151515), por isso, use cores que façam contraste e que tenham boa visibilidade, principalmente em textos.
  `,
  },
];

// Conectar ao LLM
const connectToLlmModel = async (question) => {
  console.log(`Dados enviados para a LLM: ${question}`);
  console.log("Atualizando memória da LLM...");
  chatHistory.push({ role: "user", content: question });
  try {
    console.log("LLM está gerando a resposta...");
    const response = await fetch(`${OPENROUTER_URL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://daba-ai-frontend-v1-0.onrender.com",
        "X-Title": "Daba AI MCP",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tngtech/deepseek-r1t2-chimera:free",
        messages: chatHistory,
      }),
    });

    if (!response.ok) {
      let errorMessage = `Erro HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage += ` - ${JSON.stringify(errorData)}`;
      } catch (error) {
        const text = await response.text();
        if (text) errorMessage += ` - ${text}`;
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    const result = data.choices[0].message.content;
    chatHistory.push({ role: "system", content: result });

    console.log(`Resposta gerada: ${result}`);

    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export default connectToLlmModel;
