const app = require('express')(); 
const cors = require('cors')
const http = require('http').Server(app);
const express = require('express'); // para manejar como servicio
const hostname = '127.0.0.1';
const port = 3000;

app.use(cors())

app.use(express.json({ limit: '10mb' }));


//cabecera CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); //permite el acceso a todos los dominios
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); //permite el acceso a todos los dominios
  next();
});

//routes
app.use(require('./routes/usuario'));

//routes login 
const userRoute = require('./routes/login');
app.use('/user', userRoute);



http.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});