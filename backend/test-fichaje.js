const { pool } = require('./src/db.ts');
pool.query("INSERT INTO fichaje (id_usuario, tipo, nota) VALUES (1, 'in', 'Test') RETURNING *")
  .then(res => console.log(res.rows))
  .catch(err => console.error(err))
  .finally(() => pool.end());
