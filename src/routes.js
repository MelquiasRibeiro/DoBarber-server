import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import auth from './app/middlewares/auth';

const routes = new Router();

routes.get('/users', UserController.index);
routes.post('/session', SessionController.store);

routes.use(auth);
routes.get('/users/:id', UserController.show);
routes.post('/users', UserController.store);
routes.put('/users', auth, UserController.update);
routes.delete('/users', UserController.destroy);

export default routes;
