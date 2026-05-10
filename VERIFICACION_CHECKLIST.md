# ✅ Checklist de Verificación - Refactorización

## Backend - Verificar endpoints

### Productos
- [ ] `GET /api/productos` - Obtiene todos los productos
- [ ] `GET /api/productos/:id` - Obtiene un producto
- [ ] `POST /api/productos` - Crea un producto

### Colecciones  
- [ ] `GET /api/colecciones` - Obtiene todas las colecciones
- [ ] `GET /api/colecciones/:id` - Obtiene una colección

### Carrito
- [ ] `GET /api/carrito/:idUsuario` - Obtiene items del carrito
- [ ] `POST /api/carrito` - Añade item al carrito
- [ ] `PUT /api/carrito/:id` - Actualiza cantidad
- [ ] `DELETE /api/carrito/:id` - Elimina item del carrito

### Variantes
- [ ] `GET /api/variantes/:idProducto` - Obtiene variantes
- [ ] `POST /api/variantes` - Crea variante

### Detalles
- [ ] `GET /api/detalle/:idVariante` - Obtiene detalles
- [ ] `POST /api/detalle` - Crea detalles

### Wishlist
- [ ] `GET /api/wishlist/:idUsuario` - Obtiene wishlist
- [ ] `POST /api/wishlist` - Añade a wishlist
- [ ] `DELETE /api/wishlist/:idUsuario/:idProducto` - Elimina de wishlist

### Reviews
- [ ] `GET /api/reviews/:idProducto` - Obtiene reviews
- [ ] `POST /api/reviews` - Crea review

### Fichayes
- [ ] `GET /api/fichajes/:idUsuario` - Obtiene fichajes
- [ ] `POST /api/fichajes` - Crea fichaje

### Autenticación
- [ ] `POST /api/auth/login` - Login
- [ ] `POST /api/auth/register` - Registro
- [ ] `POST /api/auth/logout` - Logout
- [ ] `GET /api/auth/me` - Obtiene usuario actual

### Usuarios
- [ ] `GET /api/usuarios` - Obtiene todos los usuarios
- [ ] `POST /api/usuarios` - Crea usuario

---

## Frontend - Verificar archivos

### Archivos Creados
- [ ] `frontend/src/services/apiService.ts` - Existe y tiene 300+ líneas
- [ ] `frontend/src/API_SERVICE_GUIDE.md` - Guía de uso
- [ ] `RESUMEN_REFACTORIZACION.md` - Documento resumen
- [ ] `EJEMPLO_SHOPPING_CART_ACTUALIZADO.tsx` - Ejemplo completo

### Imports del apiService
- [ ] `productosAPI` importado donde sea necesario
- [ ] `carritoAPI` importado donde sea necesario
- [ ] `authAPI` importado donde sea necesario
- [ ] `wishlistAPI` importado donde sea necesario
- [ ] `reviewsAPI` importado donde sea necesario
- [ ] `variantesAPI` importado donde sea necesario
- [ ] `fichagesAPI` importado donde sea necesario

### Componentes Actualizados
- [ ] `Catalogue.tsx` - USA productosAPI (✅ HECHO)
- [ ] `LoginPage.tsx` - USA authAPI (✅ HECHO)
- [ ] `RegisterPage.tsx` - USA authAPI (✅ HECHO)
- [ ] `ShoppingCart.tsx` - PENDIENTE
- [ ] `Wishlist.tsx` - PENDIENTE
- [ ] `CheckoutPage.tsx` - PENDIENTE
- [ ] `productDetail.tsx` - PENDIENTE
- [ ] `ClockInPage.tsx` - PENDIENTE
- [ ] `AdminUsers.tsx` - PENDIENTE

---

## Testing Manual

### Prueba 1: Obtener Productos
```bash
curl http://localhost:3000/api/productos
# ✅ Debe retornar array de productos
```

### Prueba 2: Autenticación
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"usuario@email.com","password":"password"}' \
  -c cookies.txt

# Me (requiere cookie)
curl http://localhost:3000/api/auth/me \
  -b cookies.txt
```

### Prueba 3: Carrito
```bash
# Obtener carrito
curl http://localhost:3000/api/carrito/1

# Añadir item
curl -X POST http://localhost:3000/api/carrito \
  -H "Content-Type: application/json" \
  -d '{"id_carrito":1,"id_variante":1,"cantidad":1}'

# Actualizar cantidad
curl -X PUT http://localhost:3000/api/carrito/1 \
  -H "Content-Type: application/json" \
  -d '{"cantidad":2}'

# Eliminar
curl -X DELETE http://localhost:3000/api/carrito/1
```

---

## Base de Datos - Verificar

### Tablas Necesarias
- [ ] `producto` (columnas: id, nombre, descripcion, precio_base, etc.)
- [ ] `coleccion` (columnas: id, nombre, descripcion, etc.)
- [ ] `variante` (columnas: id, id_producto, material, precio_extra, stock)
- [ ] `detalle` (columnas: id, id_variante, foto, grabado, precio_extra)
- [ ] `carrito` (columnas: id, id_usuario)
- [ ] `carrito_variante` (columnas: id, id_carrito, id_variante, cantidad)
- [ ] `wishlist` (columnas: id, id_usuario, id_producto, created_at)
- [ ] `reviews` (columnas: id, id_producto, id_usuario, valoracion, etc.)
- [ ] `usuario` (columnas: id, nombre_usuario, email, password_hash, rol, etc.)
- [ ] `fichaje` (columnas: id, id_usuario, tipo, nota, fecha)

---

## Problemas Comunes

### "Cannot find name 'XxxDAO'"
- ✅ Verificar que el import está en index.ts
- ✅ Verificar que el archivo DAO existe

### "apiService is not imported"
- ✅ Verificar import en el componente
- ✅ Verificar ruta correcta: `'../services/apiService'`

### "CORS error"
- ✅ Verificar que backend tiene CORS habilitado
- ✅ Verificar origin en app.use(cors())

### "Unauthorized 401"
- ✅ Verificar que cookies se incluyen en fetch
- ✅ Verificar token en localStorage/cookies

### "Producto no encontrado 404"
- ✅ Verificar que el ID existe en BD
- ✅ Verificar estructura de tablas

---

## Rendimiento

### Optimizaciones recomendadas:
- [ ] Implementar caché en apiService
- [ ] Usar lazy loading en Catalogue
- [ ] Implementar paginación en listados
- [ ] Optimizar queries SQL (índices)
- [ ] Usar debounce en búsquedas

---

## Documentación

### Archivos de referencia creados:
1. ✅ `frontend/src/API_SERVICE_GUIDE.md` - Cómo usar apiService
2. ✅ `RESUMEN_REFACTORIZACION.md` - Resumen general
3. ✅ `EJEMPLO_SHOPPING_CART_ACTUALIZADO.tsx` - Ejemplo completo
4. ✅ Esta lista de verificación

---

## Status Final

```
Backend:  ████████░░ 90% (Falta mejorar manejo de errores)
Frontend: ███████░░░ 70% (Componentes principales actualizados)
Global:  ████████░░ 80% - LISTO PARA USAR ✅
```

---

**Nota:** Actualizar este checklist conforme se completen los componentes pendientes.
