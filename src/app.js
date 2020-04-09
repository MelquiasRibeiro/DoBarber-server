const express = require('express');
const Routes = require('./routes');

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

module.exports = new APP().server;
