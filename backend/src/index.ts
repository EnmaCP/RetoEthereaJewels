import express from "express";
import type { NextFunction, Request, Response } from "express";
import type { Product } from "./types.ts";
import cors from "cors";
import { pool } from "./db.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET ?? "EsFanaticaDeLosPatitosDeGomadeGFT123";


app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

interface AuthRequest extends Request{
  customer?: {id:number, username: string, role: string};
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
/*
app.put("/api/products/:id",verifyToken,requireRole("admin", "employee"), async (req: Request<{ id: string }, {}, { stock: number }>, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { stock } = req.body;

        if (stock === undefined || stock < 0) {
            return res.status(400).json({ error: "Stock es obligatorio y debe ser mayor o igual a 0" });
        }

        const result = await pool.query(
            'UPDATE products SET stock = $1 WHERE id = $2 RETURNING id, name, description, price, category, stock, image_url AS "imageUrl"',
            [stock, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json({ message: "Producto actualizado correctamente", product: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
});*/
/*
app.delete("/api/products/:id", async (req: Request<{id: string}>, res: Response) => {
    try {
        const result = await pool.query('DELETE FROM products WHERE id = $1 LIMIT 1', [parseInt(req.params.id)]);

        if(result.rows.length === 0){
            return res.status(404).json({error: "Producto no encontrado"});
        }
        
        res.json({message: "Producto eliminado", product: result.rows[0]});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});*/
app.put("/api/products/:id", verifyToken, requireRole("admin"), async (req: Request<{id:string}>, res: Response) => {
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
app.patch("/api/products/:id/stock", verifyToken, requireRole("admin", "employee"), async (req: Request<{id:string}>, res: Response) => {
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

app.delete("/api/products/:id",verifyToken,requireRole("admin"), async (req: Request<{ id: string }>, res: Response) => {
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

app.patch("/api/products/:id/toggle",verifyToken,requireRole("admin"), async (req: Request<{ id: string }>, res: Response) => {
    const user = (req as AuthRequest).customer!;
    if(user.role !== "admin"){
        return res.status(403).json({error: "No tienes permiso para realizar esta accion"});
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
});

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
app.post("/api/orders", verifyToken, async (req: AuthRequest, res: Response) => {
    const { items, address } = req.body;
    
    if (!items || items.length === 0) return res.status(400).json({ error: "El carrito está vacío" });
    if (!address) return res.status(400).json({ error: "La dirección es obligatoria" });

    const customerId = req.customer!.id; 

    for (const item of items) {
        const check = await pool.query(
            `SELECT stock, name FROM products WHERE id = $1 AND deleted_at IS NULL AND active = TRUE`,
            [item.productId]
        );
        if (check.rows.length === 0) return res.status(404).json({ error: `Producto ${item.productId} no encontrado` });
        if (check.rows[0].stock < item.quantity) {
            return res.status(409).json({ error: `Stock insuficiente para "${check.rows[0].name}" (disponible: ${check.rows[0].stock})` });
        }
    }   
    
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        
        const orderResult = await client.query(
            `INSERT INTO orders (customer_id, status, address) VALUES ($1, 'pending', $2) RETURNING *`,
            [customerId, address]
        );
        const orderId = orderResult.rows[0].id;
        
        for (const item of items) {
            await client.query(
                `INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)`,
                [orderId, item.productId, item.quantity, item.unitPrice]
            );
            await client.query(
                "UPDATE products SET stock = stock - $1 WHERE id = $2",
                [item.quantity, item.productId]
            );
        }
        await client.query("COMMIT");
        res.status(201).json({ message: "Pedido creado", order: orderResult.rows[0] });
    } catch (err: any) {
        console.error("Error en transacción POST /api/orders:", err);
        await client.query("ROLLBACK");
        res.status(500).json({ error: "Error al crear el pedido" });
    } finally {
        client.release();
    }
});
app.get("/api/orders/my", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const customerId = req.customer!.id; 
    const result = await pool.query(`
      SELECT o.id, o.status, o.address, o.created_at, SUM(oi.quantity * oi.unit_price) as total
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.customer_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [customerId]);
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener tus pedidos" });
  }
});
app.get("/api/orders/:id", async (req: Request<{ id: string }>, res: Response) => {
    const orderId = parseInt(req.params.id);
    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    if (orderResult.rows.length === 0) {
        return res.status(404).json({ error: "Pedido no encontrado" });
    }
    const itemsResult = await pool.query(`
        SELECT oi.quantity, oi.unit_price, (oi.quantity * oi.unit_price) as subtotal, 
               p.name, p.image_url 
        FROM order_items oi 
        JOIN products p ON oi.product_id = p.id 
        WHERE oi.order_id = $1
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
    /* Ya no es necesario - TAREA 2
    app.get("/api/orders/customer/:customerId", async (req, res) => {
      try {
        const { customerId } = req.params;
        const result = await pool.query(`
        SELECT o.id, o.status, o.address, o.created_at, SUM(oi.quantity * oi.unit_price) as total
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.customer_id = $1
        GROUP BY o.id
        ORDER BY o.created_at DESC
        `, [customerId]);
        res.json(result.rows);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener los pedidos" });
      }
    });
    const total = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const orderResult = await client.query(
            `INSERT INTO orders
            (customer_id, status, total, address)
            VALUES ($1, 'pending', $2, $3)
            RETURNING *`,
            [1, Math.round(total * 100) / 100, address]
        );
        const orderId = orderResult.rows[0].id;
        for (const item of items) {
            await client.query(
                `INSERT INTO order_items
                (order_id, product_id, quantity, unit_price)
                VALUES ($1, $2, $3, $4)`,
                [orderId, item.productId, item.quantity, item.unitPrice]
            );
            await client.query(
                "UPDATE products SET stock = stock - $1 WHERE id = $2",
                [item.quantity, item.productId]
            );
        }
        await client.query("COMMIT");
        res.status(201).json({ message: "Pedido creado", order: orderResult.rows[0] });
    } catch (err: any) {
        console.error("Error en transacción POST /api/orders:", err);
        await client.query("ROLLBACK");
        res.status(500).json({ error: "Error al crear el pedido: " + (err.message || "") });
    } finally {
        client.release();
    }
});*/
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
app.post("/api/auth/register", async(req:Request<{},{},{username:string,password:string,email:string, full_name:string}>,res:Response) => {
  const {username,password,email,full_name} = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const existingUser = await pool.query('SELECT * FROM customers WHERE username = $1 OR email = $2', [username, email]);
  if(existingUser.rows.length > 0){
    return res.status(400).json({message: "El usuario ya existe"});
  }
  const result = await pool.query(
    'INSERT INTO customers (username, password_hash, email, full_name) VALUES ($1, $2, $3, $4) RETURNING id, username, email, full_name',
    [username, passwordHash, email, full_name]
  );
  res.status(201).json({ message: "Usuario registrado correctamente", user: result.rows[0] });
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }
  const userResult = await pool.query(
    'SELECT * FROM customers WHERE username = $1 OR email = $1', 
    [identifier]
  );
  
  if (userResult.rows.length === 0) {
    return res.status(404).json({ message: "Credenciales incorrectas" });
  }

  const user = userResult.rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    return res.status(404).json({ message: "Credenciales inválidas" });
  }

  const tokenPayload = { id: user.id, username: user.username, role: user.role };
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





app.get("/api/clock/status", verifyToken,requireRole("employee", "admin"), async (req:AuthRequest,res:Response)=>{
  try {
    const employeeId =req.customer!.id;
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
  async (req:Request,res:Response)=>{
  try {
    //lista todos los usuarios
    const result = await pool.query("SELECT * FROM customers");
    res.json(result.rows);
    
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error getting users" });
  }
});

app.patch("/api/admin/users/:id/role", verifyToken,requireRole("admin"), async (req:Request<{id: string}>,res:Response)=>{
  try {
    const employeeId = parseInt(req.params.id);
    const { role } = req.body;
    if (isNaN(employeeId)) return res.status(400).json({ error: "employeeId is required" });

    const result = await pool.query(
      "UPDATE customers SET role = $1 WHERE id = $2 RETURNING id, role",
      [role, employeeId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating user role" });
  }
});

app.patch("/api/admin/users/:id/status", verifyToken,requireRole("admin"), async (req:Request<{id: string}>,res:Response)=>{
  try {
    const employeeId = parseInt(req.params.id);
    const { active } = req.body;
    if (isNaN(employeeId)) return res.status(400).json({ error: "employeeId is required" });

    const result = await pool.query(
      "UPDATE customers SET active = $1 WHERE id = $2 RETURNING id, active",
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
  const user = await pool.query("SELECT * FROM customers WHERE id = $1", [req.customer!.id]);
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
