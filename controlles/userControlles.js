import { request, response } from "express"

const formularioLogin =(request,response) => {
    res.render('auth/login',{
        autenticado: false
    })

};

const formularioRegister =(request,response) => {
    res.render('auth/register',{
        
    })};

const formularioPasswordRecovery =(request,response) => {
        res.render('auth/passwordRecovery',{
           
        })};

export{formularioLogin,formularioRegister,formularioPasswordRecovery}

