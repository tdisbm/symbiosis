var Stream = function(args) {
    var channel = null;
    var $this = this;

    var startOn = args.config.propagation.condition["start-on"].split(":");
    var stopOn  = args.config.propagation.condition["stop-on"].split(":");

    var conditions = {
        "hasSockets" : function(room) {
            return args.tm.io.sockets.adapter.rooms.hasOwnProperty(room);
        }
    };

    args.tm.io.on("connect", function(socket){
        var query = socket.handshake.query;

        if (query[args.tm.handshake["entity-identifier"]] !== startOn[0]) {
            return;
        }

        if (conditions[startOn[1]](args.tm.getRoom(query)) === eval(startOn[2])) {
            $this.start();
        }

        socket.on("disconnect", function(){
            var query = socket.handshake.query;

            if (query[args.tm.handshake["entity-identifier"]] !== stopOn[0]) {
                return;
            }

            if (conditions[stopOn[1]](args.tm.getRoom(query)) === eval(stopOn[2])) {
                $this.stop();
            }

            args.tm.reevaluateRoom(query);
        });
    });

    this.streams = {
        "interval" : {
            "start" : function() {
                if (channel !== null) {
                    return;
                }
                channel = setInterval(function() {
                    var data = $this.collectData(args.nodes, args.config.properties);
                    var rooms = args.tm.rooms[args.query[args.tm.handshake["entity-room"]]];

                    args.config["socket-events"].forEach(function(event){
                        args.config.to.forEach(function(node){
                            args.tm.io.sockets.in(rooms[node]).emit(event, data);
                        });
                    })
                }, args.config.propagation.timeout);
            },
            "stop"  : function() {
                clearInterval(channel);
                channel = null;
            }
        }
    };
    this.config = args.config;
};

Stream.prototype.start = function() {
    if(!this.streams.hasOwnProperty(this.config.propagation.type)) {
        throw new Error("Invalid stream type");
    }

    this.streams[this.config.propagation.type].start();
};

Stream.prototype.stop = function() {
    if(!this.streams.hasOwnProperty(this.config.propagation.type)) {
        throw new Error("Invalid stream type");
    }

    this.streams[this.config.propagation.type].stop();
};

Stream.prototype.collectData = function(nodes, properties) {
    var data = {};

    for (var node in nodes) {
        if (!nodes.hasOwnProperty(node)) {
            continue;
        }

        data[node] = {};
        properties.forEach(function(property){
            data[node][property] = nodes[node][property];
        })
    }

    return data;
};

Stream.prototype.name = "stream";


module.exports = Stream;