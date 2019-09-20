export default {
  host: process.env.MAIL_HOST, // envio através de SMTP
  port: process.env.MAIL_PORT,
  secure: false, // se utiliza SSL, segurança
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  default: {
    from: 'Equipe GoBarber <noreply@gobarber.com',
  },
};
