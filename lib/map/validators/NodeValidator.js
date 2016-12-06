'use strict';

const _ = require('lodash');
const Validator = require('./Validator');

class NodeValidator extends Validator {
  validate(elements) {
    const nodes = _.get(elements, 'nodes', null);

    if (null === nodes || !_.isArray(nodes)) {
      throw new Error('Nodes are not defined');
    }

    _.each(nodes, (node_data) => {
      if (
        !_.get(node_data, 'handshake', null) ||
        !_.get(node_data, 'modules', null) ||
        !_.get(node_data, 'name', null)
      ) {
        throw new Error('Invalid node configuration')
      }
    });
  }
}

module.exports = new NodeValidator();