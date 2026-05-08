// Backend/src/dao/ReviewDAO.ts
import pool from '../db.ts';
import  type { Review } from '../types.ts';

export class ReviewDAO {
    
    // Obtener todas las reviews de un producto específico
    static async obtenerPorProducto(idProducto: number): Promise<Review[]> {
        const query = 'SELECT * FROM reviews WHERE id_producto = $1 ORDER BY created_at DESC';
        const resultado = await pool.query(query, [idProducto]);
        return resultado.rows;
    }

    // Obtener todas las reviews que ha escrito un usuario
    static async obtenerPorUsuario(idUsuario: number): Promise<Review[]> {
        const query = 'SELECT * FROM reviews WHERE id_usuario = $1 ORDER BY created_at DESC';
        const resultado = await pool.query(query, [idUsuario]);
        return resultado.rows;
    }

    // Crear una nueva review
    static async crear(review: Review): Promise<Review> {
        const query = `
            INSERT INTO reviews (id_producto, id_usuario, valoracion, titulo, comentario) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *;
        `;
        const valores = [
            review.id_producto, 
            review.id_usuario, 
            review.valoracion, 
            review.titulo || '', 
            review.comentario || ''
        ];
        
        const resultado = await pool.query(query, valores);
        return resultado.rows[0];
    }

    // Borrar una review
   static async eliminar(idReview: number, rolDelUsuarioQuePideBorrar: string): Promise<boolean> {
        
        // 1. LA BARRERA DE SEGURIDAD
        if (rolDelUsuarioQuePideBorrar !== 'admin') {
            throw new Error('Permiso denegado: Solo los administradores pueden eliminar reseñas.');
        }

        // 2. SI PASA LA BARRERA, BORRAMOS
        const query = 'DELETE FROM reviews WHERE id = $1';
        const resultado = await pool.query(query, [idReview]);
        
        // Opcional: rowCount nos dice cuántas filas se borraron. 
        // Si es 0, es que la review ya no existía.
        return (resultado.rowCount ?? 0) > 0; 
    }
}