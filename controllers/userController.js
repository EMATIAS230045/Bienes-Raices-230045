import { check, validationResult } from 'express-validator';
import Usuario from '../models/Usuario.js';
import { generedID } from '../helpers/token.js'
import { emailRegistro } from '../helpers/email.js'
import csurf from 'csurf';

const formularioLogin =(req, res) => {
        res.render('auth/login', {
            page: 'Iniciar sección'
        })
    }

    const formularioRegister =(req, res) => {
        res.render('auth/register',{
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken()
        })};


    const register = async (req, res) => {
        //validacion
        //hay dos formas en las que se pueden realizar la validacion una 
        //el enrutamineto del sitio en una instrusion antes del metodo que invoca la creacion de un nuevo usuario la otra es ponerlo en est mismo archvo con esta estructura
        await check('nombre').notEmpty().withMessage('El nombre no puede ir vacio').run(req)
        await check('email').isEmail().withMessage('Eso no parece un email').run(req) 
        await check('password').isLength({min: 8}).withMessage('La contraseña debe ser una 8 caracteres minimo').run(req)
        await check('password_confirm').equals(req.body.password).withMessage('La contraseña no coincide con la anterior').run(req) 
        let resultado = validationResult(req)

        //verificar que el resultado este validado
        if(!resultado.isEmpty()){
            // Errores
            return res.render('auth/register', {
                pagina: 'Crear Cuenta',
                csrfToken: req.csrfToken(),
                errores: resultado.array(),
                usuario:{
                    nombre: req.body.nombre,
                    email: req.body.email
                }
            })
        }
        const {nombre, email, password} = req.body

        //Verificar que el usuario no este duplicado
        const exitsuser = await Usuario.findOne({where:  {email}})
        
        if(exitsuser){
            return res.render('auth/register', {
                pagina: 'Crear Cuenta',
                csrfToken: req.csrfToken(),
                errores: [{msg: 'El usuario ya esta registrado'}],
                usuario:{
                    nombre: req.body.nombre,
                    email: req.body.email
                }
            })
        }
        //Almacenar un usuario 

        const usuario = await Usuario.create({
            nombre,
            email,
            password,
            token: (generedID())
        })

        //Envia email de confirmacion

        emailRegistro({
            nombre: usuario.nombre,
            email: usuario.email,
            token: usuario.token
        })

        //Mostrar mensaje de confirmacion de cuenta
        res.render('templates/mensaje', {
            page: 'Cuenta Creada Correctamente',
            mensaje: `Hemos enviado un email de confirmacion  al email  ${usuario.email} , preciona en el enlace`
        })
        }
        //Funcion que comprueba una cuenta
        const confirm = async (req, res, next) =>{
            const { token } = req.params;
            //Verificar  si el correo es correcto
            const usuario = await Usuario.findOne({ where: {token}})
            
            
            if(!usuario){
                return res.render('auth/confirmAccout', {
                    page : 'Error al confirmar tu cuenta',
                    mensaje: 'Hubo un error al verificar tu cuenta, intentalo de nuevo',
                    error: true
                });
            }
               //confirmar la cuenta
            usuario.token = null;
            usuario.confirmado = true;
            await usuario.save();
             res.render('auth/confirmAccout', {
                page : 'Cuenta confirmada',
                mensaje: 'Tu cuenta a sido confirmada correctamente'
            });
            console.log(usuario)   

        } 
         
    const formularioPasswordRecovery =(req, res) => {
            res.render('auth/passwordRecovery',{
               pagina: 'Recuperar Contraseña'
            })};
    export {formularioLogin, formularioRegister, register, confirm, formularioPasswordRecovery}