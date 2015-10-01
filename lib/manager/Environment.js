var utils = require("../utils/loader.js");

var Environment = function(args) {
    this.channels = {};
    this.validators = require("../validator/loader")(args.tm.map);

    var $this = this;

    args.tm.io.on("connect", function(socket){
        var query = socket.handshake.query;
        var room = args.tm.getRoom(query);

        if (!$this.channels.hasOwnProperty(room) &&
            Object.keys(args.nodes).indexOf(query[args.tm.handshake["entity-identifier"]])
        ) {
            $this.registerChannel(room, query, args)
        }
    });
};

Environment.prototype.registerChannel = function(room, query, args) {
    var channel = {
        "nodes" : {},
        "streams" : {}
    };

    for (var node in args.nodes) {
        if (!args.nodes.hasOwnProperty(node)) {
            continue;
        }

        channel.nodes[node] = new args.nodes[node]();
    }

    for (var stream in args.config.streams){
        if (!args.config.streams.hasOwnProperty(stream)) {
            continue;
        }

        channel.streams[stream] = new utils.stream({
            "config" : args.config.streams[stream],
            "nodes"  : channel.nodes,
            "query"  : query,
            "tm"     : args.tm
        });
    }

    this.channels[room] = channel;
};

Environment.prototype.name = "environment";

module.exports = Environment;