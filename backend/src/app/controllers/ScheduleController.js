import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize'; // para utilizar o operador between na data
import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleController {
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkUserProvider) {
      return res.status(401).json({ error: 'user is not a provider' });
    }

    const { date } = req.query; // data que será passada como parametro na rota, query string
    const parsedDate = parseISO(date);

    const appointments = await Appointment.findAll({
      // pegar todos agendamentos onde o id do prestador de serviço seja igual ao do usuario logado, o agendamento nao esteja cancelado e seja no dia atual
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
      order: ['date'],
    });
    return res.json(appointments);
  }
}

export default new ScheduleController();
