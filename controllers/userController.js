const formularioLogin =(req, res) => {
        res.render('auth/login', {
            page: 'Iniciar sección'
        })
    }

    const formularioRegister =(req, res) => {
        res.render('auth/register',{
            pagina: 'Crear Cuenta'
        })};
 
        
    const formularioPasswordRecovery =(req, res) => {
            res.render('auth/passwordRecovery',{
               pagina: 'Recuperar Contraseña'
            })};
    
            console.log
    export {formularioLogin, formularioRegister, formularioPasswordRecovery}