import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleController {
  async index(req, res) {
    const { page = 1, date } = req.query;

    const povider = await User.findOne({
      where: {
        id: req.userId,
        provider: true,
      },
    });

    if (!povider) {
      return res.status(401).json({ error: ' this user are not a provider' });
    }
    const parseDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)],
        },
      },
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();
