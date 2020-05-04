import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!isProvider) {
      res.status(401).json({ error: 'only provuders have notifications' });
    }

    const notification = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    res.json(notification);
  }

  async update(req, res) {
    const { id } = req.params;

    const read = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    res.json(read);
  }
}

export default new NotificationController();
