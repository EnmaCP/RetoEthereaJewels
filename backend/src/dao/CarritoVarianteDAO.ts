import pool from '../db.ts';
import type { CarritoVariante } from '../types.ts';

export class CarritoVarianteDAO {
    // Ver qué hay dentro del carrito de un cliente
    static async obtenerItemsDeCarrito(idCarrito: number): Promise<CarritoVariante[]> {
        const query = 'SELECT * FROM carrito_variante WHERE id_carrito = $1';
        const resultado = await pool.query(query, [idCarrito]);
        return resultado.rows;
    }

    // Meter una joya al carrito
    static async añadirItem(item: CarritoVariante): Promise<CarritoVariante> {
        const query = `
            INSERT INTO carrito_variante (id_carrito, id_variante, cantidad) 
            VALUES ($1, $2, $3) 
            RETURNING *;
        `;
        const valores = [item.id_carrito, item.id_variante, item.cantidad || 1];
        const resultado = await pool.query(query, valores);
        return resultado.rows[0];
    }

    // Borrar una joya del carrito
    static async eliminarItem(id: number): Promise<void> {
        const query = 'DELETE FROM carrito_variante WHERE id = $1';
        await pool.query(query, [id]);
    }
}