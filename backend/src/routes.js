import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware); // somente será aplicado o middleware nas rotas abaixo dessa linha

routes.put('/users', UserController.update); // atualizar usuario

routes.get('/providers', ProviderController.index); // listar prestadores de serviço
routes.get('/providers/:providerId/available', AvailableController.index); // listar horarios disponiveis do prestador

routes.post('/appointments', AppointmentController.store); // criar agendamento
routes.get('/appointments', AppointmentController.index); // listar agendamentos
routes.delete('/appointments/:id', AppointmentController.delete); // cancelar agendamento

routes.get('/schedule', ScheduleController.index); // listar agendamentos

routes.get('/notifications', NotificationController.index); // listar notificações do usuario
routes.put('/notifications/:id', NotificationController.update); // marcar notificação como lida

// middleware upload.single('file') -> para upload de um arquivo por vez, campo utilizado na requisição
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
