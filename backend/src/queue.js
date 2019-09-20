// arquivo para executar a aplicação em uma execução diferente da aplicação, a fila não influenciará na performance da aplicação,
import 'dotenv/config';
import Queue from './lib/Queue';

Queue.processQueue();
