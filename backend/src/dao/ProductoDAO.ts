import { pool } from '../db.ts';
import type { Producto } from '../types.ts';

export class ProductoDAO {
    // Obtener todos los productos (Para la cuadrícula de la tienda)
    static async obtenerTodos() {
        const query = `
            SELECT p.*, c.nombre as nombre_coleccion 
            FROM producto p
            LEFT JOIN coleccion c ON p.id_coleccion = c.id
            WHERE p.activo = true
            ORDER BY p.id ASC
        `;
        const { rows } = await pool.query(query);
        return rows;
    }

    //Obtener un producto por ID (Para la página de detalle)
    static async obtenerPorId(id: number) {
        // Especificamos las columnas para que el frontend reciba lo que espera
        const query = 'SELECT id, nombre, descripcion, precio_base, image_url, activo FROM producto WHERE id = $1';
        const { rows } = await pool.query(query, [id]);
        return rows[0] || null;
    }

    // Soft delete (Desactivar producto)
    static async softDelete(id: number) {
        const query = 'UPDATE producto SET activo = false WHERE id = $1 RETURNING *';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }

    // Actualizar producto
    static async actualizar(id: number, producto: any) {
        const { nombre, descripcion, precio_base, id_coleccion, image_url, activo } = producto;
        const query = `
            UPDATE producto 
            SET nombre = $1, descripcion = $2, precio_base = $3, id_coleccion = $4, image_url = $5, activo = $6
            WHERE id = $7
            RETURNING *
        `;
        const values = [nombre, descripcion, precio_base, id_coleccion, image_url, activo, id];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    //Crear un nuevo producto (Por si quieres añadir joyas desde el backend)
    static async crear(producto: any) {
        const { nombre, descripcion, precio_base, id_coleccion, image_url } = producto;
        const query = `
            INSERT INTO producto (nombre, descripcion, precio_base, id_coleccion, image_url, activo)
            VALUES ($1, $2, $3, $4, $5, true)
            RETURNING *
        `;
        const values = [nombre, descripcion, precio_base, id_coleccion, image_url];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }
}