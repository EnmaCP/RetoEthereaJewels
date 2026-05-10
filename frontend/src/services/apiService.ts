const API_BASE_URL = 'http://localhost:3000/api';
//Usamos el apiService para centralizar todas las llamadas a la API, así mantenemos el código más limpio y organizado. Además, aquí podemos manejar errores de forma consistente y configurar opciones comunes para fetch, como headers y credentials.
// Configuración de fetch
const fetchOptions = (method: string = 'GET', body?: any): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  ...(body && { body: JSON.stringify(body) })
});

// Error handler
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
};

// ==================== PRODUCTOS ====================
export const productosAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/productos`, fetchOptions());
    return handleResponse(res);
  },
  getById: async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/productos/${id}`, fetchOptions());
    return handleResponse(res);
  },
  create: async (producto: any) => {
    const res = await fetch(`${API_BASE_URL}/productos`, fetchOptions('POST', producto));
    return handleResponse(res);
  },
  update: async (id: number, producto: any) => {
    const res = await fetch(`${API_BASE_URL}/productos/${id}`, fetchOptions('PUT', producto));
    return handleResponse(res);
  },
  delete: async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/productos/${id}`, fetchOptions('DELETE'));
    return handleResponse(res);
  }
};

// ==================== COLECCIONES ====================
export const coleccionesAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/colecciones`, fetchOptions());
    return handleResponse(res);
  },
  getById: async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/colecciones/${id}`, fetchOptions());
    return handleResponse(res);
  },
  create: async (coleccion: any) => {
    const res = await fetch(`${API_BASE_URL}/colecciones`, fetchOptions('POST', coleccion));
    return handleResponse(res);
  }
};

// ==================== VARIANTES ====================
export const variantesAPI = {
  getByProducto: async (idProducto: number) => {
    const res = await fetch(`${API_BASE_URL}/variantes/${idProducto}`, fetchOptions());
    return handleResponse(res);
  },
  create: async (variante: any) => {
    const res = await fetch(`${API_BASE_URL}/variantes`, fetchOptions('POST', variante));
    return handleResponse(res);
  }
};

// ==================== DETALLES ====================
export const detallesAPI = {
  getByVariante: async (idVariante: number) => {
    const res = await fetch(`${API_BASE_URL}/detalle/${idVariante}`, fetchOptions());
    return handleResponse(res);
  },
  create: async (detalle: any) => {
    const res = await fetch(`${API_BASE_URL}/detalle`, fetchOptions('POST', detalle));
    return handleResponse(res);
  }
};

// ==================== CARRITO ====================
export const carritoAPI = {
  getByUsuario: async (idUsuario: number) => {
    const res = await fetch(`${API_BASE_URL}/carrito/${idUsuario}`, fetchOptions());
    return handleResponse(res);
  },
  addItem: async (id_carrito: number, id_variante: number, cantidad?: number) => {
    const res = await fetch(`${API_BASE_URL}/carrito`, fetchOptions('POST', {
      id_carrito,
      id_variante,
      cantidad: cantidad || 1
    }));
    return handleResponse(res);
  },
  updateItem: async (id: number, cantidad: number) => {
    const res = await fetch(`${API_BASE_URL}/carrito/${id}`, fetchOptions('PUT', {
      cantidad
    }));
    return handleResponse(res);
  },
  removeItem: async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/carrito/${id}`, fetchOptions('DELETE'));
    return handleResponse(res);
  }
};

// ==================== WISHLIST ====================
export const wishlistAPI = {
  getByUsuario: async (idUsuario: number) => {
    const res = await fetch(`${API_BASE_URL}/wishlist/${idUsuario}`, fetchOptions());
    return handleResponse(res);
  },
  add: async (id_usuario: number, id_producto: number) => {
    const res = await fetch(`${API_BASE_URL}/wishlist`, fetchOptions('POST', {
      id_usuario,
      id_producto
    }));
    return handleResponse(res);
  },
  remove: async (idUsuario: number, idProducto: number) => {
    const res = await fetch(`${API_BASE_URL}/wishlist/${idUsuario}/${idProducto}`, fetchOptions('DELETE'));
    return handleResponse(res);
  }
};

// ==================== REVIEWS ====================
export const reviewsAPI = {
  getByProducto: async (idProducto: number) => {
    const res = await fetch(`${API_BASE_URL}/reviews/${idProducto}`, fetchOptions());
    return handleResponse(res);
  },
  create: async (review: any) => {
    const res = await fetch(`${API_BASE_URL}/reviews`, fetchOptions('POST', review));
    return handleResponse(res);
  }
};

// ==================== USUARIOS ====================
export const usuariosAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/usuarios`, fetchOptions());
    return handleResponse(res);
  },
  getById: async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/usuarios/${id}`, fetchOptions());
    return handleResponse(res);
  },
  create: async (usuario: any) => {
    const res = await fetch(`${API_BASE_URL}/usuarios`, fetchOptions('POST', usuario));
    return handleResponse(res);
  }
};

// ==================== FICHAJES ====================
export const fichagesAPI = {
  getByUsuario: async (idUsuario: number) => {
    const res = await fetch(`${API_BASE_URL}/fichajes/${idUsuario}`, fetchOptions());
    return handleResponse(res);
  },
  create: async (fichaje: any) => {
    const res = await fetch(`${API_BASE_URL}/fichajes`, fetchOptions('POST', fichaje));
    return handleResponse(res);
  }
};

// ==================== AUTENTICACIÓN ====================
export const authAPI = {
  login: async (identifier: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, fetchOptions('POST', {
      identifier,
      password
    }));
    return handleResponse(res);
  },
  register: async (nombre_usuario: string, email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, fetchOptions('POST', {
      nombre_usuario,
      email,
      password
    }));
    return handleResponse(res);
  },
  logout: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/logout`, fetchOptions('POST'));
    return handleResponse(res);
  },
  me: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, fetchOptions());
    return handleResponse(res);
  }
};
