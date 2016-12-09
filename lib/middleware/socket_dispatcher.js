'use strict';

const _ = require('lodash');
const Feedback = require('./elements/Feedback');
const EVENT_CONNECTION = 'connection';
const EVENT_DISCONNECT = 'disconnect';
const MODULE_PREFIX = 'symbiosis_';

module.exports = (io, bindable) => {
  const module_name = MODULE_PREFIX + _.get(bindable, 'module_name', null);
  const sources = _.get(bindable, 'sources', {});
  const events = _.get(bindable, 'events', {});
  const lifecycles = _.get(bindable, 'lifecycles', {});
  const lifecycles_connect = _.get(lifecycles, 'connect', {});
  const lifecycles_disconnect = _.get(lifecycles, 'disconnect', {});

  if (_.isNull(module_name)) {
    return;
  }

  io.on(EVENT_CONNECTION, (socket) => {
    if (!_.get(socket, 'rooms.' + module_name, null)) {
      return;
    }

    _.isFunction(lifecycles_connect)
      ? lifecycles_connect(socket, io)
      : _.each(lifecycles_connect, (lifecycle) => lifecycle(socket, io));

    _.each(sources, (source, source_id) => {
      socket.on(source_id, (data) => socket.emit(source_id, source(socket, data, io)));
    });

    _.each(events, (event, event_id) => {
      socket.on(event_id, (data) => {
        const feedback = event(socket, data, io);

        if (feedback instanceof Feedback) {
          const feedback_status = feedback.getStatus();
          const feedback_data = feedback.getData();
          if (status) {
            socket.emit(event_id + '.' + feedback_status, feedback_data);
          }
        }
      });
    });

    socket.on(EVENT_DISCONNECT, () => {
      _.isFunction(lifecycles_disconnect)
        ? lifecycles_disconnect(socket, io)
        : _.each(lifecycles_disconnect, (lifecycle) => lifecycle(socket, io));
    });
  });

  _.set(io, module_name, {
    lifecycles: lifecycles,
    sources: sources,
    events: events
  });
};