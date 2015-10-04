var utils = require("./utils/loader.js");
var storage = require("./storage/loader.js");

var Symbiosis = function(map, options) {
    this.handshake = map.handshake;
    this.map = map;
    this.streams = {};

    this.io = require("socket.io")();

    this.dataStorage = new storage["dataStorage"](this);
    this.roomStorage = new storage["roomStorage"](this);

    var $this = this;
    this.io.on("connect", function(socket){
        var query = socket.handshake.query;

        socket.join($this.roomStorage.getRoom(query));
        socket.leave(socket.id);
    });

    this.registerStreams(this.map);

    if (typeof options === "object" && options.hasOwnProperty("port")) {
        this.io.listen(options.port);
    }
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

module.exports = function(map, options) {
    var validators = require("./validator/loader.js")(map);
    validators["map"].validate();

    return new Symbiosis(map, options);
};

