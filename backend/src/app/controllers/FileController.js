import File from '../models/File';

class FileController {
  async store(req, res) {
    // desustruturação utilizando dados retornados da variacel file, para ver parametros disponiveis usar (req, res) => return res.json(req.file)
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    // retorna apenas os dados de file e nao todos retornados
    return res.json(file);
  }
}

export default new FileController();
