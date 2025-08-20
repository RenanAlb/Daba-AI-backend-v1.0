import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

console.log("Valor de DATABASE_URL: ", process.env.DATABASE_URL);

// Tipando a conexão com PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

// Testa a conexão
(async () => {
  try {
    const client = await pool.connect();
    console.log("Conectado ao PostgreSQL");
    client.release();
  } catch (error) {
    console.error("Erro ao se conectar ao PostgreSQL. Error => ", error);
  }
})();

export default pool;
