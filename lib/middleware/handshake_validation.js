'use strict';

const _ = require('lodash');
const EVENT_CONNECTION = 'connection';
const EVENT_DISCONNECT = 'disconnect';
const MODULE_PREFIX = 'symbiosis_';

module.exports = (io, config) => {
 io.use((socket, next) => {
   const nodes = _.get(config, 'nodes', []);
   let found = false;

   for (let i = 0, n = nodes.length; i < n; i++) {
     found = false;
     for (let j = 0, m = nodes[i].handshake.parameters.length; j < m; j++) {
       if (nodes[i].handshake.parameters[j].options.indexOf("identifier") != -1) {
         if (nodes[i].name == socket.handshake.query[nodes[i].handshake.parameters[j].name]) {
           found = nodes[i].name;
           break;
         }
       }
     }
     if (found) {
       socket.join(MODULE_PREFIX + found);
       next();
       break;
     }
   }
 })
};