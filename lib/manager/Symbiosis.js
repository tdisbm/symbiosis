var TrafficManager = require("./TrafficManager.js");

var Symbiosis = function(map, options) {
    this.validators = require("../validator/loader.js")(map);
    this.validators["map"].validate();

    this.io = require("socket.io")();
    this.tm = new TrafficManager(map, this.io);

    this.io.on("connect", function(socket){
        console.log(socket.handshake.query);
        socket.leave(socket.id);
    });

    if (typeof options === "object" && (options.listen === true && options.port)) {
        this.io.listen(options.port);
    }

    return this.io;
};

module.exports = Symbiosis;

