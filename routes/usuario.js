const express = require('express');
const router = express.Router();
const getConnection = require('../conexion');
const { connect } = require('http2');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'bugsfreak26@gmail.com',
        pass: 'pbbgtsyzhvovjwod'
    }
});



// Insertar un usuario en la base de datos
router.post('/usuario/', (req, res) => {
    const data = {
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        cedula: req.body.cedula,
        fechaNacimiento: req.body.fechaNacimiento,
        correoElectronic: req.body.correoElectronic,
        nivelAcademico: req.body.nivelAcademico,
        tipoSangre: req.body.tipoSangre,
        tipoLicencia: req.body.tipoLicencia,
        fotoExamenPs: req.body.fotoExamenPs,
        imagenPago: req.body.imagenPago,
        estado: req.body.estado
    };

    const query = `INSERT INTO usuarios (nombres, apellidos, cedula, fechaNacimiento, correoElectronic, nivelAcademico, tipoSangre, tipoLicencia, fotoExamenPs, imagenPago, estado) VALUES ('${data.nombres}', '${data.apellidos}', '${data.cedula}', '${data.fechaNacimiento}', '${data.correoElectronic}', '${data.nivelAcademico}', '${data.tipoSangre}', '${data.tipoLicencia}', '${data.fotoExamenPs}',null,0)`;
    const message = {
        from: "bugsfreak26@gmail.com",
        to: data.correoElectronic,
        subject: "Registro exitoso",
        html: `<!DOCTYPE html>
        <html>
        
        <head>
            <meta charset="UTF-8">
            <title>Correo profesional</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    /*background-color: #f1f1f1; */
                    background-image: url("https://i.ibb.co/7G4VMx1/fondo.jpg");
                    background-size: cover;
                    background-repeat: no-repeat;
                }
        
                .container {
                    margin: 0 auto;
                    max-width: 600px;
                    margin-top: 50px;
                    padding: 20px;
                    background: rgb(61, 163, 231);
                    /*background-color: #ffffff;*/
                    border: 1px solid #939685;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
        
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
        
                .logo {
                    display: block;
                    margin: 0 auto;
                    width: 150px;
                    height: auto;
                }
        
                .content {
                    padding: 20px;
                    /*background-color: #ffffff;*/
                    background: rgb(230, 185, 90);
                    
                    border-radius: 5px;
                    font-size: 20px;
        
                }
        
                .content>p {
                    font-family: 'Bitter', sans-serif;
                    color: black;
                    font-weight: bold;
                }
        
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 12px;
                    color: black;
                }
        
                .footer p {
                    font-size: 12px;
                    color: black;
                }
        
                .asunto {
                    font-family: 'Roboto Condensed', sans-serif;
                    font-size: 30px;
                }
            </style>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link
                href="https://fonts.googleapis.com/css2?family=Bitter:ital,wght@1,200&family=Roboto+Condensed:wght@300&display=swap"
                rel="stylesheet">
        
        </head>
        
        <body>
            <div class="container">
                <div class="header">
                    <img class="logo" src="https://i.ibb.co/n8Jpwm9/logo-transparent.png" alt="Logo">
                    <h1 class="asunto" style="margin-top: 10px;">Registrado exitosamente</h1>
                </div>
                <div class="content">
                    <p>Estimado/a ${data.nombres} ${data.apellidos},</p>
                    <p style="margin-bottom: 20px;">¡Bienvenido/a a nuestra escuela de conducción! Nos complace que te hayas registrado
                        exitosamente.</p>
                        <p> El mensaje sobre las instrucciones del pago le llegarán en un plazo de 48 horas máximo </p>
                    <p>Saludos cordiales,</p>
                    <p>RSA</p>
                </div>
                <div class="footer">
                    <p>No responder a este correo</p>
                    <p>Usar la aplicación para continuar</p>
                    <p><a href="http://localhost:4200">Ir a la aplicación</a></p>
                </div>
            </div>
        </body>
        
        </html>`
    };
    getConnection(function (err, conn) {
        if (err) {
            console.log('NO SE PUDO CONECTAR A LA BASE DE DATOS' + err);
        }

        conn.query(query, function (err, result) {
            if (!err) {
                transporter.sendMail(message, (error, info) => {
                    if (error) {
                        console.log('Error al enviar el correo: ', error);
                    } else {
                        console.log('Correo enviado: ', info.response);
                    }
                });
                return res.json({ status: 'REGISTRO EXITOSO' });

            } else {
                console.log(err);
            }
            conn.release();
        });
    });
});




