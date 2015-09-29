var TrafficManager = require("./TrafficManager.js");

var Symbiosis = function(map, options) {
    this.io = require("socket.io")();

    TrafficManager = new TrafficManager(map, this.io);

    this.io.use(function(socket, next) {
        var handshake = socket.handshake.query;

        if (handshake.hasOwnProperty(TrafficManager.handshake["entity-identifier"]) &&
            handshake.hasOwnProperty(TrafficManager.handshake["entity-room"])) {
            var config = {
                "entity" : handshake[TrafficManager.handshake["entity-identifier"]],
                "room"   : handshake[TrafficManager.handshake["entity-room"]]
            };
            TrafficManager.addRoom(config);

            socket.join(TrafficManager.getRoom(config));

            socket.on("disconnect", function(){
                TrafficManager.rewindRoom(config);
            });
            next();
        }
    });

    this.io.on("connect", function(socket){
        socket.leave(socket.id);
    });

    if (typeof options === "object" && (options.listen === true && options.port)) {
        this.io.listen(options.port);
    }

    return this.io;
};

module.exports = Symbiosis;

