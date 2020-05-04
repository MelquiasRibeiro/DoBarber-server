import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'date'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'name', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });
    // yup validation
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }
    const { provider_id, date } = req.body;

    //  this user is a provider ??

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'you can only create appointment with providers' });
    }
    // a provider can't mark an apponitment with himself
    if (req.userId === provider_id) {
      return res
        .status(400)
        .json({ error: 'you can not create an appointment with your self' });
    }

    //  this hour is  valid ??

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'past dates are no permited' });
    }

    //  this hour is  avaliable?

    const avaliable = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (avaliable) {
      return res.status(400).json({ error: 'this hour is not avaliable' });
    }

    // make an appointment
    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    const user = await User.findByPk(req.userId);
    const formatedDate = format(hourStart, "'dia' dd 'de' MMM', às' H:mm'h' ", {
      locale: pt,
    });

    // creating a notification
    await Notification.create({
      content: `Nova notificação de ${user.name} para o ${formatedDate} `,
      user: provider_id,
    });

    return res.status(201).json(appointment);
  }

  async destroy(req, res) {
    const { id } = req.params;

    const apponitment = await Appointment.findByPk(id);

    if (req.userId !== apponitment.user_id) {
      return res
        .status(401)
        .json({ erro: 'you only cancel your appointments' });
    }

    const subdate = subHours(apponitment.date, 2);

    if (isBefore(subdate, new Date())) {
      return res.status(401).json({
        erro: `you only can cancel this appointment until 2 hours before`,
      });
    }
    apponitment.canceled_at = new Date();

    await apponitment.save();

    return res.json(apponitment);
  }
}

export default new AppointmentController();
