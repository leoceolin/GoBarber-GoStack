import jwt from 'jsonwebtoken';
import { promisify } from 'util'; // para trabalhar com função de callback utilizando async/await

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization; // capturar token presente no header

  // console.log('authHeader ->', authHeader);

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' '); // pega somente a segunda parte do array no caso Bearer ayugeashjvlasf -> será capturado somente o texto após o Bearer

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret); // retorna os dados contidos no token
    // console.log('Decoded ->', decoded);

    req.userId = decoded.id; // insere o id do usuario no campo da requisição

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
