import nodemailer from 'nodemailer';
import SendmailTransport from 'nodemailer/lib/sendmail-transport';
import mailCongig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailCongig;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });
  }

  sendMail(message) {
    return this.transporter.sendMail({
      ...mailCongig.dafault,
      ...message,
    });
  }
}

export default new Mail();
