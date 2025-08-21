import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_7V1WhoqQYHfK@ep-morning-sound-acpjnom2-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=prefer",
  ssl: { rejectUnauthorized: false }, // se for Render/Neon
});

(async () => {
  try {
    const client = await pool.connect();
    console.log("Conectado ao PostgreSQL");
    client.release();
  } catch (error) {
    console.error("Erro ao conectar:", error);
  }
})();

export default pool;
