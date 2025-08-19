import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToLlmModel from "./src/llm/model.js";
import { getMcpClient, initMcpClient } from "./src/mcp/client.js";

// Dotenv config.
dotenv.config();

// Server config.
const app = express();
const port = process.env.PORT || 8080;

// Iniciar MCP Client
(async () => {
  await initMcpClient();
})();

// Middlewares
app.use(express.json());
app.use(cors());

function extractJSON(text) {
  try {
    const match = text.match(/\{[\s\S]*\}/); // pega tudo entre chaves
    if (!match) return null;
    return JSON.parse(match[0]); // <-- transforma a string em objeto JS
  } catch (err) {
    console.error("Erro ao extrair JSON:", err);
    return null;
  }
}

app.post("/ask-daba-ai", async (req, res) => {
  const { question } = req.body;
  try {
    const responseLLM = await connectToLlmModel(question);
    console.log("Extraindo resposta...");
    const parsedResponse = extractJSON(responseLLM);
    console.log("Resposta da LLM extraída");

    if (!parsedResponse) {
      console.error("JSON gerado inválido! Tente novamente!");
      return res
        .status(500)
        .json({ message: "JSON da LLM inválido", ok: false });
    }

    let messageLLM;
    if (parsedResponse.tool) {
      console.log("Chamando tool...\n");
      const mcp = getMcpClient();
      const toolResult = await mcp.callTool({
        name: parsedResponse.tool,
        arguments: parsedResponse.arguments || {},
      });
      parsedResponse.toolResult = toolResult;
      console.log("Tool retornou dados!");
    } else if (parsedResponse.message && !parsedResponse.tool) {
      console.log(
        "Mensagem gerada para o usuário (tool não foi necessária): ",
        parsedResponse.message
      );
      messageLLM = parsedResponse.message;
    }

    if (parsedResponse.toolResult) {
      console.log("LLM está gerando resposta ao usuário...\n");
      const creatingMessageAi = await connectToLlmModel(
        JSON.stringify(parsedResponse.toolResult)
      );

      const extrairJSON = extractJSON(creatingMessageAi);

      messageLLM = extrairJSON.message;
      console.log("Mensagem gerada com sucesso");
    }

    res.status(200).json({
      message: "Sucesso!",
      ok: true,
      answer: messageLLM,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error, ok: false });
  }
});

app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}\n`)
);
