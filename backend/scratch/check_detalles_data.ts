import { pool } from '../src/db.ts';

async function checkLastDetalles() {
    try {
        const result = await pool.query(`
            SELECT * FROM detalle 
            ORDER BY id DESC 
            LIMIT 5
        `);
        console.log("Last 5 entries in 'detalle' table:");
        console.table(result.rows);
    } catch (err) {
        console.error("Error checking detalles:", err);
    } finally {
        await pool.end();
    }
}

checkLastDetalles();
