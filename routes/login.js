const express = require('express');
const router = express.Router();

const getConnection = require('../conexion');


const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    getConnection(function (err, conn) {
        if (err) {
            return res.sendStatus(400, 'error en conexión');
        }
        conn.query('SELECT * FROM user', function (err, rows) {
            if (err) {
                conn.release();
                return res.sendStatus(400, 'No se puede conectar a la base de datos');
            }
            res.send(rows);
            conn.release();
        });
    });
});


router.post('/singin', (req, res) => {
    const { username, pass } = req.body;
  
    getConnection((err, conn) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error connecting to the database' });
      }
  
      conn.query( 'SELECT username, roleId FROM user WHERE username = ? AND pass = ?',[username, pass], 
        (err, rows) => {
          conn.release(); // Release the connection back to the pool
  
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error executing query' });
          }
  
          if (rows.length > 0) {
            const data = JSON.stringify(rows[0]);
            const token = jwt.sign(data, 'stil');
            res.json({ token });
          } else {
            res.status(401).json({ error: 'Usuario o clave incorrectos' });
          }
        }
      );
    });
});


router.post('/test', verifyToken, (req, res) => {
    res.json('Informacion secreta');
  });
  
  function verifyToken(req, res, next) {
    const authorizationHeader = req.headers.authorization;
  
    if (!authorizationHeader) {
      return res.status(401).json({ error: 'No autorizado' });
    }
  
    const token = authorizationHeader.replace('Bearer ', '');
  
    if (!token) {
      return res.status(401).json({ error: 'Token vacio' });
    }
  
    try {
      const decodedToken = jwt.verify(token, 'stil');
      req.data = decodedToken;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Token no válido' });
    }
}




module.exports = router;