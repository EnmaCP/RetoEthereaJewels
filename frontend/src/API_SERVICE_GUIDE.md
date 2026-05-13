# Guía de Uso - API Service

## Importación

```typescript
import { 
  productosAPI, 
  coleccionesAPI, 
  variantesAPI,
  detallesAPI,
  carritoAPI,
  wishlistAPI,
  reviewsAPI,
  usuariosAPI,
  fichagesAPI,
  authAPI
} from '../services/apiService';
```

## Ejemplos de Uso

### Productos
```typescript
// Obtener todos
const productos = await productosAPI.getAll();

// Obtener uno
const producto = await productosAPI.getById(1);

// Crear
await productosAPI.create({
  nombre: "Anillo",
  precio_base: 100,
  descripcion: "Anillo de oro",
  imagen_url: "url"
});

// Actualizar
await productosAPI.update(1, { nombre: "Anillo actualizado" });

// Eliminar
await productosAPI.delete(1);
```

### Carrito
```typescript
// Obtener carrito del usuario
const items = await carritoAPI.getByUsuario(userId);

// Añadir item
await carritoAPI.addItem(carritoId, varianteId, cantidad);

// Eliminar item
await carritoAPI.removeItem(itemId);
```

### Wishlist
```typescript
// Obtener wishlist
const items = await wishlistAPI.getByUsuario(userId);

// Añadir
await wishlistAPI.add(userId, productoId);

// Eliminar
await wishlistAPI.remove(userId, productoId);
```

### Reviews
```typescript
// Obtener reviews de un producto
const reviews = await reviewsAPI.getByProducto(productoId);

// Crear review
await reviewsAPI.create({
  id_producto: 1,
  id_usuario: 1,
  valoracion: 5,
  titulo: "Excelente",
  comentario: "Muy buen producto"
});
```

### Variantes
```typescript
// Obtener variantes de un producto
const variantes = await variantesAPI.getByProducto(productoId);

// Crear variante
await variantesAPI.create({
  id_producto: 1,
  material: "oro",
  precio_extra: 50,
  stock: 10
});
```

### Fichayes
```typescript
// Obtener fichajes de un empleado
const fichajes = await fichagesAPI.getByUsuario(userId);

// Crear fichaje (entrada/salida)
await fichagesAPI.create({
  id_usuario: 1,
  tipo: "in",
  nota: "Entrada"
});
```

### Autenticación
```typescript
// Login
const data = await authAPI.login("usuario@email.com", "password");

// Register
await authAPI.register("usuario", "email@email.com", "password");


// Logout
await authAPI.logout();

// Obtener usuario actual
const me = await authAPI.me();
```

## Manejo de Errores

```typescript
try {
  const data = await productosAPI.getAll();
} catch (error) {
  console.error("Error:", error.message);
  // Manejar error
}
```

## Uso en Componentes

```typescript
useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await productosAPI.getAll();
      setProducts(data);
    } catch (error) {
      console.error(error);
      setError("Error al cargar productos");
    }
  };
  fetchData();
}, []);
```

---

**Nota**: Todos los endpoints incluyen automáticamente:
- Headers `Content-Type: application/json`
- Credentials `include` (para cookies)
- Manejo de errores HTTP


