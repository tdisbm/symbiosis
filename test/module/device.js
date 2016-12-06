'use strict';

const Feedback = require('../../lib/middleware/elements/Feedback');
const util = require('util');
const _ = require('lodash');

let devices = {};
let devices_names = {};

const sources = {
  device_data : (socket, data) => {
    const devices_data = _.get(devices, _.get(socket, 'handshake.query.email'), null);
    const device_name = _.get(data, 'device_name', null);

    let response = new Feedback();

    if (!devices_data) {
      return response
        .setStatus(Feedback.FEEDBACK_STATUS_FAILURE)
        .setData({
          "message" : "No devices"
        })
      ;
    }

    if (device_name) {
      for (let i = 0; i < devices_data.length; i++) {
        if (device_name == devices_data[i].name) {
          response.setData(devices_data[i].name);
        }
      }
    } else {
      response.setData(devices_data);
    }

    return response;
  },
  device_name_list : (socket) => {
    const names = _.get(devices_names, _.get(socket, 'handshake.query.email', null), []);
    let response = new Feedback();

    if (!names) {
      response.setStatus(Feedback.FEEDBACK_STATUS_FAILURE);
    }

    return response.setData(names);
  }
};

const events = {
  device_data_push : (socket, data) => {
    const device_name = _.get(socket, 'handshake.query.name', null);
    const email = _.get(socket, 'handshake.query.email', null);
    let device_data = _.get(devices, email, []);

    for (let i = 0; i < device_data.length; i++) {
      if (device_data[i].name == device_name) {
        device_data[i].devices = data;
        break;
      }
    }
  }
};

const lifecycles = {
  connect: (socket, io) => {
    const email = _.get(socket, 'handshake.query.email');
    const name = _.get(socket, 'handshake.query.name');

    let d = devices[email];
    let dn = devices_names[email];

    if (typeof d === 'undefined') {
      d = devices[email] = [];
    }

    if (typeof dn === 'undefined') {
      dn = devices_names[email] = [];
    }

    if (dn.indexOf(name) !== -1) {
      socket.disconnect();
      return;
    }

    dn.push(name);
    d.push({
      name: name,
      data: null,
      devices: []
    });

    io.to('symbiosis_user').emit(
      'device_name_list:update',
      sources.device_name_list(socket)
    )
  },
  disconnect: (socket, io) => {
    const email = _.get(socket, 'handshake.query.email');
    const name = _.get(socket, 'handshake.query.name');

    _.pull(_.get(devices_names, email, []), name);
    _.remove(_.get(devices_names, email, []), {
      name: name
    });

    io.to('symbiosis_user').emit(
      'device_name_list:update',
      sources.device_name_list(socket)
    )
  }
};

module.exports = {
  lifecycles: lifecycles,
  sources: sources,
  events: events
};