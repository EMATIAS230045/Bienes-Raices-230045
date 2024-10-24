const express = require('express')
 
//Creacion de la app

const app = express()
//Routing 
app.get('/', function(req, res){
    res.send('Hola mundo desde express')
})

app.get('/', function(req, res){
    res.send('Nuestra informacion')
})

//Definir un puerto y arrancar el proyecto
const port = 3000;
app.listen(port, () => {
    console.log(`Él servidor esta funcionando correctamente en el puerto ${port}`)
});