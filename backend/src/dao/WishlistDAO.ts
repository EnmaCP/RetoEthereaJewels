import pool from '../db.ts';
import type { Wishlist } from '../types.ts';

export class WishlistDAO {
    // Obtener la lista de favoritos de un usuario
    static async obtenerPorUsuario(idUsuario: number): Promise<Wishlist[]> {
        const query = 'SELECT * FROM wishlist WHERE id_usuario = $1 ORDER BY created_at DESC';
        const resultado = await pool.query(query, [idUsuario]);
        return resultado.rows;
    }

    // Añadir un producto a favoritos
    static async añadir(idUsuario: number, idProducto: number): Promise<Wishlist> {
        const query = `
            INSERT INTO wishlist (id_usuario, id_producto) 
            VALUES ($1, $2) 
            RETURNING *;
        `;
        const resultado = await pool.query(query, [idUsuario, idProducto]);
        return resultado.rows[0];
    }

    // Quitar un producto de favoritos
    static async eliminar(idUsuario: number, idProducto: number): Promise<void> {
        const query = 'DELETE FROM wishlist WHERE id_usuario = $1 AND id_producto = $2';
        await pool.query(query, [idUsuario, idProducto]);
    }
}