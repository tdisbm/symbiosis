'use strict';

const Feedback = require('../../lib/middleware/elements/Feedback');
const util = require('util');
const _ = require('lodash');

let streams = {};

const events = {
  stream_start : (socket, data, io) => {
    const interval = _.get(data, 'interval', null);
    const device_name = _.get(data, 'device_name', null);
    const key = _.get(data, 'key', null);

    if (interval && key) {
      const device_data_source = _.get(io, 'server.symbiosis_device.sources.device_data');
      let parameters = {};

      if (device_name) {
        parameters.device_name = device_name;
      }

      streams[socket.id][key] = setInterval(function() {
        socket.emit('stream_data:' + key, device_data_source(socket, parameters));
      }, interval);
    }
  },
  stream_stop: (socket, data) => {
    const key = _.get(data, 'key', null);
    clearInterval(streams[socket.id][key]);
  }
};

const lifecycles = {
  connect: (socket) => {
    streams[socket.id] = {};
  },
  disconnect: (socket) => {
    delete streams[socket.id];
  }
};

module.exports = {
  lifecycles: lifecycles,
  events: events
};
