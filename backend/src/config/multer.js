import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  // storage - como o multer ira guardar os arquivos
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, callback) => {
      // crypto é usada para gerar caracteres aleatorios randomBytes (n° bytes que sera gerado aleatoriamente)
      // callback sera a função executada com o nome do arquivo ou erro
      crypto.randomBytes(16, (err, res) => {
        if (err) return callback(err);

        return callback(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
