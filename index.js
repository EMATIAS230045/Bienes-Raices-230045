//const express = require('express')
import express from'express';
import generalRoutes from'./Routers/generalRoutes.js'
import userRoutes from'./Routers/userRoutes.js'
//Creacion de la app

const app = express()
const port = 3000;
app.listen(port, () => {
    console.log(`Él servidor esta funcionando correctamente en el puerto ${port}`);
});

app.use('/',generalRoutes)
app.use('/usuario',userRoutes);



//Routing 
//app.get('/', function(req, res){
    //res.send('Hola mundo desde express')
//})

//app.get('/nosotros', function(req, res){
  //  res.send('Nuestra informacion')
//})

//Definir un puerto y arrancar el proyecto

