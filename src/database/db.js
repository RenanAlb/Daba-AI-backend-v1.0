import pkg from "pg";

const { Pool } = pkg;

let poolInstance;

export const initPool = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL não está definida. Certifique-se de que as variáveis de ambiente estão carregadas."
    );
  }

  poolInstance = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  // Opcional: Adicionar um listener para erros no pool
  poolInstance.on("error", (err, client) => {
    console.error("Erro inesperado no pool do PostgreSQL:", err);
  });

  console.log("Pool do PostgreSQL inicializado.");
};

export const getPool = () => {
  if (!poolInstance) {
    throw new Error(
      "Pool do PostgreSQL não foi inicializado. Chame initPool() primeiro."
    );
  }
  return poolInstance;
};

export const testDbConnection = async () => {
  try {
    const client = await getPool().connect();
    console.log("✅ Conectado ao PostgreSQL com sucesso!");
    client.release();
  } catch (error) {
    console.error("❌ Erro ao testar conexão com PostgreSQL: ", error);
    throw error; // Re-lança o erro para que o chamador saiba que falhou
  }
};
