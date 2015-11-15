var utils = require("./utils/loader.js");
var storage = require("./storage/loader.js");

var Symbiosis = function(map, app) {
    this.handshake = map.handshake;
    this.map = map;
    this.streams = {};
    this.triggers = {};

    this.io = require("socket.io")(app);

    this.socketStorage = new storage["socketStorage"](this);
    this.dataStorage = new storage["dataStorage"](this);
    this.roomStorage = new storage["roomStorage"](this);

    this.registerStreams(this.map);
    this.registerTriggers(this.map);

    return this.io;
};


Symbiosis.prototype.registerStreams = function(map) {
    for (var stream in map.streams) {
        if (!map.streams.hasOwnProperty(stream)) {
            continue;
        }

        this.streams[stream] = new utils.stream({
            "config" : map.streams[stream],
            "symbiosis" : this
        });
    }
};

Symbiosis.prototype.registerTriggers = function(map) {
    for (var trigger in map.triggers) {
        if (!map.triggers.hasOwnProperty(trigger)) {
            continue;
        }

        this.triggers[trigger] = new utils.trigger({
            "config" : map.triggers[trigger],
            "symbiosis" : this
        });
    }
};

module.exports = function(map, options) {
    var validators = require("./validator/loader.js")(map);
    validators["map"].validate();

    return new Symbiosis(map, options);
};

