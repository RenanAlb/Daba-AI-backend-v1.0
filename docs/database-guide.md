# 📄 Documentação do Banco de Dados PostgreSQL

## 1️⃣ Tabela: `clientes`

| Campo           | Tipo         | Restrição            | Descrição                             |
| --------------- | ------------ | -------------------- | ------------------------------------- |
| `id`            | SERIAL       | PRIMARY KEY          | Identificador único do cliente        |
| `nome`          | VARCHAR(100) | NOT NULL             | Nome do cliente                       |
| `email`         | VARCHAR(100) | UNIQUE, NOT NULL     | Email do cliente (**campo sensível**) |
| `data_cadastro` | DATE         | DEFAULT CURRENT_DATE | Data em que o cliente foi cadastrado  |

**Observações:**

- Campo `email` é único e sensível. Evite exibir sem anonimização em sistemas públicos.
- `data_cadastro` é preenchido automaticamente se não fornecido.

---

## 2️⃣ Tabela: `produtos`

| Campo       | Tipo          | Restrição   | Descrição                        |
| ----------- | ------------- | ----------- | -------------------------------- |
| `id`        | SERIAL        | PRIMARY KEY | Identificador único do produto   |
| `nome`      | VARCHAR(100)  | NOT NULL    | Nome do produto                  |
| `categoria` | VARCHAR(50)   | NOT NULL    | Categoria do produto             |
| `preco`     | NUMERIC(10,2) | NOT NULL    | Preço unitário do produto        |
| `estoque`   | INT           | DEFAULT 0   | Quantidade disponível no estoque |

---

## 3️⃣ Tabela: `vendas`

| Campo         | Tipo          | Restrição                 | Descrição                     |
| ------------- | ------------- | ------------------------- | ----------------------------- |
| `id`          | SERIAL        | PRIMARY KEY               | Identificador único da venda  |
| `cliente_id`  | INT           | REFERENCES `clientes(id)` | Cliente que realizou a compra |
| `data_venda`  | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP | Data e hora da venda          |
| `total_venda` | NUMERIC(10,2) | NOT NULL                  | Valor total da venda          |

**Observações:**

- `cliente_id` faz referência à tabela `clientes`.
- `total_venda` deve ser calculado com base nos itens da venda.

---

## 4️⃣ Tabela: `itens_venda`

| Campo            | Tipo          | Restrição                 | Descrição                            |
| ---------------- | ------------- | ------------------------- | ------------------------------------ |
| `id`             | SERIAL        | PRIMARY KEY               | Identificador único do item da venda |
| `venda_id`       | INT           | REFERENCES `vendas(id)`   | Venda à qual este item pertence      |
| `produto_id`     | INT           | REFERENCES `produtos(id)` | Produto vendido                      |
| `quantidade`     | INT           | NOT NULL                  | Quantidade vendida                   |
| `preco_unitario` | NUMERIC(10,2) | NOT NULL                  | Preço do produto no momento da venda |

**Observações:**

- Cada item está ligado a uma venda (`venda_id`) e a um produto (`produto_id`).

---

### 🔑 Observações gerais

- Campos sensíveis: `email` em `clientes`.
- Todas as tabelas utilizam **chaves primárias auto incrementáveis (`SERIAL`)**.
- Relações:
  - `vendas.cliente_id` → `clientes.id`
  - `itens_venda.venda_id` → `vendas.id`
  - `itens_venda.produto_id` → `produtos.id`
- Use **prepared statements** para consultas SQL no código para evitar SQL Injection.
