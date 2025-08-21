import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // se for Render/Neon
});

(async () => {
  try {
    const client = await pool.connect();
    console.log("Conectado ao PostgreSQL");
    client.release();
  } catch (err) {
    console.error("Erro ao conectar:", err);
  }
})();

export default pool;
