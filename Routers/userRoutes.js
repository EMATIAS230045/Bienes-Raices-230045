import express from 'express';
import { formularioLogin, formularioRegister, formularioPasswordRecovery } from '../controlles/userControlles.js';
const router = express.Router();

//GET
router.get("/busquedaPorID/:id",function(request,response){
    response.send(`Se esta solicitando buscar al usuario con ID: ${request.params.id}`);
})
router.post("/newUser/:name/:email/:password", function(req,res){
    res.send(`Se ha solicitado la creacion de un nuevo usuario de nombre: ${req.params.name}, asociado al correo electronico: ${req.params.email} con la contraseña: ${req.params.password}`)
})

router.put("/replaceUserByEmail/:name/:email/:password", function(a,b){
b.send(`Se ha solicitado el reemplazo de toda la informacion del usuario: ${a.params.name},con correo: ${a.params.email} y contraseña: ${a.params.password}`)
})

router.patch("/updatePassword/:email/:newPassword/:newPasswordConfirm",function(request,response){
    const {email,newPassword, newPasswordConfirm}= request.params

    if(newPassword===newPasswordConfirm)
    {
        response.send(`Se ha solicitado el actualizacion de la contraseña del usuario con correo: ${email}, se acepta los cambios ya que la contraseña y confirmacion son la misma `)
        console.log(newPassword);
        console.log(newPasswordConfirm);
    }else{
        response.send(`Se ha solicitado el actualizacion de la contraseña del usuario con correo: ${email}, con la nueva contraseña ${newPassword}, pero se rechaza el cambio dado  que la nueva contraseña y su confirmacion no coinciden. `)
        console.log(newPassword);
        console.log(newPasswordConfirm);
    }

})

router.delete("/deleteUser/:email",function(request,response){
    response.send(`Se ha solicitado la eliminacion del uusario asociado al correo: ${request.params.email}`)

})



//router.get("/busquedaPorID/:id", function (request,response){
   // response.send(`Se esta solicitando buscar al usuario con ID: ${request.params.id}, asociado al correo `)
//})  // 2 componentes de una petición ruta, función callback 

//POST

//PUT

router.get("/login",formularioLogin);
router.get("/createAccount",formularioRegister);
router.get("/passwordRecovery",formularioPasswordRecovery);

export default router