import express from "express";
import type { NextFunction, Request, Response } from "express";
import type { Producto } from "./types.ts";
import cors from "cors";
import { pool } from "./db.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { UsuarioDAO } from "./dao/UsuarioDAO.ts";
import { VarianteDAO } from "./dao/VarianteDAO.ts";
import { ReviewDAO } from "./dao/ReviewDAO.ts";
import { ColeccionDAO } from "./dao/ColeccionDAO.ts";
import { ProductoDAO } from "./dao/ProductoDAO.ts";
import { CarritoVarianteDAO } from "./dao/CarritoVarianteDAO.ts";
import { WishlistDAO } from "./dao/WishlistDAO.ts";
import { FichajeDAO } from "./dao/FichajeDAO.ts";
import { DetalleDAO } from "./dao/DetalleDAO.ts";
import { parse } from "node:path";


const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET ?? "EsFanaticaDeLosPatitosDeGomadeGFT123";


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


//Obtener todas las colecciones
app.get('/api/colecciones', async (req: Request, res: Response) => {
  try {
    const colecciones = await ColeccionDAO.obtenerTodas();
    res.json(colecciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las colecciones" });
  }

});

//Crear un usuario
app.post("/api/usuarios", async (req: Request, res: Response) => {
  try {
    const { nombre_usuario, email, password } = req.body;
    const nuevoUsuario = await UsuarioDAO.crearUsuario(nombre_usuario, email, password);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el usuario" });
  }
});

// Ruta para obtener todos los usuarios
app.get('/api/usuarios', async (req: Request, res: Response) => {
  try {
    const usuarios = await UsuarioDAO.obtenerTodos();
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//Ver las variantes de un producto en concreto
app.get("/api/productos/variantes/:idProducto", async (req: Request<{ idProducto: string }>, res: Response) => {
  try {
    const idProducto = parseInt(req.params.idProducto);
    const variantes = await VarianteDAO.obtenerPorProducto(idProducto);
    res.json(variantes);
  } catch (error) {
    console.error('Error al obtener variantes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//Ver las reviews de un producto en concreto
app.get("/api/reviews/:idProducto", async (req: Request<{ idProducto: string }>, res: Response) => {
  try {
    const idProducto = parseInt(req.params.idProducto);
    const reviews = await ReviewDAO.obtenerPorProducto(idProducto);
    res.json(reviews);
  } catch (error) {
    console.error('Error al obtener reviews:', error);
    res.status(500).json({ error: 'Error al obtener las reseñas' });
  }
});

//Crear una review para un producto
app.post("/api/reviews", async (req: Request, res: Response) => {
  try {
    //donde el frontend nos manda los datos de la review
    const nuevaReview = req.body;
    //se la pasamos al DAO para que la guarde en la base de datos
    const reviewCreada = await ReviewDAO.crear(nuevaReview);
    //Respondemos con estado de creado con exito
    res.status(201).json(reviewCreada);
  } catch (error) {
    console.error('Error al crear la review:', error);
    res.status(500).json({ error: 'Error al crear la reseña' });
  }
});

//Obtener todos los productos (para el catálogo)
app.get("/api/productos", async (req: Request, res: Response) => {
  try {
    const productos = await ProductoDAO.obtenerTodos();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

//Obtener un producto específico con sus variantes 
app.get("/api/productos/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const producto = await ProductoDAO.obtenerPorId(id);
    if (producto) {
      res.json(producto);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  }
  catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

//Crear un nuevo producto
app.post("/api/productos", async (req: Request, res: Response) => {
  try {
    const nuevoProducto = req.body;
    const productoCreado = await ProductoDAO.crear(nuevoProducto);
    res.status(201).json(productoCreado);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});


//Ver el carrito de un usuario
app.get("/api/carrito/:idUsuario", async (req: Request<{ idUsuario: string }>, res: Response) => {
  try {
    const idUsuario = parseInt(req.params.idUsuario);
    const itemsCarrito = await CarritoVarianteDAO.obtenerPorUsuario(idUsuario);
    res.json(itemsCarrito);
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

//Añadir item al carrito
// --- CARRITO ---
app.post("/api/carrito", async (req, res) => {
    const { id_carrito, id_variante, cantidad } = req.body;
    try {
        const item = await CarritoVarianteDAO.añadirItem(id_carrito, id_variante, cantidad);
        res.status(201).json(item);
    } catch (e) { res.status(500).json({ error: "Error al añadir" }); }
});

//Eliminar item del carrito
app.delete("/api/carrito/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await CarritoVarianteDAO.eliminarItem(id);
    res.json({ message: 'Item eliminado del carrito' });
  } catch (error) {
    console.error('Error al eliminar item del carrito:', error);
    res.status(500).json({ error: 'Error al eliminar item del carrito' });
  }
});

//Actualizar cantidad de un item en el carrito
app.put("/api/carrito/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { cantidad } = req.body;
    if (!cantidad || cantidad < 1) {
      return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
    }
    const itemActualizado = await CarritoVarianteDAO.actualizarCantidad(id, cantidad);
    res.json(itemActualizado);
  } catch (error) {
    console.error('Error al actualizar cantidad del carrito:', error);
    res.status(500).json({ error: 'Error al actualizar cantidad del carrito' });
  }
});

//Obtener variantes de un producto
app.get("/api/variantes/:idProducto", async (req: Request<{ idProducto: string }>, res: Response) => {
  try {
    const idProducto = parseInt(req.params.idProducto);
    const variantes = await VarianteDAO.obtenerPorProducto(idProducto);
    res.json(variantes);
  } catch (error) {
    console.error('Error al obtener variantes:', error);
    res.status(500).json({ error: 'Error al obtener las variantes' });
  }
});

//Crear una variante
app.post("/api/variantes", async (req: Request, res: Response) => {
  try {
    const { id_producto, material, precio_extra, stock, url_imagen } = req.body;
    if (!id_producto) {
      return res.status(400).json({ error: 'id_producto es obligatorio' });
    }
    const nuevaVariante = await VarianteDAO.crear({
      id_producto,
      material,
      precio_extra,
      stock,
      url_imagen
    });
    res.status(201).json(nuevaVariante);
  } catch (error) {
    console.error('Error al crear variante:', error);
    res.status(500).json({ error: 'Error al crear la variante' });
  }
});

//Obtener detalles de una variante
app.get("/api/detalle/:idVariante", async (req: Request<{ idVariante: string }>, res: Response) => {
  try {
    const idVariante = parseInt(req.params.idVariante);
    const detalle = await DetalleDAO.obtenerPorVariante(idVariante);
    res.json(detalle);
  } catch (error) {
    console.error('Error al obtener detalle:', error);
    res.status(500).json({ error: 'Error al obtener el detalle' });
  }
});

//Crear detalle de una variante
app.post("/api/detalle", async (req: Request, res: Response) => {
  try {
    const { id_variante, foto, grabado, precio_extra } = req.body;
    if (!id_variante) {
      return res.status(400).json({ error: 'id_variante es obligatorio' });
    }
    const nuevoDetalle = await DetalleDAO.crear({
      id_variante,
      foto,
      grabado,
      precio_extra
    });
    res.status(201).json(nuevoDetalle);
  } catch (error) {
    console.error('Error al crear detalle:', error);
    res.status(500).json({ error: 'Error al crear el detalle' });
  }
});

//Obtener wishlist de un usuario
app.get("/api/wishlist/:idUsuario", async (req: Request<{ idUsuario: string }>, res: Response) => {
  try {
    const idUsuario = parseInt(req.params.idUsuario);
    const wishlist = await WishlistDAO.obtenerPorUsuario(idUsuario); // ← USA DAO
    res.json(wishlist);
  } catch (error) {
    console.error('Error al obtener wishlist:', error);
    res.status(500).json({ error: 'Error al obtener la lista de deseos' });
  }
});

//Añadir a wishlist
app.post("/api/wishlist", async (req: Request, res: Response) => {
  try {
    const { id_usuario, id_producto } = req.body;
    if (!id_usuario || !id_producto) {
      return res.status(400).json({ error: 'id_usuario e id_producto son obligatorios' });
    }
    const nuevoItem = await WishlistDAO.añadir(id_usuario, id_producto); // ← USA DAO
    res.status(201).json(nuevoItem);
  } catch (error) {
    console.error('Error al añadir a wishlist:', error);
    res.status(500).json({ error: 'Error al añadir a la lista de deseos' });
  }
});

//Eliminar de wishlist
app.delete("/api/wishlist/:idUsuario/:idProducto", async (req: Request<{ idUsuario: string, idProducto: string }>, res: Response) => {
  try {
    const idUsuario = parseInt(req.params.idUsuario);
    const idProducto = parseInt(req.params.idProducto);
    await WishlistDAO.eliminar(idUsuario, idProducto); // ← USA DAO
    res.json({ message: 'Producto eliminado de la lista de deseos' });
  } catch (error) {
    console.error('Error al eliminar de wishlist:', error);
    res.status(500).json({ error: 'Error al eliminar de la lista de deseos' });
  }
});

//Obtener fichajes de un empleado
app.get("/api/fichajes/:idUsuario", async (req: Request<{ idUsuario: string }>, res: Response) => {
  try {
    const idUsuario = parseInt(req.params.idUsuario);
    const fichajes = await FichajeDAO.obtenerPorUsuario(idUsuario);
    res.json(fichajes);
  } catch (error) {
    console.error('Error al obtener fichajes:', error);
    res.status(500).json({ error: 'Error al obtener los fichajes' });
  }
});

//Crear fichaje
app.post("/api/fichajes", async (req: Request, res: Response) => {
  try {
    const { id_usuario, tipo, nota } = req.body;
    if (!id_usuario || !tipo) {
      return res.status(400).json({ error: 'id_usuario y tipo son obligatorios' });
    }
    const nuevoFichaje = await FichajeDAO.crear({
      id_usuario,
      tipo,
      nota
    });
    res.status(201).json(nuevoFichaje);
  } catch (error) {
    console.error('Error al crear fichaje:', error);
    res.status(500).json({ error: 'Error al crear el fichaje' });
  }
});

interface AuthRequest extends Request {
  customer?: { id: number, username: string, role: string };
}
const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {

  let token = req.cookies.token;

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }


  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decodedPayload = jwt.verify(token, JWT_SECRET) as {
      id: number, username: string, role: string
    };
    req.customer = decodedPayload;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token malformado o expirado" });
    return;
  }
};
const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.customer) {
      return res.status(401).json({ error: "Acceso denegado: No estás autenticado" });
    }
    if (!roles.includes(req.customer.role)) {
      return res.status(403).json({ error: "Acceso denegado: No tienes permisos suficientes" });
    }
    next();
  };
};

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Backend de la tienda funcionando correctamente AAAAAAAAAAAAAA");
});

app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Hola desde el backend" });
});

app.get("/api/test", async (req: Request, res: Response) => {
  const result = await pool.query("SELECT NOW()");
  res.json({ connected: true, time: result.rows[0].now });
});
/*
app.get("/api/products", async (req: Request, res: Response) => {
  try {

    const result = await pool.query('SELECT id, name, description, price, category, stock, image_url AS "imageUrl", (SELECT AVG(rating) FROM reviews WHERE product_id = products.id) AS "avgRating" FROM products WHERE deleted_at IS NULL AND active = true ORDER BY id'
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});
app.get("/api/products/inactive", async (req: Request, res: Response) => {
  const result = await pool.query('SELECT * FROM products WHERE active = false AND deleted_at IS NULL ORDER BY id');
  res.json(result.rows);
});

app.get("/api/products/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query('SELECT id, name, description, price, category, stock, image_url AS "imageUrl" FROM products WHERE id = $1 AND active = true AND deleted_at IS NULL', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});
app.post("/api/products", verifyToken, requireRole("admin"), async (req: Request<{}, {}, { name: string, description?: string, price: number, category?: string, stock?: number, imageUrl?: string }>, res: Response) => {

  const { name, description, price, category, stock, imageUrl } = req.body;

  if (!name) return res.status(400).json({ message: "Nombre es obligatorio" });
  if (price == undefined || price <= 0) return res.status(400).json({ message: "Precio es obligatorio y debe ser mayor a 0" });
  if (stock !== undefined && stock < 0) return res.status(400).json({ message: "Stock es obligatorio y debe ser mayor o igual a 0" });

  const finalDescription = description ?? "";
  const finalCategory = category ?? "General";
  const finalStock = stock ?? 0;
  const finalImageUrl = imageUrl ?? `https://placehold.co/200x200?text=${encodeURIComponent(name)}`;

  const result = await pool.query(
    'INSERT INTO products (name, description, price, category, stock, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, description, price, category, stock, image_url AS "imageUrl"',
    [name, finalDescription, price, finalCategory, finalStock, finalImageUrl]
  );

  res.status(201).json({ message: "Producto creado correctamente", product: result.rows[0] });
});



app.put("/api/products/:id", verifyToken, requireRole("admin"), async (req: Request<{ id: string }>, res: Response) => {
  const { name, description, price, stock, image_url, active } = req.body;
  const productId = parseInt(req.params.id);

  if (!name || price === undefined || stock === undefined || active === undefined) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const result = await pool.query(
      `UPDATE products 
             SET name = $1, description = $2, price = $3, stock = $4, image_url = $5, active = $6 
             WHERE id = $7 RETURNING *`,
      [name, description || "", price, stock, image_url || "", active, productId]
    );

    if (result.rowCount === 0) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error actualizando producto:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});
app.patch("/api/products/:id/stock", verifyToken, requireRole("admin", "employee"), async (req: Request<{ id: string }>, res: Response) => {
  const { stock } = req.body;
  const productId = parseInt(req.params.id);

  if (typeof stock !== 'number' || stock < 0) {
    return res.status(400).json({ error: "Stock inválido" });
  }

  try {
    const result = await pool.query(
      "UPDATE products SET stock = $1 WHERE id = $2 RETURNING *",
      [stock, productId]
    );

    if (result.rowCount === 0) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error actualizando stock:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

app.delete("/api/products/:id", verifyToken, requireRole("admin"), async (req: Request<{ id: string }>, res: Response) => {
  const inOrders = await pool.query('SELECT * FROM order_items WHERE product_id = $1', [req.params.id]);
  if (inOrders.rows.length > 0) {
    const result = await pool.query('UPDATE products SET deleted_at= NOW() WHERE id=$1 AND deleted_at IS NULL RETURNING id, name, description, price, category, stock, image_url AS "imageUrl"', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    return res.json({ message: "Producto eliminado(soft)", product: result.rows[0] });
  } else {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    return res.json({ message: "Producto eliminado definitivamente" });
  }
});

app.patch("/api/products/:id/toggle", verifyToken, requireRole("admin"), async (req: Request<{ id: string }>, res: Response) => {
  const user = (req as AuthRequest).customer!;
  if (user.role !== "admin") {
    return res.status(403).json({ error: "No tienes permiso para realizar esta accion" });
  }
  const result = await pool.query(
    'UPDATE products SET active = NOT active WHERE id = $1 RETURNING id, name, description, price, category, stock, image_url AS "imageUrl"',
    [req.params.id]
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  const p = result.rows[0];
  res.json({ message: p.active ? "Producto activado" : "Producto desactivado", product: p });
});*/

app.get("/api/orders", verifyToken, requireRole("employee", "admin"), async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, status, address, created_at
      FROM orders
      ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: "No tienes permiso para realizar esta accion" });
  }
});

