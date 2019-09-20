import User from '../models/User';
import Notification from '../schemas/Notification';

class NotificationController {
  async index(req, res) {
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true }, // req.userId -> usuario logado !
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'Only providers can load notifications' });
    }

    const notifications = await Notification.find({
      user: req.userId, // lista notificações onde user = req.userId
    })
      .sort({ createdAt: 'desc' }) // ordenado pela data de criação
      .limit(20); // limite de 20 resultados
    return res.json(notifications);
  }

  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate(
      // encontra o registro e atualiza ao mesmo tempo, função do mongoose
      req.params.id, // parametros(id) passado na rota
      { read: true }, // campo que será atualizado
      { new: true } // após atualizar retornar a nova notificação atualizada
    );
    return res.json(notification);
  }
}

export default new NotificationController();
