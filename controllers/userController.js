import { check, validationResult } from 'express-validator';
import Usuario from '../models/Usuario.js';
import { generedID } from '../helpers/token.js'
import bcrypt from 'bcrypt'
import { emailChagedPassword, emailRegistro } from '../helpers/email.js'
import csurf from 'csurf';
import { response } from 'express';
import { where } from 'sequelize';

const formularioLogin =(req, res) => {
        res.render('auth/login', {
            page: 'Iniciar sección'
        })
    }
const autentication = (req, res) => {

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
        await check('age').notEmpty().withMessage('La edad no puede ir vacía')
        .isInt({ min: 18 }).withMessage('Debes ser mayor de 18 años para registrarte').run(req)
        await check('password').isLength({min: 8}).withMessage('La contraseña debe ser una 8 caracteres minimo').run(req)
        await check('password_confirm').equals(req.body.password).withMessage('La contraseña no coincide con la anterior').run(req) 
        let resultado = validationResult(req)

        //verificar que el resultado este validado
        if (!resultado.isEmpty()) {
            return res.render('auth/register', {
                pagina: 'Crear Cuenta',
                csrfToken: req.csrfToken(),
                errores: resultado.array(),
                usuario: {
                    nombre: req.body.nombre,
                    email: req.body.email,
                    age: req.body.age
                }
            });
        }
        const {nombre, email, password,age} = req.body

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
            age,
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
         
        const formularioPasswordRecovery = (req, res) => {
            res.render('auth/passwordRecovery', {
                pagina: 'Recuperar Contraseña',
                csrfToken: req.csrfToken(),
                errores: [], // Asegúrate de que esta variable siempre se pase
            });
        };
        
        const passwordReset = async (req, res) => {
            await check('correo_usuario')
                .notEmpty().withMessage('El correo electrónico es obligatorio.')
                .isEmail().withMessage('El formato del correo no es válido.')
                .run(req);
        
            const result = validationResult(req);
        
            if (!result.isEmpty()) {
                return res.render('auth/passwordRecovery', {
                    pagina: 'Recuperar Contraseña',
                    csrfToken: req.csrfToken(),
                    errores: result.array(), // Pasar los errores si hay
                });
            } 

            const { correo_usuario:email } = req.body

            const usuario = await Usuario.findOne({where : {email}})

            if(!usuario){
                return res.render('auth/passwordRecovery', {
                    pagina: 'Recuperar Contraseña',
                    csrfToken: req.csrfToken(),
                    errores: [{msg: 'El email no pertenece a ningun usuario'}]
                });
            }
            //Generar Token y enviar  el email para recuperar la contraseña
            usuario.token = generedID();
            await usuario.save();

            emailChagedPassword({
                email: usuario.email,
                nombre: usuario.nombre,
                token: usuario.token
            })
            res.render('templates/mensaje', {
                page: 'Restablece tu password',
                mensaje: `Hemos enviado un email a  ${usuario.email} , con las instruciones`
            })
             };
        


const veryTokenPasswordChange = async (req, res) =>{
    const { token } = req.params;
    const user = await Usuario.findOne({where: {token}})
    if(!user){
        console.log("holaaaaa mundo")
        return res.render('auth/confirmAccout', {
            page : 'Restablece tu Contraseña',
            mensaje: 'Hubo un error al verificar tu información, intentalo de nuevo',
            error: true
        });
    }
      //Mostrar fromulario de recuperacion de password 
    res.render('auth/reset-password',{
        pagina: 'Restablece Tu password',
        csrfToken : req.csrfToken(),
        errores: []
    })
}
const updatePassword = async (req, res) =>{
     //Validar el password 
     await check('contra_usuario').isLength({min: 8}).withMessage('La contraseña debe ser una 8 caracteres minimo').run(req)
     await check('contranew_usuario').equals(req.body.contra_usuario).withMessage('La contraseña no coincide con la anterior').run(req) 
    let result = validationResult(req)

    if(!result.isEmpty()){
        //Errores
        res.render('auth/reset-password',{
            pagina: 'Restablece Tu password',
            csrfToken : req.csrfToken(),
            errores: result.array()
        })
    }
    const { token } = req.params;
    const {password} = req.body;

    const usuario = await Usuario.findOne({where: {token}})

    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(usuario.password, salt);
    usuario.token = null;
    await usuario.save();
    return res.render('auth/confirmAccout', {
        page : 'Contraseña Restablecida',
        mensaje: 'El password se puede guardar correctamente'
    });

}

        //Registramos los datos en la base de datos
    export {formularioLogin, autentication, formularioRegister, register, confirm, formularioPasswordRecovery, passwordReset, veryTokenPasswordChange, updatePassword}