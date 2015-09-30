var Symbiosis = function(map, options) {
    this.io = require("socket.io")();
    this.map = map;

    this.validators = require("../validator/loader.js")(this.map);
    this.validators["map"].validate();
    this.validators["entity"].validate();

    var TrafficManager = require("./TrafficManager.js");
    var tm = new TrafficManager(this.map, this.io);

    this.io.on("connect", function(socket){
        socket.leave(socket.id);
    });

    if (typeof options === "object" && (options.listen === true && options.port)) {
        this.io.listen(options.port);
    }

    return this;
};

module.exports = Symbiosis;

