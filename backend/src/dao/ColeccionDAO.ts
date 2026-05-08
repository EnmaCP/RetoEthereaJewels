import pool from '../db.ts';
import type {Coleccion } from '../types.ts';

export class ColeccionDAO {
    static async obtenerTodas(): Promise<Coleccion[]> {
        const query = 'SELECT * FROM coleccion ORDER BY launch_date DESC';
        const resultado = await pool.query(query);
        return resultado.rows;
    }

    static async obtenerPorId(id: number): Promise<Coleccion | null> {
        const query = 'SELECT * FROM coleccion WHERE id = $1';
        const resultado = await pool.query(query, [id]);
        return resultado.rows[0];
    }

    static async crearColeccion(coleccion: Coleccion): Promise<Coleccion> {
        const query = `
            INSERT INTO coleccion (nombre, descripcion, image_url)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const valores = [coleccion.nombre, coleccion.descripcion, coleccion.image_url];
        const resultado = await pool.query(query, valores);
        return resultado.rows[0];
    }

}