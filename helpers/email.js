import nodemailer from 'nodemailer'
const emailRegistro = async (datos) => {
const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  const {email, nombre, token} = datos

  //Enviar email
  await transport.sendMail({
    from: 'BienesRaices.com',
    to: email,
    subject: 'Confirma tu Cuenta en BienesRaices.com',
    text: 'Confirma tu cuenta en BienesRaices.com',
    html: `
            <p>Hola ${nombre}, comprueba tu cuenta en BienesRaices.com<p>

            <p> Tu cuenta ya esta lista, solo debes confirmar en ele siguiente enlace:
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmAccout/${token}">confirmar Cuenta</a></p>
            <p> Si tu no creaste esta cuenta puedes ignorar este mensaje</p>`
  })
} 
 
export{
    emailRegistro
}