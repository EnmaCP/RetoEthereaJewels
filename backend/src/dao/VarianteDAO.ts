import pool from '../db.ts';
import type{ Variante } from '../types.ts';

export class VarianteDAO {
    // Buscar todas las variantes (oro, plata, etc.) de un anillo en concreto
    static async obtenerPorProducto(idProducto: number): Promise<Variante[]> {
        const query = 'SELECT * FROM variante WHERE id_producto = $1';
        const resultado = await pool.query(query, [idProducto]);
        return resultado.rows;
    }

    static async crear(variante: Variante): Promise<Variante> {
        const query = `
            INSERT INTO variante (id_producto, material, precio_extra, stock) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *;
        `;
        const valores = [variante.id_producto, variante.material, variante.precio_extra || 0, variante.stock || 0];
        const resultado = await pool.query(query, valores);
        return resultado.rows[0];
    }

    // Útil cuando alguien compra un producto para restar stock
    static async actualizarStock(id: number, nuevoStock: number): Promise<void> {
        const query = 'UPDATE variante SET stock = $1 WHERE id = $2';
        await pool.query(query, [nuevoStock, id]);
    }
}