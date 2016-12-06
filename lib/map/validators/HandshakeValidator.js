'use strict';

const _ = require('lodash');
const Validator = require('./Validator');

class HandshakeValidator extends Validator {
  validate(elements) {
    const nodes = _.get(elements, 'nodes', []);
    _.each(nodes, (node_data) => {
      const handshake = _.get(node_data, 'handshake', null);
      if (null === handshake) {
        throw new Error('Handshake is not defined for node \'' + node_data.name + '\'')
      }

      const parameters = _.get(handshake, 'parameters', null);
      if (null === parameters) {
        throw new Error('Parameters are mandatory for every handshake node');
      }

      let identifiers = 0;
      let names = [];

      _.each(parameters, (parameter) => {
        if (null === _.get(parameter, 'options', null)) {
          return null;
        }

        if (null === _.get(parameter, 'name', null)) {
          throw new Error('Every handshake parameter should have a name')
        }
        names.push(parameter.name);

        _.each(parameter.options, (option) => {
          if (option === 'identifier') {
            identifiers++;
          }
        });

        if (_.uniq(names).length !== names.length) {
          throw new Error('Parameter name should be unique');
        }
      });

      if (1 != identifiers) {
        throw new Error ('Handshake must have one identifier')
      }
    });
  }
}

module.exports = new HandshakeValidator();