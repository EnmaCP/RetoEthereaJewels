
import { pool } from '../src/db.ts';

async function check() {
    try {
        const resV = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'variante'");
        console.log("Columns in 'variante':", resV.rows.map(r => r.column_name));
        
        const resP = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'producto'");
        console.log("Columns in 'producto':", resP.rows.map(r => r.column_name));
        
        const res1 = await pool.query("SELECT * FROM producto LIMIT 1");
        console.log("Sample producto:", res1.rows[0]);
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await pool.end();
    }
}

check();
