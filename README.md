# Daba AI v1.0 - Agente de Banco de Dados com MCP

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

Daba AI é um agente de IA conversacional projetado para interagir de forma segura e eficiente com um banco de dados PostgreSQL. Utilizando um **MCP (Model Context Protocol) Server**, a Daba AI pode executar uma série de ferramentas pré-definidas para consultar informações, garantindo que a LLM nunca tenha acesso direto ao banco de dados, apenas às ferramentas expostas.

Este projeto serve como um framework robusto e um exemplo prático de como construir agentes de IA seguros, padronizados e com capacidades de interagir com sistemas externos.

---

## 📋 Sumário

1.  [Introdução](#-introdução)
2.  [Arquitetura do Projeto](#-arquitetura-do-projeto)
3.  [Estrutura de Pastas](#-estrutura-de-pastas)
4.  [Instalação e Configuração](#-instalação-e-configuração)
5.  [Ferramentas Disponíveis](#-ferramentas-disponíveis)
6.  [Guia do Banco de Dados](#-guia-do-banco-de-dados)
7.  [Próximos Passos](#-próximos-passos)

---

## 🚀 Introdução

- **Nome do projeto:** Daba AI v1.0
- **Descrição:** Daba AI é uma LLM integrada a um MCP Server e MCP Client que executa scripts SQL de maneira segura através de 'tools' para a base de dados.
- **Tecnologias:** NodeJS, ExpressJS, Zod, PostgreSQL, MCP SDK, HTML, CSS, JavaScript & IA.
- **Objetivos:** Fornecer as ferramentas necessárias para LLMs, estruturar o MCP Server e MCP Client, e padronizar a interação entre a IA e sistemas externos.
- **Modelo de IA:** `tngtech/deepseek-r1t2-chimera:free` via [OpenRouter](https://openrouter.ai/).

---

## 🏗️ Arquitetura do Projeto

O fluxo de funcionamento da Daba AI é orquestrado em um ciclo de duas fases principais, garantindo controle e segurança.

1.  **Interface do Usuário (Frontend):** O usuário interage com a Daba AI através de uma interface web simples.
2.  **Conexão MCP:** No backend, o `MCP Client` se conecta ao `MCP Server`, que por sua vez carrega e registra todas as ferramentas disponíveis no arquivo `tools.js`.
3.  **Fase 1: Análise e Decisão da Ferramenta:**
    - A pergunta do usuário é enviada para a LLM.
    - A LLM analisa a pergunta e, se necessário, decide qual ferramenta usar.
    - A resposta da LLM vem em um formato JSON estruturado, indicando a ferramenta e os argumentos necessários.
    ```json
    {
      "message": null,
      "tool": "verificar_estoque",
      "arguments": { "produto_id": 1 }
    }
    ```
4.  **Fase 2: Execução e Geração de Resposta:**
    - O backend usa o `MCP Client` para chamar a ferramenta escolhida pela IA. A execução real acontece de forma segura no `MCP Server`.
    - O resultado da ferramenta é retornado ao backend.
    - Este resultado é então enviado de volta à LLM, que o utiliza como contexto para gerar uma resposta final e amigável para o usuário.
    ```json
    {
      "message": "Claro! O produto com ID 1 possui 15 unidades em estoque."
    }
    ```
5.  **Ciclo Completo:** A resposta final é exibida no frontend, e o sistema está pronto para a próxima interação.

---

## 📁 Estrutura de Pastas

```
DABA-AI-MCP/
│
├── backend/                  # Lado do servidor (Node.js + MCP)
│   ├── docs/                 # Documentação auxiliar
│   │   └── database-guide.md # Guia do banco de dados
│   ├── src/                  # Código-fonte principal
│   │   ├── database/         # Conexão e configuração do banco
│   │   │   └── db.js
│   │   ├── llm/              # Integração com a IA (modelo)
│   │   │   └── model.js
│   │   └── mcp/              # Estrutura do MCP
│   │       ├── client.js     # Cliente MCP
│   │       ├── server.js     # Servidor MCP
│   │       └── tools.js      # Ferramentas registradas
│   ├── .env                  # Variáveis de ambiente (NÃO COMITAR)
│   ├── index.js              # Ponto de entrada do backend
│   └── package.json          # Dependências e scripts
│
├── frontend/                 # Lado do cliente (interface web)
│   ├── index.html            # Estrutura da página
│   ├── script.js             # Lógica do frontend
│   └── style.css             # Estilos da interface
│
├── .gitattributes            # Configurações do Git
├── LICENSE                   # Licença do projeto
└── README.md                 # Esta documentação
```

---

## 🛠️ Instalação e Configuração

Siga os passos abaixo para executar a Daba AI em seu ambiente local.

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [NPM](https://www.npmjs.com/)
- Acesso a um banco de dados PostgreSQL (recomendado: [NeonDB](https://neon.tech/))

### Passos

1.  **Clonar o repositório:**

    ```bash
    git clone https://github.com/Renan-Alb/DABA-AI-MCP.git
    cd DABA-AI-MCP
    ```

2.  **Instalar dependências do backend:**

    ```bash
    cd backend
    npm install
    ```

3.  **Configurar as variáveis de ambiente:**

    - Crie um arquivo chamado `.env` dentro da pasta `backend`.
    - Copie o conteúdo do arquivo `.env.example` (se houver) ou adicione as seguintes chaves:

    ```env
    # Porta para o servidor Express
    PORT=8080

    # URL de conexão do seu banco de dados PostgreSQL
    DATABASE_URL="postgresql://user:password@host:port/database"

    # Chave da API do OpenRouter
    OPENROUTER_API_KEY="sk-or-v1-..."

    # URL da API do OpenRouter para o modelo
    OPENROUTER_URL="https://openrouter.ai/api/v1/chat/completions"
    ```

4.  **Executar o projeto:**

    ```bash
    npm start
    ```

5.  **Acessar o frontend:**
    - Abra o arquivo `frontend/index.html` em seu navegador.

---

## 🔧 Ferramentas Disponíveis

As ferramentas são o coração da Daba AI, permitindo a interação segura com o banco de dados. Elas são definidas em `backend/src/mcp/tools.js`.

| Ferramenta               | Descrição                                                 | Entrada (Argumentos)  |
| :----------------------- | :-------------------------------------------------------- | :-------------------- |
| `verificar_estoque`      | Retorna a quantidade em estoque de um produto específico. | `produto_id` (number) |
| `listar_clientes`        | Retorna todos os clientes cadastrados.                    | Nenhuma               |
| `listar_produtos`        | Retorna todos os produtos cadastrados.                    | Nenhuma               |
| `produtos_mais_vendidos` | Retorna os produtos mais vendidos.                        | Nenhuma               |
| `listar_vendas`          | Retorna todas as vendas registradas.                      | Nenhuma               |

⚠️ **Aviso de Privacidade:** A ferramenta `listar_clientes` retorna e-mails. Em um ambiente de produção, recomenda-se anonimizar ou remover dados sensíveis.

---

## 🗃️ Guia do Banco de Dados

A estrutura completa do banco de dados, incluindo diagramas e descrições detalhadas das tabelas, pode ser encontrada no arquivo [docs/database-guide.md](./docs/database-guide.md).

Abaixo estão os scripts SQL para criar e popular o banco de dados para testes.

<details>
<summary>Clique para ver os Scripts SQL</summary>

```sql
-- Criar tabela clientes
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    data_cadastro DATE DEFAULT CURRENT_DATE
);

-- Criar tabela produtos
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    preco NUMERIC(10,2) NOT NULL,
    estoque INT DEFAULT 0
);

-- Criar tabela vendas
CREATE TABLE vendas (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES clientes(id),
    data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_venda NUMERIC(10,2) NOT NULL
);

-- Criar tabela itens_venda
CREATE TABLE itens_venda (
    id SERIAL PRIMARY KEY,
    venda_id INT REFERENCES vendas(id),
    produto_id INT REFERENCES produtos(id),
    quantidade INT NOT NULL,
    preco_unitario NUMERIC(10,2) NOT NULL
);

-- Inserir dados fictícios
INSERT INTO clientes (nome, email) VALUES
('João Silva', 'joao@email.com'),
('Maria Oliveira', 'maria@email.com'),
('Carlos Souza', 'carlos@email.com');

INSERT INTO produtos (nome, categoria, preco, estoque) VALUES
('Notebook Dell', 'Informática', 3500.00, 15),
('Mouse Logitech', 'Informática', 120.00, 50),
('Cadeira Gamer', 'Móveis', 950.00, 20),
('Copo Térmico', 'Utilidades', 60.00, 100);

INSERT INTO vendas (cliente_id, total_venda) VALUES
(1, 3620.00), (2, 120.00), (3, 1010.00);

INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario) VALUES
(1, 1, 1, 3500.00), (1, 2, 1, 120.00),
(2, 2, 1, 120.00), (3, 3, 1, 950.00), (3, 4, 1, 60.00);
```

</details>

---

## 🧠 Próximos Passos

A Daba AI foi projetada para evoluir. O roadmap de desenvolvimento é baseado no aprimoramento da capacidade de orquestração do agente:

- **v2.0 (Parallel Execution):** Implementar a capacidade de chamar múltiplas ferramentas independentes de uma só vez.
- **v3.0 (Sequential Execution):** Permitir que a IA execute uma cadeia de ferramentas, onde o resultado de uma alimenta a próxima, para resolver problemas de múltiplos passos.
- **v4.0 (Conditional Execution):** Dar à IA a capacidade de tomar decisões lógicas com base nos resultados das ferramentas.

---

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