// Consultar todos los usuarios //Estado 0
router.get('/usuarios', (req, res) => {
    getConnection(function (err, conn) {
        if (err) {
            return res.sendStatus(400, 'error en conexión');
        }
        conn.query('SELECT * FROM usuarios WHERE estado = 0', function (err, rows) {
            if (err) {
                conn.release();
                return res.sendStatus(400, 'No se puede conectar a la base de datos');
            }
            res.send(rows);
            conn.release();
        });
    });
});


// Consultar todos los usuarios //Estado 1
router.get('/usuarios1', (req, res) => {
    getConnection(function (err, conn) {
        if (err) {
            return res.sendStatus(400, 'error en conexión');
        }
        conn.query('SELECT * FROM usuarios WHERE estado = 1', function (err, rows) {
            if (err) {
                conn.release();
                return res.sendStatus(400, 'No se puede conectar a la base de datos');
            }
            res.send(rows);
            conn.release();
        });
    });
});


// Traer un usuario mediante el ID
router.get('/usuario/getById/:id', (req, res) => {
    getConnection(function (err, conn) {
        const { id } = req.params;
        console.log('entra usuario por id');
        if (err) {
            return res.sendStatus(400);
        }
        conn.query('SELECT * FROM usuarios WHERE idusuarios = ?', [id], function (err, rows) {
            if (err) {
                conn.release();
                return res.sendStatus(400, 'No se puede conectar a la base de datos');
            }
            res.send(rows);
            conn.release();
        });
    });
});

// Actualizar la imagen del pago en la base de datos
router.put('/usuario/updateI/:id', (req, res) => {
    const { id } = req.params;
    const updatedData = {
        imagenPago: req.body.imagenPago
    };

    const updateQuery = `
        UPDATE usuarios
        SET
            imagenPago = ${updatedData.imagenPago}
        WHERE idusuarios = ${id}
    `;

    getConnection(function (err, conn) {
        if (err) {
            console.log('NO SE PUDO CONECTAR A LA BASE DE DATOS' + err);
            return res.sendStatus(500); // Internal Server Error
        }

        conn.query(updateQuery, function (err, result) {
            if (!err) {
                if (result.affectedRows > 0) {
                    return res.json({ status: 'ACTUALIZACIÓN EXITOSA' });
                } else {
                    return res.status(404).json({ error: 'Usuario no encontrado' });
                }
            } else {
                console.log(err);
                return res.sendStatus(500); // Internal Server Error
            }
            conn.release();
        });
    });
});


