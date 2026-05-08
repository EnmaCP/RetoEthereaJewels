import pool from '../db.ts';
import type { Fichaje } from '../types.ts';

export class FichajeDAO {
    // Ver los fichajes de un empleado concreto
    static async obtenerPorUsuario(idUsuario: number): Promise<Fichaje[]> {
        const query = 'SELECT * FROM fichaje WHERE id_usuario = $1 ORDER BY fecha DESC';
        const resultado = await pool.query(query, [idUsuario]);
        return resultado.rows;
    }

    // Registrar una entrada/salida
    static async crear(fichaje: Fichaje): Promise<Fichaje> {
        const query = `
            INSERT INTO fichaje (id_usuario, tipo, nota) 
            VALUES ($1, $2, $3) 
            RETURNING *;
        `;
        const valores = [fichaje.id_usuario, fichaje.tipo, fichaje.nota || ''];
        const resultado = await pool.query(query, valores);
        return resultado.rows[0];
    }
}