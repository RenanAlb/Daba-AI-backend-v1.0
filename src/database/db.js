import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

let pool;
// Tipando a conexão com PostgreSQL
const startDataBase = async () => {
  if (!process.env.DATABASE_URL) {
    return console.log("DATABASE_URL não está definida");
  }

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false,
  });
};

startDataBase();

export const connectToDataBase = async () => {
  try {
    const client = await pool.connect();
    console.log("Conectado ao PostgreSQL");
    client.release();
    return pool;
  } catch (error) {
    console.error("Erro ao se conectar ao PostgreSQL. Error => ", error);
  }
};

export default pool;
