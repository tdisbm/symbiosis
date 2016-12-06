'use strict';

const map = require('./lib/map/Map');
const FileUtils = require('./lib/services/FileUtils');
const _ = require('lodash');

class Symbiosis {
  constructor(config, server) {
    this.loadConfig(config);
    this.loadSocket(server);
    this.loadModules();
  }

  loadConfig(config) {
    let toLoad = [];

    if (_.isString(config)) {
      toLoad.push(config);
    }

    if (_.isArray(config)) {
      toLoad = config;
    }

    if (0 === toLoad.length ) {
      return;
    }

    map.load(toLoad);
  }

  loadSocket(server) {
    this.io = require('socket.io')(server);
    require('./lib/middleware/handshake_validation')(this.io, map.getElements());
  }

  loadModules() {
    const nodes = _.get(map.getElements(), 'nodes', null);

    _.each(nodes, (config) => {
      const modules = _.get(config, 'modules', []);
      let module_data = {};

      _.each(modules, (module) => {
        module_data = _.merge(
          module_data,
          require(FileUtils.getFullPath(module))
        );
      });

      module_data.module_name = config.name;
      require('./lib/middleware/socket_dispatcher')(this.io, module_data);
    })
  }
}

module.exports = function(config, server) {
  return new Symbiosis(config, server);
};