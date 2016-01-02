var utils = require("./utils/loader.js");
var storage = require("./storage/loader.js");

var Symbiosis = function(map, app) {
    this.handshake = map.handshake;
    this.map = map;
    this.streams = {};

    this.io = require("socket.io")(app);

    this.dataStorage = new storage["dataStorage"](this);
    this.roomStorage = new storage["roomStorage"](this);

    this.registerStreams(this.map);

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

    return this;
};

module.exports = function(map, options) {
    var validators = require("./validator/loader.js")(map);
    validators["map"].validate();

    return new Symbiosis(map, options);
};

