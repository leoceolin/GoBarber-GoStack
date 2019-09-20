import User from '../models/User';
import File from '../models/File';

class ProviderController {
  async index(req, res) {
    const providers = await User.findAll({
      where: {
        provider: true,
      },
      attributes: ['id', 'name', 'email', 'avatar_id'], // atributos que serão retornados
      include: [
        // traz na resposta as informações contidas na tabela file
        {
          model: File,
          as: 'avatar', // para trazer a resposta json com nome de Avatar no lugar de File
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(providers);
  }
}

export default new ProviderController();
