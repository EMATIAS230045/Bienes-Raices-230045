//const express = require('express')
import express from'express'
import userRoutes from './Routers/userRouters.js'
import generalRoutes from './Routers/generalRouters.js'

const app = express()


//Habilitar pug
app.set('view engine', 'pug')
app.set('views', './views')
//Routing 
app.use('/auth', userRoutes)
app.use('/',generalRoutes)

//carpeta publica 
app.use( express.static('public') )

const port = 3000;
app.listen(port, () => {
    console.log(`Él servidor esta funcionando correctamente en el puerto ${port}`);
});




