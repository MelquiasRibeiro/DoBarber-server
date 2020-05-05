export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  dafault: {
    from: 'Equipe Barber Done <noreplay@barberDone.com>',
  },
};
