/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  config.cluster = {
      listen: {
        path: '',
        port: 7080,
        hostname: '0.0.0.0',
      }
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1598833771771_3200';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};


exports.io = {
  init: {

  },
  namespace: {
    "/": {
        connectionMiddleware: [],
        packetMiddleware: []
    },
    "/operate": {
      connectMiddleware: [],
      packetMiddleware: []
    },
    redis: {
      host: "127.0.0.1",
      port: 5060 ,
      auth_pass: 123456789 ,
      db: 0
    }
  }
}
