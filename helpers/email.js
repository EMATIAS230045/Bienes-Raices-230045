import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, nombre, token } = datos;

  // Enviar email
  await transport.sendMail({
    from: 'BienesRaices.com <no-reply@bienesraices.com>',
    to: email,
    subject: 'Confirma tu Cuenta en BienesRaices.com',
    text: 'Confirma tu cuenta en BienesRaices.com',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #003366; text-align: center;">Bienvenido a BienesRaices.com</h2>
        <p>Hola <strong style="color: #003366;">${nombre}</strong>,</p>
        <p style="margin: 10px 0;">Gracias por registrarte en BienesRaices.com. Solo necesitas confirmar tu cuenta para empezar a disfrutar de nuestros servicios.</p>
        <p style="text-align: center; margin: 20px 0;">
          <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmAccout/${token}" 
             style="display: inline-block; padding: 10px 20px; background-color: #FF6600; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 5px;">
            Confirmar Cuenta
          </a>
        </p>
        <p style="margin: 10px 0;">Si no solicitaste esta cuenta, puedes ignorar este correo.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        <div style="text-align: center; margin: 20px 0;">
          <img src="${process.env.SIGNATURE_IMAGE_URL}" alt="Firma" style="max-width: 200px; height: auto; margin: auto; display: block;">
        </div>
        <p style="font-size: 0.9em; color: #555;">Si tienes alguna duda, no dudes en contactarnos a través de nuestro sitio web.</p>
        <p style="font-size: 0.9em; color: #555;">Atentamente,</p>
        <p style="font-size: 0.9em; color: #003366; font-weight: bold;">El equipo de BienesRaices.com</p>
      </div>
    `,
  });
};

export { emailRegistro };
