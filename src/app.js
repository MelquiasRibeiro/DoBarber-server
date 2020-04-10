import express from 'express';
import Routes from './routes';

class APP {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(Routes);
  }
}

export default new APP().server;
