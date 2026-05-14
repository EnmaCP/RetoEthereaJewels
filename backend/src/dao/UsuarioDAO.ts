
import { pool } from '../db.ts'; // Asegúrate de que db.ts exporte { pool }

export class UsuarioDAO {
    // Buscar por email o username (Para el login)
    static async buscarPorEmailOUsername(identifier: string) {
        const query = 'SELECT * FROM usuario WHERE nombre_usuario = $1 OR email = $1';
        const result = await pool.query(query, [identifier]);
        return result.rows[0];
    }

    // Obtener todos los usuarios (Para la intranet)
    static async obtenerTodos() {
        const query = 'SELECT id, nombre_usuario, email, rol, active, created_at FROM usuario';
        const resultado = await pool.query(query);
        return resultado.rows;
    }

    // Crear nuevo usuario (Para el registro)
    static async crearUsuario(nombre_usuario: string, email: string, password_hash: string) {
        const query = `
            INSERT INTO usuario (nombre_usuario, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING id, nombre_usuario, email, rol
        `;
        const valores = [nombre_usuario, email, password_hash];
        const resultado = await pool.query(query, valores);
        return resultado.rows[0];
    }
}

/*import { pool } from '../db.ts';

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
    static async crearUsuario(nombre_usuario: string, email: string, password_hash: string): Promise<Usuario> {
        const query = `
            INSERT INTO usuario (nombre_usuario, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING id, nombre_usuario, email, rol
            `;
            const valores = [nombre_usuario, email, password_hash];
            const resultado = await pool.query(query, valores);
            return resultado.rows[0];
    }
}*/