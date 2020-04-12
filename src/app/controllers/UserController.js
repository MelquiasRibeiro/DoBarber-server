import User from '../models/User';

class UserController {
  async index(req, res) {
    const user = await User.findAll();

    return res.json({ user });
  }

  async show(req, res) {
    const user = await User.findByPk(req.params.id);

    return res.json({ user });
  }

  async store(req, res) {
    const userExist = await User.findOne({ where: { email: req.body.email } });
    if (userExist) {
      return res.status(400).json({
        error: 'this email is alredy registred in our database',
      });
    }

    const user = await User.create(req.body);

    return res.status(201).send(user);
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExist = await User.findOne({ where: { email } });

      if (userExist) {
        return res
          .status(400)
          .json({ error: 'this email is alredy registred in our database' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'password is wrong' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({ id, name, provider });
  }

  async destroy(req, res) {
    await User.destroy({ where: { id: req.params.id } });

    return res.status(204);
  }
}

export default new UserController();
