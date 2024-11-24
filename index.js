//const express = require('express')
import express from'express'
import csurf from 'csurf'
import cookieParser from 'cookie-parser'
import userRoutes from './Routers/userRouters.js'
import generalRoutes from './Routers/generalRouters.js'
import db from './config/db.js'

const app = express()
app.use('/public', express.static('public'));
//Habilitar lectura dee datos de formularios
app.use(express.urlencoded({extended: true}))//esta hace que pug como es muy milimalista active 
                                            //los request para poder resivir datos el servidor
                                            //conexion de la base de datos 
//habilitar cookie parser
                                            app.use(cookieParser())
//habilitar CSRF
app.use( csurf({cookie: true}))

    try{
    await db.authenticate();
    db.sync()
    console.log('Conexion correcta a la base de datos');
}catch(error) {
        console.log(error);
}

 

//Habilitar pug
app.set('view engine', 'pug')
app.set('views', './views')
//Routing 
app.use('/auth', userRoutes)
app.use('/',generalRoutes)

//carpeta publica 
app.use( express.static('public') )



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Él servidor esta funcionando correctamente en el puerto ${port}`);
});

  


