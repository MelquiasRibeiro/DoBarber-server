import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { apponitment } = data;

    console.log('a fila ta ok');

    await Mail.sendMail({
      to: `${apponitment.provider.name}<${apponitment.provider.email}>`,
      subject: 'Agendamento Cancelado',
      template: 'cancellation',
      context: {
        provider: apponitment.provider.name,
        user: apponitment.user.name,
        date: format(
          parseISO(apponitment.date),
          "'dia' dd 'de' MMM', às' H:mm'h' ",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancellationMail();
