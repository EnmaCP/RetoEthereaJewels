import { pool } from '../db.ts';
import type { Usuario } from '../types.ts';

export class UsuarioDAO {
    
    //obtener todos los usuarios
    static async obtenerTodos(): Promise<Usuario[]> {
        const query = 'SELECT id, nombre_usuario, email, password_hash, rol, active, created_at FROM usuario';
        const resultado = await pool.query(query);
        return resultado.rows;
    }

    //buscar por id
    static async obtenerPorId(id: number): Promise<Usuario | null> {
        const query = 'SELECT * FROM usuario WHERE id = $1';
        const resultado = await pool.query(query, [id]);
        return resultado.rows[0];
    }

    //Crear nuevo usuario
    static async crear(usuario: Usuario): Promise<Usuario> {
        const query = `
            INSERT INTO usuario (nombre_usuario, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING id, nombre_usuario, email, rol
            `;
            const valores = [usuario.nombre_usuario, usuario.email, usuario.password_hash || ''];
            const resultado = await pool.query(query, valores);
            return resultado.rows[0];
    }
}