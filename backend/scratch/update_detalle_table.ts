import { pool } from '../src/db.ts';

async function updateDetalleTable() {
    try {
        console.log("Starting table update...");
        // Añadir columnas si no existen
        await pool.query(`
            ALTER TABLE detalle 
            ADD COLUMN IF NOT EXISTS url_foto TEXT,
            ADD COLUMN IF NOT EXISTS texto_grabado VARCHAR(255),
            ADD COLUMN IF NOT EXISTS fuente_seleccionada VARCHAR(100)
        `);
        
        console.log("Table 'detalle' updated successfully.");
    } catch (err) {
        console.error("Error updating table 'detalle':", err);
    } finally {
        await pool.end();
    }
}

updateDetalleTable();
