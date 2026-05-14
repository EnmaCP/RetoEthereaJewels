export type RolUsuario = 'cliente' | 'empleado' | 'admin';
export type TipoFichaje = 'entrada' | 'salida';

export interface Usuario {
  id?: number; //Es opcional porque al crearlo aun no tiene ID
  nombre_usuario: string;
  email: string;
  password_hash: string;
  rol: RolUsuario;
  active?: boolean;
  created_at?: Date;
}

export interface Producto {
  id?: number;
  id_coleccion?: number | null; //Puede ser null por la regla ON DELETE SET NULL en la BD
  nombre: string;
  descripcion?: string;
  precio_base: number | string;
  imagen_url: string;
  active?: boolean;
  created_at?: Date;
  updated_at?: Date | null;
}

export interface Variante {
  id?: number;
  id_producto: number; //Obligatorio para asociarlo al producto
  material?: string;
  precio_extra?: number | string;
  stock?: number;
  url_imagen?: string;
}

export interface Coleccion {
  id?: number;
  nombre: string;
  descripcion?: string;
  launch_date?: Date;
  image_url?: string;
}

export interface Detalle {
  id?: number;
  id_variante: number;
  foto?: boolean; //Default false
  grabado?: boolean; //Default false
  precio_extra?: number | string;
}

export interface Wishlist {
  id?: number;
  id_usuario: number;
  id_producto: number;
  created_at?: Date;

}

export interface Carrito {
  id?: number;
  id_usuario: number;
  created_at?: Date;
  estado?: 'pendiente' | 'pagado' | 'entregado' | 'cancelado';
}

export interface CarritoVariante {
  id?: number;
  id_carrito: number;
  id_variante: number;
  cantidad?: number; //Default 1
  precio_final?: number | string;
}

export interface Fichaje {
  id?: number;
  id_usuario: number;
  tipo: TipoFichaje; //Restringido a 'entrada' o 'salida'
  nota?: string;
  fecha?: Date;
}

export interface Review{
  id?: number;
    id_producto: number;
    id_usuario: number;
    valoracion: number; 
    titulo?: string;
    comentario?: string;
    created_at?: Date;
}

