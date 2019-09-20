import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt'; // para traduzir meses e dias da semana para portugues
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';

import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query; // obtem a paginação do usuario, caso nao tenha valor na url, será a pagina 1

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'], // listagem por data
      limit: 20,
      offset: (page - 1) * 20, // calculo de itens exibidos baseado na pagina, sempre começando do ultimo item exibido
      attributes: ['id', 'date', 'past', 'cancelable'], // atributos a serem listados
      include: [
        {
          model: User,
          as: 'provider', // atributos da tabela user para trazer, no caso qual provider(prestador de serviço) esta realizando o agendamento
          attributes: ['id', 'name'], // id do provider e nome
          include: [
            {
              model: File,
              as: 'avatar', // avatar do prestador(provider)
              attributes: ['id', 'path', 'url'], // id do avatar, caminho dela e url final
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

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'validation fails appointment controller' });
    }
    const { provider_id, date } = req.body;
    /**
     * Check if provider_id is a provider
     */
    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (provider_id === req.userId) {
      return res.status(401).json({ error: 'user and provider are equal' });
    }

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    /**
     * check for past dates
     */
    const hourStart = startOfHour(parseISO(date)); // startOfHour -> arrendonda para um valor inteiro / parseISO -> transforma a string em um objeto date do JS
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited' });
    }

    /**
     * check for date availability
     */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId, // middleware seta automaticamente quando usuario faz o login
      provider_id, // vem do campo req.body
      date,
    });

    /**
     * Notify appointment provider
     */
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );
    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id,
    });
    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          // incluindo informações do prestador de serviço
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (appointment.user_id !== req.userId) {
      return res.status('401').jsom({
        error: "Tou don't have permission to cancel this appointment.",
      });
    }

    const dateWithSub = subHours(appointment.date, 2); // data do agendamento - 2 horas que é o horario tolerado para o cancelamento

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You cant only cancel 2 hours in advance.',
      });
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    await Queue.add(CancellationMail.key, {
      appointment,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
