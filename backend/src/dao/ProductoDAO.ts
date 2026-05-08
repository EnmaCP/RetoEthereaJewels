import { pool } from '../db.ts';
import type { Producto } from '../types.ts';

export class ProductoDAO {
    // Obtener todos los productos (Para la cuadrícula de la tienda)
    static async obtenerTodos() {
        const query = `
            SELECT p.*, c.nombre as nombre_coleccion 
            FROM producto p
            LEFT JOIN coleccion c ON p.id_coleccion = c.id
            ORDER BY p.id ASC
        `;
        const { rows } = await pool.query(query);
        return rows;
    }

    //Obtener un producto por ID (Para la página de detalle)
    static async obtenerPorId(id: number) {
        const query = 'SELECT * FROM producto WHERE id = $1';
        const { rows } = await pool.query(query, [id]);
        return rows[0] || null;
    }

    //Crear un nuevo producto (Por si quieres añadir joyas desde el backend)
    static async crear(producto: any) {
        const { nombre, descripcion, precio_base, id_coleccion, image_url } = producto;
        const query = `
            INSERT INTO producto (nombre, descripcion, precio_base, id_coleccion, image_url)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const values = [nombre, descripcion, precio_base, id_coleccion, image_url];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }
}