app.post("/api/cart/checkout", verifyToken, async (req: AuthRequest, res: Response) => {
  const userId = req.customer!.id;
  const { items, direccion } = req.body; // Cambiado 'address' por 'direccion' para coincidir con el Frontend

  if (!items || items.length === 0) return res.status(400).json({ error: "El carrito está vacío" });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Crear el nuevo carrito (pedido)
    const newCartRes = await client.query(
      "INSERT INTO carrito (id_usuario, estado, direccion) VALUES ($1, 'PAGADO', $2) RETURNING id",
      [userId, direccion]
    );
    const cartId = newCartRes.rows[0].id;

    // 2. Insertar productos y actualizar stock
    for (const item of items) {
      // IMPORTANTE: El frontend envía 'id_variante' y 'cantidad'
      const idVariante = item.id_variante;
      const cantidad = item.cantidad;

      if (!idVariante) throw new Error("ID de variante no detectado en el item");

      await client.query(
        "INSERT INTO carrito_variante (id_carrito, id_variante, cantidad) VALUES ($1, $2, $3)",
        [cartId, idVariante, cantidad]
      );

      await client.query(
        "UPDATE variante SET stock = stock - $1 WHERE id = $2",
        [cantidad, idVariante]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ message: "¡Pedido realizado!", order: { id: cartId } });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Error detallado en checkout:", err);
    res.status(500).json({ error: "Error al procesar la compra en la base de datos" });
  } finally {
    client.release();
  }
});


