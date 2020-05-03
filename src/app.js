import express from 'express';
import path from 'path';
import Routes from './routes';
import './database';

class APP {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'temp', 'uploads'))
    );
  }

  routes() {
    this.server.use(Routes);
  }
}

export default new APP().server;
