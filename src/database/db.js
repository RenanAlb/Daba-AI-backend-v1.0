import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

// Tipando a conexão com PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

const connectToDataBase = async () => {
  try {
    const client = await pool.connect();
    console.log("Conectado ao PostgreSQL");
    client.release();
    return pool;
  } catch (error) {
    console.error("Erro ao se conectar ao PostgreSQL. Error => ", error);
  }
};

connectToDataBase();

export default pool;
