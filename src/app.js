import express from 'express';
import path from 'path';
import * as Sentry from '@sentry/node';
import 'express-async-errors';
import Youch from 'youch';

import Routes from './routes';
import './database';
import sentyConfig from './config/sentry';

class APP {
  constructor() {
    this.server = express();

    Sentry.init(sentyConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'temp', 'uploads'))
    );
  }

  routes() {
    this.server.use(Routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      const errors = await new Youch(err, req).toJSON();

      return res.status(500).json(errors);
    });
  }
}

export default new APP().server;