// Update User Route (`PUT /usuario/update/:id`)
router.put('/usuario/update/:id', (req, res) => {
    const { id } = req.params;
    const updatedData = {
        estado: req.body.estado
    };

    const updateQuery = `
        UPDATE usuarios
        SET
            estado = ${updatedData.estado}
        WHERE idusuarios = ${id}
    `;

    const getUserDetailsById = (id) => {
        return new Promise((resolve, reject) => {
            getConnection(function (err, conn) {
                if (err) {
                    reject(err);
                }
                conn.query('SELECT * FROM usuarios WHERE idusuarios = ?', [id], function (err, rows) {
                    if (err) {
                        conn.release();
                        reject(err);
                    }
                    resolve(rows);
                    conn.release();
                });
            });
        });
    };

    try {
        getUserDetailsById(id).then((rows) =>{
            console.log(rows[0]);
            const data = rows[0];
            let precio = 0;

        if (data.tipoLicencia == "Tipo A") {
            precio = 130.99;
        } else if (data.tipoLicencia == "Tipo B") {
            precio = 190.99;
        } else if (data.tipoLicencia == "Tipo C") {
            precio = 900;
        }
        const message = {
            from: "bugsfreak26@gmail.com",
            to: data.correoElectronic,
            subject: "Pagos de licencia",
            html: `<!DOCTYPE html>
        <html>
        
        <head>
            <meta charset="UTF-8">
            <title>Correo profesional</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    /*background-color: #f1f1f1; */
                    background-image: url("https://i.ibb.co/7G4VMx1/fondo.jpg");
                    background-size: cover;
                    background-repeat: no-repeat;
                }
        
                .container {
                    margin: 0 auto;
                    max-width: 600px;
                    margin-top: 50px;
                    padding: 20px;
                    background: rgb(61, 163, 231);
                    /*background-color: #ffffff;*/
                    border: 1px solid #939685;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
        
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
        
                .logo {
                    display: block;
                    margin: 0 auto;
                    width: 150px;
                    height: auto;
                }
        
                .content {
                    padding: 20px;
                    /*background-color: #ffffff;*/
                    background: rgb(230, 185, 90);
                    
                    border-radius: 5px;
                    font-size: 20px;
        
                }
        
                .content>p {
                    font-family: 'Bitter', sans-serif;
                    color: black;
                    font-weight: bold;
                }
        
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 12px;
                    color: black;
                }
        
                .footer p {
                    font-size: 12px;
                    color: black;
                }
        
                .asunto {
                    font-family: 'Roboto Condensed', sans-serif;
                    font-size: 30px;
                }
            </style>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link
                href="https://fonts.googleapis.com/css2?family=Bitter:ital,wght@1,200&family=Roboto+Condensed:wght@300&display=swap"
                rel="stylesheet">
        
        </head>
        
        <body>
            <div class="container">
                <div class="header">
                    <img class="logo" src="https://i.ibb.co/n8Jpwm9/logo-transparent.png" alt="Logo">
                    <h1 class="asunto" style="margin-top: 10px;">Pago pendiente</h1>
                </div>
                <div class="content">
                    <!--<p style="margin-bottom: 20px;">¡Bienvenido/a a nuestra escuela de conducción! Nos complace que te hayas registrado exitosamente.</p>-->
                    <p>Por favor, realiza el pago correspondiente de la manera más conveniente para ti. El monto a pagar es de $ ${precio}.</p>
                    <p>Realiza el pago a la siguiente cuenta:</p>
                    <p>Número de cuenta: #92031290</p>
                    <p>Ahorros Pichincha</p>
                    <p>Agradecemos tu pronta atención y te recordamos que tu participación en nuestra escuela de conducción es muy importante.</p>
                    <p>Saludos cordiales,</p>
                    <p>RSA</p>
                </div>
                <div class="footer">
                    <p>No responder a este correo</p>
                    <p>Usar la aplicación para continuar</p>
                    <p><a href="http:localhost:4200">Ir a la aplicación</a></p>
                </div>
            </div>
        </body>
        
        </html>`
        };
        getConnection(function (err, conn) {
            if (err) {
                console.log('NO SE PUDO CONECTAR A LA BASE DE DATOS' + err);
                return res.sendStatus(500); // Internal Server Error
            }

            conn.query(updateQuery, function (err, result) {
                if (!err) {
                    if (result.affectedRows > 0) {
                        transporter.sendMail(message, (error, info) => {
                            if (error) {
                                console.log('Error al enviar el correo: ', error);
                            } else {
                                console.log('Correo enviado: ', info.response);
                            }
                        });
                        return res.json({ status: 'ACTUALIZACIÓN EXITOSA' });
                    } else {
                        return res.status(404).json({ error: 'Usuario no encontrado' });
                    }
                } else {
                    console.log(err);
                    return res.sendStatus(500); // Internal Server Error
                }
                conn.release();
            });
        });
        });
        
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});



// Delete User Route (`DELETE /usuario/delete/:id`)
router.delete('/usuario/delete/:id', (req, res) => {
    const { id } = req.params;

    const deleteQuery = `
        DELETE FROM usuarios
        WHERE idusuarios = ${id}
    `;

    const getUserDetailsById = (id) => {
        return new Promise((resolve, reject) => {
            getConnection(function (err, conn) {
                if (err) {
                    reject(err);
                }
                conn.query('SELECT * FROM usuarios WHERE idusuarios = ?', [id], function (err, rows) {
                    if (err) {
                        conn.release();
                        reject(err);
                    }
                    resolve(rows);
                    conn.release();
                });
            });
        });
    };

    try {
        getUserDetailsById(id).then((rows) =>{
            data = rows[0];
            const message = {
                from: "bugsfreak26@gmail.com",
                to: data.correoElectronic,
                subject: "Rechazo de registro",
                html: `<!DOCTYPE html>
            <html>
            
            <head>
                <meta charset="UTF-8">
                <title>Correo profesional</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        /*background-color: #f1f1f1; */
                        background-image: url("https://i.ibb.co/7G4VMx1/fondo.jpg");
                        background-size: cover;
                        background-repeat: no-repeat;
                    }
            
                    .container {
                        margin: 0 auto;
                        max-width: 600px;
                        margin-top: 50px;
                        padding: 20px;
                        background: rgb(61, 163, 231);
                        /*background-color: #ffffff;*/
                        border: 1px solid #939685;
                        border-radius: 5px;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    }
            
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
            
                    .logo {
                        display: block;
                        margin: 0 auto;
                        width: 150px;
                        height: auto;
                    }
            
                    .content {
                        padding: 20px;
                        /*background-color: #ffffff;*/
                        background: rgb(230, 185, 90);
                        
                        border-radius: 5px;
                        font-size: 20px;
            
                    }
            
                    .content>p {
                        font-family: 'Bitter', sans-serif;
                        color: black;
                        font-weight: bold;
                    }
            
                    .footer {
                        text-align: center;
                        margin-top: 20px;
                        font-size: 12px;
                        color: black;
                    }
            
                    .footer p {
                        font-size: 12px;
                        color: black;
                    }
            
                    .asunto {
                        font-family: 'Roboto Condensed', sans-serif;
                        font-size: 30px;
                    }
                </style>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link
                    href="https://fonts.googleapis.com/css2?family=Bitter:ital,wght@1,200&family=Roboto+Condensed:wght@300&display=swap"
                    rel="stylesheet">
            
            </head>
            
            <body>
                <div class="container">
                    <div class="header">
                        <img class="logo" src="https://i.ibb.co/n8Jpwm9/logo-transparent.png" alt="Logo">
                        <h1 class="asunto" style="margin-top: 10px;">Registro rechazado</h1>
                    </div>
                    <div class="content">
                        <p>Estimado/a ${data.nombres} ${data.apellidos},</p>
                        <p style="margin-bottom: 20px;">Su registro ha sido rechazado por favor vuelva a intentarlo </p>
                        <p> El cuerpo técnico ha considerado sus credenciales como no apropiadas </p>
                        <p>Saludos cordiales,</p>
                        <p>RSA</p>
                    </div>
                    <div class="footer">
                        <p>No responder a este correo</p>
                        <p>Usar la aplicación para continuar</p>
                        <p><a href="http:localhost:4200">Ir a la aplicación</a></p>
                    </div>
                </div>
            </body>
            
            </html>`
            };
    
    
            getConnection(function (err, conn) {
                if (err) {
                    console.log('NO SE PUDO CONECTAR A LA BASE DE DATOS' + err);
                    return res.sendStatus(500); // Internal Server Error
                }
    
                conn.query(deleteQuery, function (err, result) {
                    if (!err) {
                        if (result.affectedRows > 0) {
                            transporter.sendMail(message, (error, info) => {
                                if (error) {
                                    console.log('Error al enviar el correo: ', error);
                                } else {
                                    console.log('Correo enviado: ', info.response);
                                }
                            });
                            return res.json({ status: 'ELIMINACIÓN EXITOSA' });
                        } else {
                            return res.status(404).json({ error: 'Usuario no encontrado' });
                        }
                    } else {
                        console.log(err);
                        return res.sendStatus(500); // Internal Server Error
                    }
                    conn.release();
                });
            });
        });

        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});




router.get('/usuario/checkEmail/:email', (req, res) => {
    const email = req.params.email;
  
    const query = 'SELECT correoElectronic FROM usuarios WHERE correoElectronic = ?';
  
    getConnection(function (err, conn) {
      if (err) {
        console.log('NO SE PUDO CONECTAR A LA BASE DE DATOS' + err);
        return res.sendStatus(500); // Internal Server Error
      }
  
      conn.query(query, [email], function (err, result) {
        if (!err) {
          const emailExists = result.length > 0;
          res.json({ emailExists });
        } else {
          console.log(err);
          res.sendStatus(500); // Internal Server Error
        }
        conn.release();
      });
    });
  });

  router.get('/usuario/checkCedula/:cedula', (req, res) => {
    const cedula = req.params.cedula;
  
    const query = 'SELECT * FROM usuarios WHERE cedula = ?';
  
    getConnection(function (err, conn) {
      if (err) {
        console.log('NO SE PUDO CONECTAR A LA BASE DE DATOS' + err);
        return res.sendStatus(500); // Internal Server Error
      }
  
      conn.query(query, [cedula], function (err, result) {
        if (!err) {
          const cedulaExists = result.length > 0;
          res.json({ cedulaExists });
        } else {
          console.log(err);
          res.sendStatus(500); // Internal Server Error
        }
        conn.release();
      });
    });
});




module.exports = router;