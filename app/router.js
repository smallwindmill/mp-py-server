'use strict';
// const routerIo = require('./router/io')
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  require('./router/io')(app)

  const { router, controller, io } = app;
  router.get('/', controller.home.index);
  // routerIo(app)

  // socket.io
  // io.of('').route('server', io.controller.home.server)
};
