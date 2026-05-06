import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();
export const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? "5432"),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

// Comprobamos que la conexión funciona cuando arranque el servidor
pool.connect()
    .then(() => console.log('✅ Conectado a la base de datos PostgreSQL con éxito'))
    .catch((err) => console.error('❌ Error conectando a la base de datos:', err));

// Exportamos el pool para usarlo en otros archivos
export default pool;