// backend/src/index.ts
app.get("/api/orders/my", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.customer!.id;
    // Buscamos carritos pagados y calculamos el total al vuelo
    const result = await pool.query(`
      SELECT 
        c.id, 
        c.estado, 
        c.direccion, 
        c.created_at,
        COALESCE(SUM(cv.cantidad * p.precio_base), 0) as total_calculado
      FROM carrito c
      LEFT JOIN carrito_variante cv ON c.id = cv.id_carrito
      LEFT JOIN producto p ON cv.id_variante = p.id
      WHERE c.id_usuario = $1 AND c.estado = 'PAGADO'
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener el historial" });
  }
});

app.get("/api/orders/:id", async (req: Request<{ id: string }>, res: Response) => {
  const orderId = parseInt(req.params.id);
  const orderResult = await pool.query('SELECT * FROM carrito WHERE id = $1', [orderId]);
  if (orderResult.rows.length === 0) {
    return res.status(404).json({ error: "Pedido no encontrado" });
  }
  const itemsResult = await pool.query(`
        SELECT cv.cantidad, p.precio_base, (cv.cantidad * p.precio_base) as subtotal, 
               p.nombre, p.imagen_url 
        FROM carrito_variante cv 
        JOIN producto p ON cv.id_variante = p.id 
        WHERE cv.id_carrito = $1
    `, [orderId]);
  res.json({ ...orderResult.rows[0], items: itemsResult.rows });
});

// PATCH para actualizar el estado del pedido :)
app.patch("/api/orders/:id/status", verifyToken, requireRole("admin", "employee"), async (req: AuthRequest, res: Response) => {
  try {
    const orderId = parseInt((req.params as any).id);
    const { status } = req.body;

    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Estado no válido" });
    }
    const result = await pool.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [status, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar el estado del pedido" });
  }
});

app.get("/api/products/:id/reviews", async (req: Request<{ id: string }>, res: Response) => {
  const productId = parseInt(req.params.id);

  const result = await pool.query('SELECT r.id, r.rating, r.comment, r.created_at, c.username FROM reviews r INNER JOIN customers c ON r.customer_id = c.id WHERE r.product_id = $1 ORDER BY r.created_at DESC', [productId]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "No hay reseñas" });
  }
  res.json(result.rows);
});


app.post("/api/products/:id/reviews", async (req, res) => {
  const productId = parseInt(req.params.id);
  const { rating, comment, customerId } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "La puntuación debe ser entre 1 y 5" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO reviews (product_id, customer_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [productId, customerId ?? 1, rating, comment ?? ""]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la reseña" });
  }
});
app.post("/api/auth/register", async (req: Request, res: Response) => {
  const { nombre_usuario, password, email } = req.body;
  if (!nombre_usuario || !password || !email) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const existingUser = await pool.query('SELECT * FROM usuario WHERE nombre_usuario = $1 OR email = $2', [nombre_usuario, email]);
  if (existingUser.rows.length > 0) {
    return res.status(400).json({ error: "El usuario ya existe" });
  }
  const result = await pool.query(
    'INSERT INTO usuario (nombre_usuario, email, password_hash) VALUES ($1, $2, $3) RETURNING id, nombre_usuario, email, rol',
    [nombre_usuario, email, passwordHash]
  );
  res.status(201).json({ message: "Usuario registrado correctamente", user: result.rows[0] });
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }
  const userResult = await pool.query(
    'SELECT * FROM usuario WHERE nombre_usuario = $1 OR email = $1',
    [identifier]
  );

  if (userResult.rows.length === 0) {
    return res.status(404).json({ error: "Credenciales incorrectas" });
  }

  const user = userResult.rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  // Frontend context and decoding expects 'username' and 'role' in token payload, 
  // so we map 'nombre_usuario' to 'username' and 'rol' to 'role'
  const tokenPayload = { id: user.id, username: user.nombre_usuario, role: user.rol || 'cliente' };
  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "2h" });

  res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 2 * 60 * 60 * 1000 });

  res.json({
    message: "Login exitoso!",
    customer: tokenPayload
  });
});

app.post("/api/auth/logout", (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logout exitoso" });
});





app.get("/api/clock/status", verifyToken, requireRole("employee", "admin"), async (req: AuthRequest, res: Response) => {
  try {
    const employeeId = req.customer!.id;
    if (isNaN(employeeId)) return res.status(400).json({ error: "employeeId is required" });

    const result = await pool.query(
      "SELECT type FROM clock_events WHERE employee_id = $1 ORDER BY recorded_at DESC LIMIT 1",
      [employeeId]
    );

    const isClockedIn = result.rows.length > 0 && result.rows[0].type === 'in';
    res.json({ isClockedIn });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error checking status" });
  }
});

app.post("/api/clock",
  verifyToken,
  requireRole("admin", "employee"),
  async (req: AuthRequest, res: Response) => {
    try {
      const { type, note } = req.body;
      const employeeId = req.customer!.id;

      const result = await pool.query(
        "INSERT INTO clock_events (employee_id, type, note) VALUES ($1, $2, $3) RETURNING *",
        [employeeId, type, note]
      );

      res.status(201).json({ message: "Fichaje registrado", event: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al registrar el fichaje" });
    }
  });
app.get("/api/clock/history", verifyToken,
  requireRole("admin", "employee"),
  async (req: AuthRequest, res: Response) => {
    try {
      const employeeId = req.customer!.id;

      const result = await pool.query(
        "SELECT id, type, recorded_at FROM clock_events WHERE employee_id = $1 ORDER BY recorded_at DESC",
        [employeeId]
      );
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al obtener el historial" });
    }
  });
app.get("/api/admin/users",
  verifyToken,
  requireRole("admin"),
  async (req: Request, res: Response) => {
    try {
      //lista todos los usuarios
      const result = await pool.query("SELECT id, nombre_usuario as username, email, rol as role, active, created_at FROM usuario");
      res.json(result.rows);


    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error getting users" });
    }
  });

app.patch("/api/admin/users/:id/role", verifyToken, requireRole("admin"), async (req: Request<{ id: string }>, res: Response) => {
  try {
    const employeeId = parseInt(req.params.id);
    const { role } = req.body;
    if (isNaN(employeeId)) return res.status(400).json({ error: "employeeId is required" });

    const result = await pool.query(
      "UPDATE usuario SET rol = $1 WHERE id = $2 RETURNING id, rol as role",
      [role, employeeId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating user role" });
  }
});

app.patch("/api/admin/users/:id/status", verifyToken, requireRole("admin"), async (req: Request<{ id: string }>, res: Response) => {
  try {
    const employeeId = parseInt(req.params.id);
    const { active } = req.body;
    if (isNaN(employeeId)) return res.status(400).json({ error: "employeeId is required" });

    const result = await pool.query(
      "UPDATE usuario SET active = $1 WHERE id = $2 RETURNING id, active",
      [active, employeeId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating user status" });
  }
});

app.get("/api/auth/user", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await pool.query("SELECT id, nombre_usuario as username, email, rol as role, active, created_at FROM usuario WHERE id = $1", [req.customer!.id]);
    res.json(user.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Credenciales invalidas" });
  }
})

app.get("/api/auth/me", verifyToken, async (req: AuthRequest, res: Response) => {
  try {

    if (!req.customer) {
      return res.status(401).json({ error: "No hay sesión activa" });
    }
    res.status(200).json({ customer: req.customer });

  } catch (error) {
    console.error("Error en /api/auth/me:", error);
    res.status(500).json({ error: "Error interno del servidor al verificar sesión" });
  }
});