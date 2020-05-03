import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileControler from './app/controllers/FileController';
import ProviderControler from './app/controllers/ProviderController';

import auth from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(auth);

routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.show);
routes.put('/users', auth, UserController.update);
routes.delete('/users/', UserController.destroy);
routes.get('/providers', ProviderControler.index);
routes.post('/files', upload.single('file'), FileControler.store);

export default routes;
