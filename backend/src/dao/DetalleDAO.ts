import pool from '../db.ts';
import type { Detalle } from '../types.ts';

export class DetalleDAO {
    static async obtenerPorVariante(idVariante: number): Promise<Detalle | null> {
        const query = 'SELECT * FROM detalle WHERE id_variante = $1';
        const resultado = await pool.query(query, [idVariante]);
        return resultado.rows.length ? resultado.rows[0] : null;
    }

    static async crear(detalle: Detalle): Promise<Detalle> {
        const query = `
            INSERT INTO detalle (id_variante, url_foto, texto_grabado, fuente_seleccionada, precio_extra) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *;
        `;
        const valores = [
            detalle.id_variante, 
            detalle.url_foto || null, 
            detalle.texto_grabado || null, 
            detalle.fuente_seleccionada || 'default', 
            detalle.precio_extra || 0
        ];
        const resultado = await pool.query(query, valores);
        return resultado.rows[0];
    }
}